# `assets/js/admin/` Directory

This directory contains JavaScript modules specifically designed for the administrative dashboard of the OSIS SMKN 7 Samarinda website.

## Purpose and Function

The `admin/` directory centralizes the client-side scripting for the backend management interface, handling authentication, data manipulation (CRUD operations), and dynamic updates within the dashboard. Each file typically corresponds to a specific administrative feature or section.

## Contents

-   `app.js`: The main JavaScript entry point for the admin dashboard. It initializes all other admin-specific modules and sets up core dashboard functionalities.
-   `auth.js`: Manages user authentication for the admin login, interacting with Supabase Auth.
-   `config.js`: Stores configuration variables, including Supabase and simulated AWS credentials (for development purposes).
-   `supabase.js`: Initializes and exports the Supabase client for database interactions.
-   `navigation.js`: Handles sidebar navigation, mobile menu toggling, and logout functionality within the admin panel.
-   `overview.js`: Manages the display of statistics and recent activities on the dashboard overview page.
-   `berita.js`: Implements CRUD operations for news and event management.
-   `gallery.js`: Implements CRUD operations for gallery management.
-   `finance.js`: Implements CRUD operations for financial transaction management.
-   `suggestions.js`: Implements CRUD operations for managing user suggestions and feedback.
-   `users.js`: Implements CRUD operations for user management within the admin panel.
-   `forms.js`: Centralizes the handling of form submissions for all CRUD operations across different admin sections.
-   `modals.js`: Provides general functions for opening and closing modal dialogs.
-   `utils.js`: Contains general utility functions (e.g., `formatDate`, `formatCurrency`, `showNotification`) that are reused across various admin modules.
-   `vercel-blob.js`: Handles the file upload process to Vercel Blob.

These modules work in conjunction to provide a comprehensive and interactive administrative experience.