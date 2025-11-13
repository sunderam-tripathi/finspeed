Feature: Model detail experience (REQ-003)

  @TST-E2E-003
  Scenario: Model detail includes core information
    Given I open the "Storm 29" model detail page
    Then I see hero media, MSRP, warranty highlights, sizing guidance, and CTA copy

  @TST-E2E-003
  Scenario: Dealer call-to-action routes to locator with context
    Given I am viewing the "Storm 29" model detail page
    When I click "Find a dealer"
    Then I navigate to "/dealers?model=storm-29"
    And an analytics event "model_dealer_cta_click" fires with model_slug "storm-29"

  @TST-E2E-003
  Scenario: Dealer locator temporarily unavailable
    Given the dealer locator feature flag is disabled
    When I view the CTA panel
    Then the CTA is disabled with the tooltip "Dealer locator is currently down — contact support@finspeed.online"

  @TST-E2E-003
  Scenario: Mobile experience preserves essential content
    Given I view the model detail page on a 375px wide device
    Then I can scroll through specs and CTA without horizontal scrolling
    And the page meets the Lighthouse mobile LCP budget of 2.5s

  @TST-E2E-003
  Scenario: Structured data available for search engines
    Given the model detail page renders
    Then a JSON-LD Product payload validates with Google's Rich Results Test
