Feature: Blog experience (REQ-007)

  @TST-E2E-005
  Scenario: Blog listing shows featured and latest articles
    Given I visit the blog landing page
    Then I see a featured article hero and at least 4 article cards in the grid

  @TST-E2E-005
  Scenario: Tag filter narrows results without reload
    Given I am on the blog landing page
    When I select the tag "Tech"
    Then the URL query contains "tag=tech" and only tech-tagged posts appear

  @TST-E2E-005
  Scenario: Subscription banner posts via Formspree
    Given the subscription banner is visible
    When I submit my email "test@example.com"
    Then a success toast appears and the banner logs `blog_subscription_banner` with action submit

  @TST-E2E-005
  Scenario: Article renders metadata and table of contents
    Given I open the article "Solar Charging for E-bikes"
    Then I see author, publish date, reading time, and a table of contents that highlights the active section while scrolling

  @TST-E2E-005
  Scenario: Article exposes structured data
    Given I load the same article
    Then the page includes a BlogPosting JSON-LD payload that passes schema validation
