Feature: Support hub (REQ-008)

  @TST-E2E-006
  Scenario: Support email link exposes SLA and opens mail client
    Given I load the support hub
    Then I see "support@finspeed.online" with the promise "Replies within 6 hours"
    When I click the email link
    Then my default mail client opens a draft to support@finspeed.online

  @TST-E2E-006
  Scenario: WhatsApp CTA honours consent
    Given I decline analytics consent
    When I click the WhatsApp channel tile
    Then I see a modal asking to enable analytics before launching WhatsApp

  @TST-E2E-006
  Scenario: FAQ search filters and highlights results
    Given the FAQ section is visible
    When I search for "warranty"
    Then only FAQs containing "warranty" appear and the term is highlighted

  @TST-E2E-006
  Scenario: Incident banner appears when status feed set
    Given the status feed indicates WhatsApp outage
    Then the incident banner "WhatsApp support is currently unavailable" is displayed above the channel tiles

  @TST-E2E-006
  Scenario: Support form submits via Formspree
    Given WhatsApp channel is disabled by feature flag
    When I submit the support form with message "Need help"
    Then I see a confirmation message and a `support_channel_click` event is not fired
