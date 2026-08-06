# PILATEA — Sip. Stretch. Glow.

A full-stack wellness brand platform where Pilates meets tea. Built with **Next.js 16**, **Laravel 11**, and **React + Vite** — featuring a customer-facing storefront, RESTful API backend, and a complete admin dashboard.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide Icons |
| **Backend** | Laravel 11 · PHP 8.2 · Sanctum (token auth) · SQLite/MySQL |
| **Admin Dashboard** | React 19 · Vite 8 · Tailwind CSS v4 · React Router · Axios |
| **Fonts** | Darker Grotesque (headings) · Poppins (body) · Allura (script) |

---

## Project Structure

```
Pilatea/
├── pilatea/                 # Customer-facing storefront (Next.js)
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # Auth & Settings context providers
│   │   └── lib/             # API client, types, utilities
│   └── public/              # Static assets (logos, images)
│
├── backend/                 # REST API (Laravel)
│   ├── app/
│   │   ├── Http/Controllers/Api/   # 18 API controllers
│   │   ├── Models/                 # 19 Eloquent models
│   │   └── Mail/                   # Email templates
│   ├── database/migrations/        # 25 migrations
│   └── routes/api.php              # Route definitions
│
└── admin/                   # Admin dashboard (React + Vite)
    ├── src/
    │   ├── pages/           # 26 admin pages
    │   ├── components/      # Shared UI kit (DataTable, PageHeader, etc.)
    │   └── utils/           # API utilities
    └── public/              # Static assets
```

---

## Features

### Customer Storefront
- **Event Booking** — Browse and book Pilates events with real-time availability
- **Tea Menu** — Explore curated tea items by category
- **Membership Plans** — View and purchase membership tiers
- **Gallery** — Image gallery with captions
- **Testimonials** — Customer reviews and ratings
- **Contact Form** — Submit inquiries directly
- **User Auth** — Register, login, and manage bookings
- **Invoice Downloads** — PDF invoices for bookings
- **Discount Codes** — Apply promo codes at checkout
- **BYO Events** — Bring-your-own drink option for select events
- **Responsive Design** — Fully responsive across all devices
- **Animated UI** — Aurora background, scroll reveals, glass morphism

### Admin Dashboard
- **Dashboard** — Overview stats, recent bookings, quick actions
- **Events Management** — Create, edit, delete events with images
- **Booking Management** — View, update, and manage all bookings
- **Tea Items & Categories** — Full CRUD for tea menu
- **Membership Plans** — Manage membership tiers and pricing
- **Gallery Management** — Upload and organize gallery images
- **Instructor Profiles** — Manage instructor bios and specialties
- **Banner Management** — Create and rotate promotional banners
- **Testimonial Moderation** — Approve and manage reviews
- **Contact Inquiry Management** — Track and respond to inquiries
- **Discount Code Generator** — Create and manage promo codes
- **Expense Tracking** — Log and categorize business expenses
- **Finance Summary** — Revenue reports and financial overview
- **Email Templates** — Customizable transactional emails
- **Marketing Campaigns** — Email campaign management
- **User Management** — Admin/employee/customer role management
- **Site Settings** — Global site configuration

### Backend API
- **18 RESTful Controllers** covering all business entities
- **Token-based Authentication** via Laravel Sanctum
- **Role-based Access Control** — admin, employee, customer roles
- **19 Eloquent Models** with relationships
- **25 Database Migrations** for schema management
- **PDF Invoice Generation** via DomPDF
- **Email System** — Transactional and marketing emails

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- PHP ≥ 8.2
- Composer
- npm

### Installation

**1. Clone the repository**
```bash
git clone <repo-url>
cd Pilatea
```

