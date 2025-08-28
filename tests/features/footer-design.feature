Feature: Footer Design and Layout
  As a visitor to the OctoCAT Supply website
  I want to see a well-designed and functional footer
  So that I can easily navigate to important links and information

  Background:
    Given I am on the OctoCAT Supply website
    And the page has fully loaded

  Scenario: Footer sections are displayed correctly
    When I scroll to the bottom of the page
    Then I should see the footer with 4 main sections
    And I should see an "About" section with company description
    And I should see an "Account" section with user-related links
    And I should see a "Helpful Links" section with support links
    And I should see a "Social Media" section with social platform links

  Scenario: About section contains correct information
    When I view the footer's About section
    Then I should see the heading "About"
    And I should see a description mentioning "OctoCAT Supply"
    And I should see text about "AI-powered smart products for your feline companions"
    And I should see text about "intelligent monitoring, interactive entertainment, and personalized comfort solutions"

  Scenario: Account section contains all expected links
    When I view the footer's Account section
    Then I should see the heading "Account"
    And I should see a "My Cart" link
    And I should see a "Checkout" link
    And I should see a "Shopping Details" link
    And I should see an "Order" link
    And I should see a "Help Center" link

  Scenario: Helpful Links section contains support and policy links
    When I view the footer's Helpful Links section
    Then I should see the heading "Helpful Links"
    And I should see a "Services" link
    And I should see a "Supports" link
    And I should see a "Feedback" link
    And I should see a "Terms & Conditions" link
    And I should see a "Privacy Policy" link

  Scenario: Social Media section contains all platform links
    When I view the footer's Social Media section
    Then I should see the heading "Social Media"
    And I should see a "Twitter" link
    And I should see a "Facebook" link
    And I should see a "Youtube" link
    And I should see a "Linkedin" link
    And I should see an "Instagram" link

  Scenario: Footer displays copyright information
    When I view the footer
    Then I should see a copyright notice
    And the copyright should contain "Copyright © 2025 OctoCAT Supply. All Rights Reserved"
    And the copyright should be separated from the main footer content with a border

  Scenario: Footer links have hover effects
    When I hover over any footer link
    Then the link should change color to indicate it's interactive
    And the hover effect should be smooth and visually appealing

  Scenario: Footer adapts to light theme
    Given the website is in light theme mode
    When I view the footer
    Then the footer background should be light gray
    And the text should be dark gray for good contrast
    And all section headings should be in the primary brand color

  Scenario: Footer adapts to dark theme
    Given the website is in dark theme mode
    When I view the footer
    Then the footer background should be dark gray
    And the text should be light gray for good contrast
    And all section headings should be in the primary brand color

  Scenario: Footer is responsive on mobile devices
    Given I am viewing the website on a mobile device
    When I scroll to the footer
    Then the footer sections should stack vertically in a single column
    And all content should remain readable and accessible
    And the spacing between sections should be appropriate for mobile viewing

  Scenario: Footer is responsive on tablet devices
    Given I am viewing the website on a tablet device
    When I scroll to the footer
    Then the footer sections should be arranged appropriately for tablet screen size
    And all content should remain readable and accessible

  Scenario: Footer is responsive on desktop devices
    Given I am viewing the website on a desktop device
    When I scroll to the footer
    Then the footer sections should be arranged in 4 columns
    And all content should be properly spaced and aligned
    And the footer should span the full width of the container

  Scenario: Theme transition is smooth
    Given I am viewing the footer
    When I switch between light and dark themes
    Then the footer should smoothly transition between theme colors
    And the transition should take approximately 300 milliseconds
    And there should be no visual glitches during the transition

  Scenario: Footer maintains consistent styling
    When I view the footer across different pages
    Then the footer styling should be consistent
    And the footer content should be identical
    And the footer positioning should be consistent at the bottom of each page
