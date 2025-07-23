# `assets/js/public/` Directory

This directory contains JavaScript modules specifically designed for the public-facing sections of the OSIS SMKN 7 Samarinda website.

## Purpose and Function

The `public/` directory centralizes the client-side scripting for the user-facing parts of the website, handling dynamic content, user interactions, and data presentation. Each file typically corresponds to a specific feature or section of the public site.

## Contents

-   `app.js`: The main JavaScript entry point for the public site. It initializes all other public-facing modules and sets up global functionalities.
-   `slider.js`: Manages the functionality of the hero image slider on the homepage.
-   `gallery.js`: Handles the rendering of the public photo gallery and the display of image modals.
-   `news.js`: Manages the display and filtering of news and event articles.
-   `finance.js`: Handles the display of financial transparency data, including Chart.js integration for visualizations.
-   `suggestions.js`: Manages the submission form for user suggestions and feedback.
-   `navigation.js`: Controls public site navigation elements, such as the hamburger menu, smooth scrolling, and tab switching.
-   `utils.js`: Contains general utility functions (e.g., `formatDate`, `formatCurrency`, `searchContent`) that are reused across various public modules.
-   `push-notifications.js`: Implements the logic for Progressive Web App (PWA) push notifications, including permission requests and subscription handling.
-   `dark-mode.js`: Manages the logic for switching between light and dark themes on the public site.

These modules work together to provide a rich and interactive experience for visitors to the OSIS website.