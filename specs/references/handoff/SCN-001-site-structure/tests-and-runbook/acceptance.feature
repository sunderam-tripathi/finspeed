Feature: Site shell experience (REQ-001)

  @TST-E2E-001
  Scenario: Visitors navigate to product categories from landing page
    Given I open the Finspeed home page as an English visitor
    When I open the primary navigation
    Then I see the navigation links "Bicycles", "Models", and "Brand"
    And the "Find a Dealer" CTA is visible
    When I follow the "Bicycles" link
    Then I am routed to "/catalog"

  @TST-E2E-007
  Scenario: Language toggle respects browser preference and manual switch
    Given I open the Finspeed home page with browser locale "hi"
    Then the hero headline renders Hindi copy
    When I switch the language toggle to "English"
    Then the hero headline updates to the English tagline
    And an analytics event "language_change" is emitted with from_locale "hi" and to_locale "en"

  @TST-E2E-007
  Scenario: Dealer access remains one click away
    Given I open the home page on a mobile viewport
    When I open the hamburger menu
    Then the "Find a Dealer" CTA is pinned in the drawer header
    When I activate the CTA
    Then I am routed to "/dealers"

  @TST-E2E-007
  Scenario: Support contact surfaced in global footer
    Given I scroll to the footer on the home page
    Then I see both WhatsApp and email contact links
    When I click the WhatsApp option
    Then a new tab opens with the WhatsApp link defined in contact-points.yaml

  @TST-E2E-007
  Scenario: Missing translation falls back to English with warning
    Given I simulate a missing Hindi translation key for "hero.subtitle"
    When I switch the language toggle to "Hindi"
    Then the UI renders the English subtitle
    And the console logs a warning containing "i18n-miss" and the key name