**2. Backend Setup**
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve    # Runs on http://localhost:8000
```

**3. Frontend Setup**
```bash
cd pilatea
npm install
npm run dev          # Runs on http://localhost:3000
```

**4. Admin Dashboard Setup**
```bash
cd admin
npm install
npm run dev          # Runs on http://localhost:5173
```

### Default Admin Credentials
- **Email:** `admin@pilatea.com`
- **Password:** `password`

---

## Environment Variables

### Backend (`backend/.env`)
```env
DB_CONNECTION=sqlite
APP_URL=http://localhost:8000
```

### Frontend (`pilatea/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_ASSET_URL=http://localhost:8000
```

### Production (`pilatea/.env.production`)
```env
NEXT_PUBLIC_API_URL=http://159.203.35.226/pilatea-api/api
NEXT_PUBLIC_ASSET_URL=http://159.203.35.226/pilatea-api
```

---

## API Endpoints

### Public Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | List all events |
| GET | `/api/events/{id}` | Get event details |
| GET | `/api/tea-items` | List tea items |
| GET | `/api/tea-categories` | List tea categories |
| GET | `/api/memberships` | List membership plans |
| GET | `/api/testimonials` | List testimonials |
| GET | `/api/gallery` | List gallery images |
| GET | `/api/instructors` | List instructors |
| GET | `/api/banners` | List banners |
| GET | `/api/settings` | Get site settings |
| POST | `/api/bookings` | Create a booking |
| POST | `/api/contact` | Submit contact form |
| POST | `/api/discount-codes/validate` | Validate a promo code |

### Auth Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/user` | Get current user |

### Admin Routes (requires `auth:sanctum` + `role:admin,employee`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/admin/events` | List / Create events |
| PUT/DELETE | `/api/admin/events/{id}` | Update / Delete event |
| GET | `/api/admin/bookings` | List all bookings |
| PUT | `/api/admin/bookings/{id}` | Update booking |
| GET/POST | `/api/admin/tea-items` | List / Create tea items |
| GET/POST | `/api/admin/memberships` | List / Create memberships |
| GET/POST | `/api/admin/gallery` | List / Upload gallery |
| GET/POST | `/api/admin/instructors` | List / Create instructors |
| GET/POST | `/api/admin/banners` | List / Create banners |
| GET/POST | `/api/admin/discount-codes` | List / Create discount codes |
| POST | `/api/admin/settings` | Update site settings |
| GET | `/api/admin/users` | List users |
| GET | `/api/admin/expenses` | List expenses |
| GET | `/api/admin/finance/summary` | Financial summary |
| GET | `/api/admin/bookings/{id}/invoice` | Download invoice |

---

## Database Schema

### Core Models (19 total)
| Model | Description |
|-------|-------------|
| `User` | System users (admin/employee/customer) |
| `Event` | Pilates events with scheduling |
| `Booking` | Customer event reservations |
| `BookingTeaOrder` | Tea orders linked to bookings |
| `TeaCategory` | Tea menu categories |
| `TeaItem` | Individual tea products |
| `Membership` | Membership plans |
| `UserMembership` | User membership subscriptions |
| `GalleryImage` | Gallery photos with captions |
| `Testimonial` | Customer reviews |
| `Contact` | Contact form submissions |
| `Instructor` | Instructor profiles |
| `Banner` | Promotional banners |
| `DiscountCode` | Promo codes |
| `Setting` | Global site settings |
| `EmailTemplate` | Email template definitions |
| `EmailCampaign` | Marketing campaigns |
| `Expense` | Business expenses |

---

## Scripts

```bash
# Frontend
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint

# Admin
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # OxLint

# Backend
php artisan serve    # Start dev server
php artisan migrate  # Run migrations
php artisan db:seed  # Seed database
```

---

## Design System

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#5B1D2E` | Brand burgundy — buttons, accents |
| Secondary | `#5B1D2E` | Same as primary |
| Accent | `#7A283E` | Hover states, highlights |
| Dark | `#3A101C` | Headings, text |
| Background | `#F1EADD` | Page background (warm cream) |

### Typography
- **Headings:** Darker Grotesque (weight 300)
- **Body:** Poppins (weights 300–700)
- **Script/Accent:** Allura (weight 400) — used for tagline and decorative text

### Design Tokens
- Border radius: `12px` / `20px` / `28px` / `999px`
- Shadows: Custom burgundy-tinted shadows for cards, buttons, navigation

---

## Deployment

### Production Environment
- **Frontend:** Vercel / any Node.js host
- **Backend:** Any PHP 8.2+ host (VPS, Laravel Forge, etc.)
- **Admin:** Vite static build — deploy `dist/` to any static host

### Build Commands
```bash
# Frontend (production)
cd pilatea && npm run build

# Admin (production)
cd admin && npm run build
```

---

## License

MIT

---

Built with care for the PILATEA wellness brand.
