# Trustolino Pre-Website Design System

<!-- impeccable:design-schema 2 -->

> Extracted from the logo source files and screenshot inspiration. This document serves as the binding visual authority for the pre-website rebuild.

## Color Palette

### Primary Colors
- **Logo Teal (Primary):** `#458893` — Used for primary buttons, important text, and accents.
- **Logo Mint (Secondary):** `#a6cfb3` — Used for light backgrounds, secondary accents, and hover states.
- **Logo Yellow (Accent):** `#fdc82b` — Used for highlights, CTA buttons, and badges.
- **Logo Dark (Text):** `#1d1d1b` — Primary text color for high readability.

### Supporting Colors
- **Cream/Off-White (Background):** `#FAF7F2` — Main page background to keep it warm and inviting.
- **White:** `#FFFFFF` — Card backgrounds, header/footer backgrounds.

## Typography

### Font Family
- **Headings:** Outfit (or similar modern geometric sans-serif) — Clean, approachable, and highly readable.
- **Body:** Inter (or similar modern neutral sans-serif) — Professional, clean, and modern.

### Type Scale
- **Hero H1:** ~48-56px, bold, dark color, strong line-height.
- **Section H2:** ~36-40px, semibold.
- **Body text:** ~16-18px, regular weight.

## Layout & Spacing

### Component Patterns

#### Navigation Bar (Header)
- **Positioning:** Non-sticky (scrolls with page), stays at the top.
- **Layout:** Floating "card" style on large screens (margins on sides and top, rounded corners), full-width on mobile.
- **Background:** White/Cream (light background).
- **Logo:** Label-only logo (`label.svg`).

#### Footer
- **Layout:** Floating "card" style on large screens (margins on sides and bottom, rounded corners), full-width on mobile.
- **Background:** White/Cream (matching the header).
- **Logo:** Full logo with original colors (`logo.svg`).
- **Links:** Must include navigation links and the Advisor Portal (Ratgeber).

#### Forms (Waitlist)
- **Validation:** Custom client-side validation (no native browser popups) with accessible error messaging.
- **Consent:** Mandatory interactive checkbox for data privacy consent (`id="privacy"`, `aria-required="true"`) linking directly to the privacy policy.
- **Submission State:** Smooth transition to an inline "Fast geschafft!" confirmation banner highlighting the 30-minute confirmation email.
- **Confirmation Page:** Dedicated status page (`/bestaetigung`, `/en/confirm`) wrapped in `<Suspense>` displaying live token verification, loading spinner, success state, or clear fallback actions.

#### Hero Mascot Illustration (Dino)
- **Sizing:** Prominent presence on both mobile and desktop (`max-w-[33rem]`, `w-full`, `aspect-[12/10]`), embedded within a balanced `md:grid-cols-[1.2fr_1fr]` grid.
- **Safe ViewBox:** Precise viewBox (`88 7 104 82`) with calibrated stroke padding (`strokeWidth="1.6"` etc.) to ensure back crests, tail, and feet are completely visible without edge clipping on any screen size.

#### Team & Profile Cards
- **Card Ratio:** Standardized 3:4 portrait aspect ratio (`aspect-[3/4]`, `rounded-2xl`, `border border-border/40`).
- **Portrait Photography:** High-resolution portrait images rendered with `object-cover object-top` and subtle hover zoom (`group-hover:scale-105 transition-transform duration-300`).
- **Fallback Avatar:** Clean initials circle (`bg-mint/40 text-foreground font-bold text-xl`) for team profiles without an uploaded photo.
- **Clean Aesthetic:** No extraneous account badge icons or floating clutter over portrait images.

#### Comparative Cards ("Wer wir sind")
- **Layout:** Modern comparative card grid replacing legacy HTML tables for optimal mobile responsiveness.
- **Icon Badges:** Standardized `size-12 rounded-xl bg-teal-50` icon containers with `size-6 text-foreground/70` duotone Phosphor icons, visually identical to the Expertise section.

## Title & Branding Conventions
- **Standard Pages:** Uniform format `Trustolino: <Title>` for all subpages in both German and English (e.g. `Trustolino: Pädagogische Kinderbetreuung in Mannheim & Heidelberg`, `Trustolino: Impressum`, `Trustolino: Legal`, `Trustolino: E-Mail bestätigen`).
- **Advisor Articles:** Editorial and SEO-targeted single articles retain standalone, keyword-focused titles without the brand prefix.

## Interaction & Motion
- Smooth scroll between sections.
- Subtle hover states on cards and buttons.
- CTA button hover: slight color shift.
- Custom inline error and confirmation messages fade in smoothly.
