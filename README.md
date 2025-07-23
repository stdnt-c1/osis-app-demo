# Website OSIS SMKN 7 Samarinda

This repository contains the source code for the OSIS (Student Organization) SMKN 7 Samarinda website. It is a modern, responsive web application built with HTML, CSS, and JavaScript, featuring both public-facing pages and an administrative dashboard with CRUD (Create, Read, Update, Delete) functionality.

## Project Overview

The project aims to provide a functional, visually appealing, and maintainable web presence for OSIS SMKN 7 Samarinda. The current development focuses on stabilizing the modularized frontend and integrating a robust backend solution.

## Features

-   **Modularized Frontend:** Organized into separate HTML, CSS, and JavaScript files for improved maintainability.
-   **Public-Facing Pages:** Includes sections for Home, Gallery, News & Events, Financial Transparency, and Suggestions.
-   **Admin Dashboard:** Provides administrative tools for managing content, users, and financial data.
-   **Supabase Integration:** Utilizes Supabase for database management, authentication, and Row Level Security (RLS).
-   **Simulated File Uploads:** Includes a simulated AWS S3 integration for file uploads.
-   **Progressive Web App (PWA) Features:** Configured with a web app manifest and service worker for offline caching and push notifications.
-   **Dark Mode:** (Removed)

## Project Structure

The project follows a modularized file structure:

```
./
├── index.html                  # Main public-facing website entry point
├── manifest.json               # Web app manifest file for PWA
├── service-worker.js           # Service worker for PWA offline caching and push notifications
├── admin/
│   ├── dashboard.html          # Admin dashboard main page
│   └── login.html              # Admin login page
├── assets/
│   ├── css/
│   │   ├── main.css            # Public CSS Entry Point
│   │   ├── admin-main.css      # Admin CSS Entry Point
│   │   ├── base/
│   │   │   ├── _base.css       # Global resets, typography, container styles
│   │   │   └── _dark-mode.css  # Styles for dark mode theme
│   │   ├── components/         # Reusable UI component styles
│   │   └── public/             # Styles specific to public-facing sections
│   │   └── admin/              # Styles specific to admin dashboard sections
│   ├── img/                    # Folder for images (placeholder)
│   ├── icons/                  # Folder for PWA icons
│   └── js/
│       ├── public/             # JavaScript modules for the public site
│       │   ├── app.js          # Public JS Entry Point
│       │   ├── slider.js       # Hero slider functionality
│       │   ├── gallery.js      # Public gallery rendering and modal display
│       │   ├── news.js         # Public news and events rendering
│       │   ├── finance.js      # Public finance display and Chart.js integration
│       │   ├── suggestions.js  # Public suggestions form submission
│       │   ├── navigation.js   # Public site navigation
│       │   ├── utils.js        # General utility functions
│       │   ├── push-notifications.js # PWA push notification logic
│       │   └── dark-mode.js    # Dark mode theme switching
│       └── admin/              # JavaScript modules for the admin dashboard
│           ├── app.js          # Admin JS Entry Point
│           ├── auth.js         # Admin login authentication
│           ├── config.js       # Contains Supabase and AWS credentials (for development)
│           ├── supabase.js     # Initializes Supabase client
│           ├── navigation.js   # Admin sidebar navigation, logout, and mobile menu
│           ├── overview.js     # Admin dashboard overview statistics
│           ├── berita.js       # Admin news and event management (CRUD)
│           ├── gallery.js      # Admin gallery management (CRUD)
│           ├── finance.js      # Admin finance management (CRUD)
│           ├── suggestions.js  # Admin suggestions management (CRUD)
│           ├── users.js        # Admin user management (CRUD)
│           ├── forms.js        # Centralized handling for all admin CRUD forms
│           ├── modals.js       # General modal open/close functions
│           ├── utils.js        # General utility functions
│           └── s3-upload.js    # Handles simulated S3 file uploads
└── supabase/
    └── schema.sql              # Contains the SQL schema for the database
```

## Current Status & Known Issues

-   **Modularization:** The project is fully modularized.
-   **HTML/CSS/JS References:** All file references and module imports/exports are correctly configured.
-   **Data Handling:** Data is now managed via Supabase, replacing previous `localStorage` usage.
-   **Image References:** Placeholder image URLs have been updated for consistency.

**Important Note on Local Development:**

