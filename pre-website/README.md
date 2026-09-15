# Trustolino Pre-Website (Cloudflare Workers & Next.js 16)

> **Vertrauensvolle Betreuung, kinderleicht organisiert.**  
> Pre-Release Landingpage und Ratgeber-Portal für die Trustolino-Plattform.

---

## 1. Übersicht & Architektur

Die `pre-website` ist für maximale Performance, Sicherheit und weltweite Edge-Auslieferung konzipiert. Sie kombiniert Next.js 16 (App Router) mit dem offiziellen Cloudflare **Vinext**-Toolchain (Vite 8 & `@vitejs/plugin-rsc`) und einem serverlosen **Convex** BaaS Backend.

### Technische Säulen

- **Framework**: Next.js 16.3.0 (App Router, React 19.2.8)
- **Edge Deployment**: Cloudflare Workers via **Vinext** (`vinext`, Vite 8, `wrangler.jsonc`) mit `nodejs_compat`
- **Backend as a Service (BaaS)**: [Convex](https://convex.dev) (`eu-west-1`, Frankfurt)
- **E-Mail Dispatching**: Vollständig ausgelagert in das Convex-Backend (`convex/email.ts` via Microsoft 365 Business SMTP, TLS/STARTTLS auf Port 587)
- **Content Engine**: 28 Ratgeber-Artikel (DE & EN) und rechtliche Dokumente (Impressum, Datenschutz, Legal, Privacy) als typisierte In-Memory-Module (`lib/content-data.ts`, kompiliert via `scripts/generate-content.mjs`), 100% Dateisystem-unabhängig (`zero-fs`) im Cloudflare Worker Runtime.
- **Internationalisierung (i18n)**: Strikte Key-Only-Architektur (`lib/i18n/dictionaries/de.json` & `en.json`) mit 100% Schlüssel-Parität.
- **Sicherheit**: OWASP-konforme Security Header (HSTS, CSP, X-Frame-Options: DENY, Referrer-Policy), IP-basiertes Sliding-Window Rate Limiting, RFC-konforme E-Mail-Validierung und kryptografische SHA-256 Tokens.

---

## 2. Entwicklung & Skripte

| Befehl | Zweck |
| :--- | :--- |
| `npm run dev` | Startet den regulären Next.js Turbopack Dev-Server auf Port `3000` |
| `npm run build` | Führt den regulären Next.js Production-Build durch (generiert alle 47 statischen Routen) |
| `npm run dev:vinext` | Startet den Vite/Vinext Entwicklungs-Server auf Port `3001` |
| `npm run build:vinext` | Baut das Cloudflare Worker Bundle inkl. Pre-Rendering und Asset-Generierung |
| `npm run start:vinext` | Startet die lokale Cloudflare Worker Preview via `wrangler dev` (Standard: Port `8787`) |
| `npm run deploy:vinext` | Deployt die Anwendung direkt auf Cloudflare Workers (`vinext-cloudflare deploy`) |
| `npm run generate:content` | Kompiliert alle Markdown-Dateien aus `public/content/` in `lib/content-data.ts` |
| `npx tsc --noEmit` | Führt die strikte TypeScript-Typprüfung mit 0 Fehlern durch |

---

## 3. Cloudflare Workers Deployment

Cloudflare empfiehlt heute **Vinext** als bevorzugten Standard zur Ausführung von Next.js App Router Anwendungen auf Cloudflare Workers.

### Konfigurationsdateien

1. **`wrangler.jsonc`**:
   - `name`: `pre-website`
   - `compatibility_date`: `2026-09-15`
   - `compatibility_flags`: `["nodejs_compat"]`
   - `main`: `vinext/server/fetch-handler`
   - `assets`: `{ "directory": "dist/client", "binding": "ASSETS" }`

2. **`vite.config.ts`**:
   - `vinext({ prerender: true })`
   - `@cloudflare/vite-plugin` mit `viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] }`

### Deployment-Workflow

1. **Umgebungsvariablen auf Cloudflare Workers setzen**:
   ```bash
   # Public Convex Deployment URL
   npx wrangler secret put NEXT_PUBLIC_CONVEX_URL
   # Internes Secret für Route-Handler <-> Convex Kommunikation
   npx wrangler secret put CONVEX_INTERNAL_SECRET
   ```

2. **Build & Deploy ausführen**:
   ```bash
   npm run build:vinext
   npm run deploy:vinext
   ```

*Hinweis*: Die E-Mail- und SMTP-Geheimnisse (`SMTP_PASS` etc.) müssen **nicht** auf Cloudflare Workers hinterlegt werden, da der gesamte E-Mail-Versand sicher im Convex-Backend abgewickelt wird.

---

## 4. Umgebungsvariablen (`.env.local`)

Die Datei `.env.example` dient als Vorlage für neue Deployments:

```bash
# Convex Deployment
CONVEX_DEPLOYMENT="dev:your-deployment-name"
NEXT_PUBLIC_CONVEX_URL="https://your-deployment-name.convex.cloud"
CONVEX_INTERNAL_SECRET="your-secure-internal-secret"

# Öffentliche URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# SMTP E-Mail-Konfiguration (nur für das Convex-Backend)
SMTP_HOST="smtp.office365.com"
SMTP_PORT="587"
SMTP_USER="selim.eser@trustolino.de"
SMTP_PASS="your_smtp_password"
EMAIL_FROM="selim.eser@trustolino.de"
EMAIL_REPLY_TO="noreply@trustolino.de"
```

---

## 5. Sicherheit & Code-Standards

- **Keine Hardcoded Fallbacks**: Fehlen erforderliche Umgebungsvariablen, bricht der Build bzw. Request mit einer klaren Fehlermeldung ab, anstatt unsichere Fallbacks zu nutzen.
- **Keine Leaks in Git**: Passwörter, Deploy-Keys und Secrets sind strengstens von Git ausgeschlossen.
- **Strikte Trennung**: Öffentliche Web-Assets vs. private Backend-Logik bleiben strikt isoliert.
