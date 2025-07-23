# `assets/css/` Directory

This directory contains all the Cascading Style Sheets (CSS) files that define the visual presentation and styling of the OSIS SMKN 7 Samarinda website.

## Purpose and Function

The `css/` directory is responsible for organizing and housing all stylesheets, ensuring a modular and maintainable approach to the website's design. It separates styles based on their scope (public vs. admin), their foundational nature (base), and their application to reusable UI components.

## Contents

-   `main.css`: The primary CSS entry point for the public-facing website. It imports various other CSS modules to compile the complete public stylesheet.
-   `admin-main.css`: The primary CSS entry point for the administrative dashboard. It imports admin-specific CSS modules.
-   `base/`: Contains foundational CSS styles that apply globally or provide basic resets and typography.
-   `components/`: Houses CSS for reusable UI components such as buttons, forms, modals, badges, filters, tables, and utility classes.
-   `public/`: Contains CSS specific to the public-facing sections of the website, including styles for the header, hero section, quick info, call-to-action elements, gallery, news, finance, suggestions, and responsive adjustments.
-   `admin/`: Contains CSS specific to the administrative dashboard sections, including styles for layout, header, statistics, and management areas for gallery, finance, suggestions, users, and responsive adjustments, as well as login page styles.

This structured approach to CSS helps in managing styles efficiently and promotes consistency across the application.