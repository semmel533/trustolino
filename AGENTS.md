<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns.

<!-- convex-ai-end -->

# Trustolino Engineering Guidelines

## 1. Server-First & Security Architecture
- **Convex BaaS**: All data mutations, scheduled tasks, and queries run in Convex.
- **Function Hygiene**: Always use object-form syntax with `args` and `returns` validators for every registered function.
- **Index-First Data Access**: Never run full table `.filter()` scans where an index can be used. Query with `.withIndex(...)`.
- **Security & Authorization**: All sensitive logic (tokens, emails, rate limiting) remains strictly server-side. Never leak secrets, API keys, or private tokens to client components.
- **Defense in Depth**: Protect user-facing mutation endpoints with sliding window rate limiting and RFC-compliant input sanitization.

## 2. Strict Internationalization (i18n)
- **Key-Only Translations**: Never hardcode user-facing strings or use inline ternary operators (`locale === 'de' ? ... : ...`) in UI components.
- **Dictionary Parity**: Both `pre-website/lib/i18n/dictionaries/de.json` and `en.json` must remain in 100% key and structure parity.
- **Markdown Separation**: Long-form editorial content (legal notices, advisor articles) resides in Markdown files under `public/content/`.

## 3. Code Cleanliness & Anti-Slop
- **Zero AI Slop**: Write clean, concise, production-ready TypeScript.
- **No Extraneous Logs**: Remove debugging `console.log` statements before committing.
- **No Decorative Emojis**: Do not add arbitrary emojis to code comments, error messages, or backend logs.
- **Type Safety**: Strictly avoid `any`. Ensure `npm run build` and `tsc --noEmit` succeed with zero errors.

## 4. UI & Design System (Impeccable Standards)
- **Token Compliance**: Follow `DESIGN.md` color tokens (Teal `#458893`, Mint `#a6cfb3`, Accent `#fdc82b`, Dark `#1d1d1b`, Background `#FAF7F2`).
- **Mobile-First Layouts**: Design interfaces that gracefully adapt across all screen sizes. Avoid forced horizontal scrollbars or cramped desktop tables on mobile viewports.
- **Client Boundaries**: Keep components as Server Components by default; only use `"use client"` for interactive forms, motion, or local state.
- **Suspense Boundaries**: Wrap client components consuming `useSearchParams()` in `<Suspense>` to preserve static site generation.
