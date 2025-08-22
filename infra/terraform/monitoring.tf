# Cloud Monitoring and Alerting Configuration

# Notification channel for alerts (email)
resource "google_monitoring_notification_channel" "email" {
  count = var.notification_email != "" ? 1 : 0

  display_name = "Finspeed Email Notifications (${local.environment})"
  type         = "email"

  labels = {
    email_address = var.notification_email
  }

  enabled = true
}

# Uptime check for API service
resource "google_monitoring_uptime_check_config" "api_uptime_check" {
  count = var.enable_uptime_checks ? 1 : 0

  display_name = "Finspeed API Uptime Check (${local.environment})"
  timeout      = "10s"
  period       = "60s"

  http_check {
    path         = "/healthz"
    port         = "443"
    use_ssl      = true
    validate_ssl = true
  }

  monitored_resource {
    type = "uptime_url"
    labels = {
      project_id = local.project_id
      host       = replace(google_cloud_run_v2_service.api.uri, "https://", "")
    }
  }

  content_matchers {
    content = "\"status\":\"healthy\""
    matcher = "CONTAINS_STRING"
  }

  selected_regions = ["USA", "EUROPE", "ASIA_PACIFIC"]
}

# Uptime check for Frontend service
resource "google_monitoring_uptime_check_config" "frontend_uptime_check" {
  count = var.enable_uptime_checks ? 1 : 0

  display_name = "Finspeed Frontend Uptime Check (${local.environment})"
  timeout      = "10s"
  period       = "60s"

  http_check {
    path         = "/"
    port         = "443"
    use_ssl      = true
    validate_ssl = true
  }

  monitored_resource {
    type = "uptime_url"
    labels = {
      project_id = local.project_id
      host       = replace(google_cloud_run_v2_service.frontend.uri, "https://", "")
    }
  }

  selected_regions = ["USA", "EUROPE", "ASIA_PACIFIC"]
}

# Alert policy for API uptime
resource "google_monitoring_alert_policy" "api_uptime_alert" {
  count = var.enable_uptime_checks && var.notification_email != "" ? 1 : 0

  display_name = "Finspeed API Down Alert (${local.environment})"
  combiner     = "OR"
  enabled      = true

  conditions {
    display_name = "API Uptime Check Failed"

    condition_threshold {
      filter          = "metric.type=\"monitoring.googleapis.com/uptime_check/check_passed\" AND resource.type=\"uptime_url\" AND resource.labels.project_id=\"${local.project_id}\""
      duration        = "300s"
      comparison      = "COMPARISON_LT"
      threshold_value = 1

      aggregations {
        alignment_period   = "300s"
        per_series_aligner = "ALIGN_NEXT_OLDER"
      }
    }
  }

  notification_channels = [google_monitoring_notification_channel.email[0].id]

  alert_strategy {
    auto_close = "1800s"
  }
}

# Alert policy for high error rate
resource "google_monitoring_alert_policy" "high_error_rate" {
  count = var.notification_email != "" ? 1 : 0

  display_name = "Finspeed High Error Rate (${local.environment})"
  combiner     = "OR"
  enabled      = true

  conditions {
    display_name = "High 5xx Error Rate"

    condition_threshold {
      filter          = "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=\"${local.api_service_name}\" AND metric.type=\"run.googleapis.com/request_count\" AND metric.labels.response_code_class=\"5xx\""
      duration        = "300s"
      comparison      = "COMPARISON_GT"
      threshold_value = 5

      aggregations {
        alignment_period     = "300s"
        per_series_aligner   = "ALIGN_RATE"
        cross_series_reducer = "REDUCE_SUM"
      }
    }
  }

  notification_channels = [google_monitoring_notification_channel.email[0].id]
}

# Alert policy for high response latency
resource "google_monitoring_alert_policy" "high_latency" {
  count = var.notification_email != "" ? 1 : 0

  display_name = "Finspeed High Response Latency (${local.environment})"
  combiner     = "OR"
  enabled      = true

  conditions {
    display_name = "High P95 Response Latency"

    condition_threshold {
      filter          = "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=\"${local.api_service_name}\" AND metric.type=\"run.googleapis.com/request_latencies\""
      duration        = "300s"
      comparison      = "COMPARISON_GT"
      threshold_value = 1000 # 1 second in milliseconds

      aggregations {
        alignment_period     = "300s"
        per_series_aligner   = "ALIGN_DELTA"
        cross_series_reducer = "REDUCE_PERCENTILE_95"
      }
    }
  }

  notification_channels = [google_monitoring_notification_channel.email[0].id]
}

