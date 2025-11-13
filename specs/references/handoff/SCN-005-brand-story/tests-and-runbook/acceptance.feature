Feature: Brand story experience (REQ-005)

  @TST-E2E-007
  Scenario: Hero communicates mission
    Given I open the brand story page
    Then the hero headline contains "Turning Pedals into Power"
    And the supporting copy references affordability and quality promise

  @TST-E2E-007
  Scenario: Timeline renders milestones
    Given I scroll to the timeline section
    Then I see milestones for 2019, 2021, and 2024 with descriptions and imagery

  @TST-E2E-007
  Scenario: Impact metrics animate and remain accessible
    Given the impact metrics band enters the viewport
    Then the counters animate up to their target values
    And screen readers announce the metrics via aria-live updates

  @TST-E2E-007
  Scenario: Community spotlight links to deeper story
    Given I reach the community spotlight carousel
    When I activate the "Meet Aarti" card
    Then I navigate to the linked blog article in a new tab

  @TST-E2E-007
  Scenario: CTA strip routes to dealers and support
    Given I am on the brand story page
    When I click "Find a dealer"
    Then I move to "/dealers"
    And a `brand_cta_click` event fires with target "dealers"
