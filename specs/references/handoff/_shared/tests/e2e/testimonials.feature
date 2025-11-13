Feature: Testimonials carousel (REQ-006)

  @TST-E2E-007
  Scenario: Carousel displays testimonials and allows navigation
    Given I view the testimonials module on desktop
    When I press the next control
    Then the next testimonial card is focused and displayed

  @TST-E2E-007
  Scenario: Carousel supports keyboard navigation
    Given I focus the testimonials carousel
    When I press the right arrow key
    Then focus moves to the next testimonial and remains visible

  @TST-E2E-007
  Scenario: Autoplay respects reduced motion
    Given my system preference is reduced motion
    When I toggle autoplay on
    Then the carousel stays paused and shows a notice "Autoplay disabled for accessibility"

  @TST-E2E-007
  Scenario: Filtering by category updates cards
    Given the filter menu is visible
    When I select the category "MTB"
    Then only testimonials tagged "MTB" are displayed

  @TST-E2E-007
  Scenario: Analytics recorded for interactions
    Given I click the autoplay toggle
    Then an event "testimonial_autoplay_toggled" fires with enabled true