# Alert policy for database connection issues
resource "google_monitoring_alert_policy" "database_connection" {
  count = var.notification_email != "" ? 1 : 0

  display_name = "Finspeed Database Connection Issues (${local.environment})"
  combiner     = "OR"
  enabled      = true

  conditions {
    display_name = "High Database Connection Count"

    condition_threshold {
      filter          = "resource.type=\"cloudsql_database\" AND resource.labels.database_id=\"${local.project_id}:${google_sql_database_instance.postgres.name}\" AND metric.type=\"cloudsql.googleapis.com/database/postgresql/num_backends\""
      duration        = "300s"
      comparison      = "COMPARISON_GT"
      threshold_value = 80 # 80% of max connections

      aggregations {
        alignment_period   = "300s"
        per_series_aligner = "ALIGN_MEAN"
      }
    }
  }

  notification_channels = [google_monitoring_notification_channel.email[0].id]
}

# Custom dashboard for Finspeed metrics
resource "google_monitoring_dashboard" "finspeed_dashboard" {
  dashboard_json = jsonencode({
    displayName = "Finspeed Dashboard (${local.environment})"
    mosaicLayout = {
      columns = 12
      tiles = [
        {
          width  = 6
          height = 4
          widget = {
            title = "API Request Rate"
            xyChart = {
              dataSets = [{
                timeSeriesQuery = {
                  timeSeriesFilter = {
                    filter = "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=\"${local.api_service_name}\" AND metric.type=\"run.googleapis.com/request_count\""
                    aggregation = {
                      alignmentPeriod    = "60s"
                      perSeriesAligner   = "ALIGN_RATE"
                      crossSeriesReducer = "REDUCE_SUM"
                    }
                  }
                }
                plotType = "LINE"
              }]
              timeshiftDuration = "0s"
              yAxis = {
                label = "Requests/sec"
                scale = "LINEAR"
              }
            }
          }
        },
        {
          width  = 6
          height = 4
          xPos   = 6
          widget = {
            title = "API Response Latency (P95)"
            xyChart = {
              dataSets = [{
                timeSeriesQuery = {
                  timeSeriesFilter = {
                    filter = "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=\"${local.api_service_name}\" AND metric.type=\"run.googleapis.com/request_latencies\""
                    aggregation = {
                      alignmentPeriod    = "60s"
                      perSeriesAligner   = "ALIGN_DELTA"
                      crossSeriesReducer = "REDUCE_PERCENTILE_95"
                    }
                  }
                }
                plotType = "LINE"
              }]
              timeshiftDuration = "0s"
              yAxis = {
                label = "Latency (ms)"
                scale = "LINEAR"
              }
            }
          }
        },
        {
          width  = 6
          height = 4
          yPos   = 4
          widget = {
            title = "Database Connections"
            xyChart = {
              dataSets = [{
                timeSeriesQuery = {
                  timeSeriesFilter = {
                    filter = "resource.type=\"cloudsql_database\" AND resource.labels.database_id=\"${local.project_id}:${google_sql_database_instance.postgres.name}\" AND metric.type=\"cloudsql.googleapis.com/database/postgresql/num_backends\""
                    aggregation = {
                      alignmentPeriod  = "60s"
                      perSeriesAligner = "ALIGN_MEAN"
                    }
                  }
                }
                plotType = "LINE"
              }]
              timeshiftDuration = "0s"
              yAxis = {
                label = "Connections"
                scale = "LINEAR"
              }
            }
          }
        },
        {
          width  = 6
          height = 4
          xPos   = 6
          yPos   = 4
          widget = {
            title = "Error Rate by Response Code"
            xyChart = {
              dataSets = [{
                timeSeriesQuery = {
                  timeSeriesFilter = {
                    filter = "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=\"${local.api_service_name}\" AND metric.type=\"run.googleapis.com/request_count\""
                    aggregation = {
                      alignmentPeriod    = "60s"
                      perSeriesAligner   = "ALIGN_RATE"
                      crossSeriesReducer = "REDUCE_SUM"
                      groupByFields      = ["metric.label.response_code_class"]
                    }
                  }
                }
                plotType = "STACKED_AREA"
              }]
              timeshiftDuration = "0s"
              yAxis = {
                label = "Requests/sec"
                scale = "LINEAR"
              }
            }
          }
        }
      ]
    }
  })
}
