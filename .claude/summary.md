## Objective
- Build the PILATEA wellness brand site (Next.js frontend + Laravel backend + React admin dashboard) where Pilates meets tea, with a polished UI, working admin panel, and proper authentication.

## Important Details
- Font **Parisienne** used for "Sip. Stretch. Glow." (hero & footer), "Events" (homepage section title), and "Pilates on the Go" — all via `.script` class with `clamp(42px, 5vw, 74px)`
- Admin login: `admin@pilatea.com` / `password` (seeded via `DatabaseSeeder.php`)
- API base: `http://localhost:8000/api`; auth route is `auth/login` (not `/login`)
- CSRF blocked login — removed `$middleware->statefulApi()` from `bootstrap/app.php` because admin uses token‑based Sanctum auth
- Frontend runs on `localhost:3000`, admin on `localhost:5173`, backend on `localhost:8000`
- Logo: `frontend/public/Untitled.png` → copied to `admin/public/logo.png`; favicon updated on both sides
- All admin pages use `.jsx` extension (required by Vite 8's built-in oxc transformer)
- Bootstrap fully removed: CSS dropped from 250KB → 27KB; `bootstrap` package uninstalled from `package.json`; `@import "bootstrap..."` removed from `index.css`
- `lucide-react` installed and used for all sidebar and action-button icons
- All admin pages use a shared UI kit: `components/PageHeader.jsx`, `components/DataTable.jsx`, `components/EmptyState.jsx`
- Consistent input styling across all pages: Tailwind `rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#cfa5e8]/30`
- Consistent button styling: gradient background `linear-gradient(135deg, #e883d4, #cfa5e8)` for primary, `border border-slate-200` for secondary
- Table styling: `bg-white rounded-xl border border-slate-100 shadow-sm` wrapper, `bg-slate-50/75` headers, `px-6 py-4` cells
- Sidebar: `w-64 bg-slate-900` with Lucide icons, left accent border (`border-l-2 border-[#cfa5e8]`) for active state, `bg-slate-700/60` active pill

## Work State
- Completed:
  - Rewrote 7 corrupted frontend pages with correct JSX
  - Fixed inline `fontSize` overrides on homepage to match mockup
  - Fixed admin login redirect (`<Navigate>` instead of `navigate()` during render)
  - Fixed 404 on login (changed `/login` → `/auth/login` in `api.js`)
  - Fixed CSRF token mismatch (removed `statefulApi()` in `bootstrap/app.php`)
  - Rewrote all 17 admin pages with Tailwind CSS (removed Bootstrap entirely)
  - Created shared component kit: `PageHeader`, `DataTable`, `EmptyState`
  - Redesigned sidebar with `slate-900` bg, left accent active border, Lucide icons
  - Redesigned Dashboard with clean white stat cards, gradient icon circles, welcome banner
  - Added "Visit Site" button + logo in admin sidebar
  - Both builds pass clean: admin (`vite build`), frontend (`next build`)
- Active: (none)
- Blocked: (none)

## Next Move
1. (none — all tasks complete, both builds pass clean)
