Feature: Catalog browsing and comparison (REQ-002)

  @TST-E2E-002
  Scenario: Category overview displays expected models
    Given I open the MTB catalog page
    Then I see 4 MTB cards with factory-direct pricing and value badges

  @TST-E2E-002
  Scenario: Filters narrow the results set
    Given I apply the filter "frame: High tensile steel frame"
    And I apply the filter "fork: Front suspension"
    Then the results update without page reload
    And an analytics event "catalog_filter_applied" is emitted with filter_id "fork" and results_count >= 1

  @TST-E2E-002
  Scenario: Empty state explains no matching models
    Given I apply filters that remove all models
    Then I see the empty state message "No models match your filters. Reset filters to view all bikes."
    And a reset control is available to clear filters

  @TST-E2E-002
  Scenario: Comparison drawer highlights differences
    Given I add two Road Racer models to comparison
    When I open the comparison drawer
    Then spec rows with differences are highlighted
    And an analytics event "catalog_compare_opened" includes both model slugs

  @TST-E2E-002
  Scenario: Removing a model emits analytics
    Given three models are in the comparison drawer
    When I remove one model
    Then the drawer remains open with the remaining two
    And an analytics event "catalog_compare_removed" contains the removed model slug
