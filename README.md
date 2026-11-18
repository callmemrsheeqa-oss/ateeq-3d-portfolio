# Ateeq Ur Rehman — 3D Mathematical Personal Portfolio

A full-stack, interactive 3D personal portfolio built for **Ateeq Ur Rehman** (BS Mathematics, CASPAM, Bahauddin Zakariya University, Multan) combining React, React Three Fiber, Three.js, Motion, GSAP, Tailwind CSS, Express.js, PostgreSQL (Drizzle ORM), Firebase Authentication, and Gemini AI (**Muavin AI**).

## Architecture

- **Frontend (`src/`)**: React 19, Vite, React Router v7, Tailwind CSS v4, `@react-three/fiber`, `@react-three/drei`, Three.js, Motion, GSAP (`ScrollTrigger`), and Firebase Auth client (`src/lib/firebase.ts`).
- **Database (`src/db/`)**: PostgreSQL on Cloud SQL managed with Drizzle ORM (`src/db/schema.ts`, `src/db/index.ts`, `src/db/drizzle.config.ts`). Verified baseline data is automatically seeded once on first load via `server/services/seedService.ts` without inventing awards, certificates, gallery photos, or fake CV PDFs.
- **Backend (`server.ts`, `server/`)**: Express.js API server serving `/api/portfolio`, `/api/cv/*`, `/api/contact`, `/api/ai/chat` (`@google/genai`), `/api/media/*`, and authenticated `/api/admin/*` routes with `cookie-parser`, HTTP-only sessions, rate limiting, and Multer uploads (`UPLOAD_DIR`).

## Admin Dashboard & First-Time Setup (`/admin`)

The private administration portal at `/admin` supports two secure sign-in methods:

1. **Authorized Google Account** (via Firebase Auth): Set `ADMIN_EMAIL` (defaults to `sunbulbroter@gmail.com`) in environment secrets.
2. **Email & Password Login**: Create or rotate your admin password securely via the one-time CLI script:

```bash
ADMIN_INITIAL_EMAIL=your@email.com ADMIN_INITIAL_PASSWORD='YourStrongPassword' npm run admin:setup
```

From `/admin`, you can manage Profile, Site Settings, Projects, Skills, Education, Experience, Teaching, CV PDF uploads, Profile Photo & Gallery uploads, Awards & Certificates, Social Links, Contact Inbox messages, and Muavin AI Knowledge.

## Assets, CV & Gallery

- Default Portrait image: `public/images/profile.jpg` (replaceable via Admin Dashboard -> Gallery & Photo)
- Favicon: `public/favicon.png`
- Uploaded CV PDFs, Gallery photos, and Award/Certificate files are stored safely under `UPLOAD_DIR` (defaults to `./uploads/`) with `%PDF-` header verification on PDF uploads. When no CV PDF has been uploaded yet, visitors receive an honest printable Academic CV summary instead of a fake PDF.

## Environment Variables

See `.env.example` for all supported variables, including:
- `SQL_HOST`, `SQL_USER`, `SQL_PASSWORD`, `SQL_DB_NAME` (Cloud SQL PostgreSQL connection)
- `GEMINI_API_KEY`, `GEMINI_MODEL` (for Muavin AI)
- `ADMIN_EMAIL`, `SESSION_SECRET`
- `UPLOAD_DIR`
- Optional `SMTP_*` and `CONTACT_TO_EMAIL` (note: all contact messages are always persisted to PostgreSQL `contact_messages` even if SMTP is unconfigured)

## Local Development & Production

```bash
npm install
npm run dev         # Starts Express + Vite dev server on port 3000
npm run lint        # Runs TypeScript type-checking (tsc --noEmit)
npm run build       # Builds production frontend into dist/
npm run start       # Runs production Node.js server (node server.ts)
npm run admin:setup # Creates/updates an admin user with scrypt password hash
```
