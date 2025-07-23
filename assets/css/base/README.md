# `assets/css/base/` Directory

This directory contains foundational CSS styles that serve as the base for the entire OSIS SMKN 7 Samarinda website.

## Purpose and Function

The `base/` directory is designed to house global styles, resets, and fundamental typographic rules that apply across all sections of the website, ensuring consistency and a solid starting point for the design. It also includes styles for the dark mode theme.

## Contents

-   `_base.css`: Contains global CSS resets (e.g., `box-sizing`, margin/padding resets), default typography settings (font family, sizes, line heights), and general container styles. It establishes the basic visual foundation for the project.
-   `_dark-mode.css`: Defines CSS variables and styles specifically for the dark mode theme, overriding default light mode styles when the `dark-mode` class is applied to the `html` element.

These base styles are imported into the main CSS entry points (`main.css` and `admin-main.css`) to ensure they are applied universally.