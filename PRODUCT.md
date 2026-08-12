# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: Pädagog:innen (Educators)** — People with pedagogical backgrounds (educators, teachers, special education professionals, pedagogy students, social work students) seeking a professional platform to offer childcare services as self-employed providers. They want fair compensation, professional recognition, career documentation, and minimal administrative burden.

**Secondary: Eltern (Parents/Families)** — Families searching for verified, pedagogically qualified childcare professionals for their children, with specific needs (languages, special needs, ADHD, autism, allergies).

**Pre-Release Phase Focus:** Exclusively targeting Pädagog:innen to build a waitlist community before platform launch.

## Product Purpose

Trustolino is a digital matchmaking and infrastructure platform connecting pedagogically qualified self-employed professionals with families. It positions professional childcare not as casual "babysitting" but as qualified pedagogical work. The platform handles the entire workflow: search, matching, communication, scheduling, payment processing (via Stripe), invoicing, and tax documentation (EÜR). Success means educators can focus on their pedagogical work while being fairly compensated, and families can trust that their children are cared for by verified professionals.

## Positioning

Unlike traditional babysitting/caregiving platforms, Trustolino requires verified pedagogical qualifications (manual review, not algorithmic). The Trusted-Educator-Siegel (seal) signals verified quality. Career portfolios document practical experience. Administrative automation (invoicing, EÜR) removes bureaucratic burden. Founded by pedagogues and parents who experienced the industry's challenges firsthand.

## Operating Context

- Pre-Release: Waitlist landing page at trustolino.de collecting educator emails via Appwrite
- Three separate Next.js apps: pre-website (port 2999), website (port 3000), webapp (port 3001)
- trustolino.de = public, SEO/GEO indexed; app.trustolino.de = product, noindex
- Bilingual: German (default, no prefix) and English (/en/ prefix)
- Appwrite for BaaS (hosting, auth, database, storage, realtime)
- Stripe for marketplace payments

## Capabilities and Constraints

- i18n key-only architecture (no hardcoded text, no ternary language checks)
- Markdown content for legal pages and advisor articles (separate from i18n)
- Tailwind CSS + shadcn/ui + Phosphor Icons
- React Markdown + Tailwind Typography for content rendering
- Zustand for client state management
- SEO: sitemap, structured data, Open Graph, hreflang, canonical URLs
- Advisor portal as public SEO/GEO content strategy
- 12% booking fee model (9% parents, 3% educators)
- DSGVO-compliant data handling

## Brand Commitments

- **Name:** Trustolino
- **Tagline:** "Vertrauensvolle Betreuung, kinderleicht organisiert."
- **Logo Assets:** SVG and PNG variants — logo (icon+label), icon (standalone), label (text only)
- **Mascot:** Dinosaur character (green/teal) — visible in branding, hero sections
- **Founders:** Felix (Sozialfachwirt/Einrichtungsleitung), Jonas (25+ years pedagogy), Philipp (father, UK background), Jan (university lecturer, founder coach, father), Selim (CS student, TH Mannheim)
- **Voice:** Professional but warm, peer-to-peer among educators, empowering, never corporate
- **Position:** "Von Pädagog:innen für Pädagog:innen" — built by people who know the industry
- **Design reference:** Existing pre-website design system (screenshot provided as binding visual authority)

## Evidence on Hand

- Design system screenshot from previous pre-website (binding visual reference)
- 14 advisor article PDFs (German, mix of educator and parent focused)
- Complete landing page content document (pre-website-content.md)
- Logo files in SVG and PNG (icon, label, logo variants)
- Appwrite project configured with credentials
- Founder statements and bios

## Product Principles

1. **Pedagogical quality over quantity** — Every educator is manually verified; no algorithmic-only onboarding
2. **Professional recognition** — Educators are positioned as professionals, not casual babysitters
3. **Administrative liberation** — The platform handles bureaucracy so educators focus on children
4. **Trust through transparency** — Founded by pedagogues and parents; personal, not anonymous
5. **Self-determination** — Educators set their own prices, schedules, and choose their assignments

## Accessibility & Inclusion

- Bilingual DE/EN from day one
- WCAG 2.1 AA compliance target
- Semantic HTML structure
- Keyboard navigable
- Screen reader compatible
- Supports children with special needs (ADHD, autism, allergies) through profile matching