Due to browser security policies (CORS), opening `index.html` directly from the file system (`file:///` protocol) will prevent JavaScript modules from loading and executing, resulting in a non-functional dynamic content. **The project MUST be served via a local web server** (e.g., using Python's `http.server` or Node.js's `http-server`) and accessed via `http://localhost:PORT` (e.g., `http://localhost:8000`).

## Roadmap

### Completed Tasks

-   **Photo Management:** All placeholder photos have been replaced with new mockups.
-   **Backend API Integration:** Supabase is integrated as the backend for data management.
-   **Authentication System:**
    -   User authentication implemented using Supabase Auth.
    -   User registration and login flows are functional.
    -   Role-Based Access Control (RBAC) is implemented.
    -   User management (CRUD operations) is available in the admin dashboard.
-   **File Uploads:** Simulated AWS S3 integration for file uploads is in place.
-   **Email Notification System:** A simulated email notification system is integrated.
-   **PWA Features:** Service worker, web app manifest, and push notification setup are complete.
-   **Dark Mode Theme:** Dark mode functionality has been added.

### Future Enhancements

-   **Backend API Integration:**
    -   Define API endpoints (Supabase handles this).
    -   Choose a backend technology (Supabase).
    -   Set up a database (Supabase PostgreSQL).
-   **Supabase Integration:**
    -   Utilize Supabase for storage (currently simulated AWS S3).
-   **SQL Files for Datatable Creations:**
    -   Add scripts for seeding initial data.
-   **Controlled Account for Login:**
    -   Develop proper routes and data encryption.
    -   Encrypt sensitive data in transit (HTTPS).
    -   Encrypt sensitive data at rest in the database.
-   **Email Notification System:**
    -   Integrate a real email service (e.g., Nodemailer, SendGrid).
    -   Implement notifications for new suggestions, user registration, etc.
-   **Multi-language Support:** Add support for multiple languages.
-   **UI/UX Refinement:**
    -   Conduct user feedback sessions.
    -   Improve accessibility (ARIA attributes, keyboard navigation).
    -   Add micro-interactions and animations.
-   **Comprehensive Testing:**
    -   Set up a testing framework (e.g., Jest, Cypress).
    -   Write unit tests for utility functions and components.
    -   Write integration tests for CRUD operations.
    -   Write end-to-end tests for user flows.

## Design Guidelines

-   **Color Scheme:** Primary Orange (#FF7F00), Secondary Orange (#FFA040), Dark Text (#333333), Light Gray (#F2F2F2), White (#FFFFFF).
-   **Typography:** Poppins font family with semantic heading sizes.
-   **Responsive Design:** Mobile-first approach.
-   **UI Patterns:** Consistent spacing and modern UI patterns.

## Code Standards

-   Semantic HTML5 elements.
-   CSS BEM methodology (where applicable).
-   Modern JavaScript ES6+ features.
-   Proper error handling.
-   Appropriate accessibility attributes.

## Browser Compatibility

-   **Target Browsers:** Chrome, Firefox, Safari, Edge.
-   **Graceful Degradation:** Ensure graceful degradation for older browsers.
-   **Responsive Testing:** Test across different screen sizes.

## Deployment

-   **Vercel Deployment:** Initialized on the root (`./`) of the project.

### Docker Deployment

To run the application using Docker, follow these steps:

1.  **Build the Docker Image:**
    Navigate to the root directory of the project in your terminal and run:
    ```bash
    docker build -t osis-smkn7-website .
    ```

2.  **Run the Docker Container:**
    ```bash
    docker run -p 80:80 osis-smkn7-website
    ```
    This command maps port 80 of the container to port 80 on your host machine.

3.  **Access the Application:**
    Open your web browser and navigate to:
    ```
    http://localhost
    ```
    If port 80 is already in use, you can map to a different port (e.g., 8080):
    ```bash
    docker run -p 8080:80 osis-smkn7-website
    ```
    Then access the application at `http://localhost:8080`.

    **To access from other devices on your network:**
    Replace `localhost` with your host machine's IP address (e.g., `http://192.168.1.100`). You can find your host machine's IP address by running `ipconfig` (Windows) or `ifconfig` / `ip a` (Linux/macOS) in your terminal.

## Security Notes

-   This is a frontend-only demo with simulated backend interactions.
-   In a production environment, proper backend authentication and input sanitization are crucial.
-   Always use HTTPS in production.
-   **Note:** Supabase credentials are currently stored in a `config.js` file for development purposes. This is not a secure practice for production and should be replaced with a more secure solution like environment variables.