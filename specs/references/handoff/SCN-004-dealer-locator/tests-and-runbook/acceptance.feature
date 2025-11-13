Feature: Dealer locator experience (REQ-004)

  @TST-E2E-004
  Scenario: Locate dealers by postal code
    Given I open the dealer locator
    When I search for postal code "201306" within 20 kilometers
    Then I see at least one dealer with distance shown in kilometers

  @TST-E2E-004
  Scenario: Filter dealers by services offered
    Given I have search results for postal code "201306"
    When I filter by service "test rides"
    Then only dealers offering "test rides" remain in the list
    And the map pins match the filtered results

  @TST-E2E-004
  Scenario: Invalid postal code gracefully handled
    Given I am on the dealer locator
    When I enter the postal code "000000"
    Then I see the validation message "Enter a valid Indian postal code"
    And the previous search values remain populated

  @TST-E2E-004
  Scenario: Map view anchors the search results
    Given I have filtered results
    When I hover over the first result
    Then the matching map pin is highlighted with a bounce animation

  @TST-E2E-004
  Scenario: Directions icon captures engagement
    Given I have a dealer result visible
    When I click the directions icon
    Then a new tab opens Google Maps with the dealer address prefilled
    And an analytics event "dealer_directions_click" is recorded with that dealer's id
