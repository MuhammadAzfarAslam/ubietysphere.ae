# CLAUDE.md — UbietySphere.ae

## Project Overview

Healthcare SaaS platform connecting patients/parents with medical professionals. Frontend-only Next.js app consuming a REST API at `https://cms.ubietysphere.ae/api/`.

## Tech Stack

- **Framework:** Next.js 15.3.8 (App Router, Turbopack)
- **React:** 19.0.0
- **Auth:** NextAuth.js 4.24.11 (JWT strategy, Credentials provider)
- **Styling:** Tailwind CSS 4
- **Forms:** React Hook Form 7.60 + Yup 1.6.1 + @hookform/resolvers
- **Package Manager:** pnpm
- **Build Output:** Standalone (for Docker deployment)

## Directory Structure

```
app/                    # Next.js App Router pages and API routes
  api/auth/             # NextAuth endpoint
  dashboard/            # Protected pages (education, license, slots, doctors, documents)
  login/, register/     # Auth pages
  our-services/[slug]/  # Dynamic service pages
  our-experts/[slug]/   # Dynamic expert pages
components/             # Reusable UI components organized by feature
  auth/, banner/, breadcrumb/, button/, cards/, faq/,
  footer/, form/, header/, list/, modal/, nextImage/,
  toaster/, upload/
wrappers/               # Stateful container components (Education, License, Slots, Documents, DoctorsList, DoctorApplications)
hooks/                  # Custom hooks (useTokenValidation)
utils/                  # Helpers (getData, postData, putData, enums, serviceContent, general)
public/                 # Static assets (images, fonts)
```

## User Roles

- **Doctor** — manages qualifications, licenses, appointment slots, views shared documents
- **Patient** — books appointments, uploads/manages documents
- **Parent** — similar to patient, manages children's health records
- **Admin** — reviews doctor applications, manages empaneled HCPs

## Authentication Flow

1. Login form submits to NextAuth `signIn('credentials', {email, password})`
2. NextAuth calls backend `/login` API, receives `accessToken` (JWT)
3. Token decoded to extract `exp` claim, stored in session
4. Dashboard layout uses `getServerSession(authOptions)` for server-side protection
5. `useTokenValidation` hook checks token expiry client-side with 5-minute buffer
6. 401 responses from API trigger automatic logout
7. `SessionCleaner` component clears stale sessions on login page

## API Integration Patterns

All API calls go through utility functions in `utils/getData.js`:

- `getData(url, options)` — GET with auth headers
- `postData(url, body, headers, method)` — POST/DELETE, supports FormData
- `putData(url, body, headers)` — PUT for updates
- All handle 401 (auto-logout) and 404 (Next.js notFound())
- Auth token passed via `Authorization: Bearer {token}` header

## Form Pattern

```jsx
const schema = yup.object({ field: yup.string().required() });
const { register, handleSubmit, setValue } = useForm({ resolver: yupResolver(schema) });
// Custom components (DatePicker, PhoneInput, NationalitySelect) integrate via setValue
```

## Wrapper Pattern

Wrappers in `wrappers/` are client-side container components that:
- Manage local state with `useState` (list data, edit mode, modals)
- Fetch data on mount, render forms and lists
- Handle add/edit/delete operations with API calls
- Show toast notifications on success/error

## Toast Notifications

Global context-based system in `components/toaster/`:
- `ToastContext.jsx` provides `useToast()` hook
- Types: info, success, error, warning
- Auto-dismiss after 3 seconds

## Styling Conventions

- Tailwind CSS utility classes directly in JSX
- Custom colors: `primary`, `secondary`, `primary-light` (defined in Tailwind config)
- Mobile-first responsive design with `sm:`, `md:`, `lg:` breakpoints
- Global styles in `app/globals.css`

## Key Business Constants

- **`utils/enums.js`** — `DOCTOR_CATEGORIES` (9 service types), `DISCIPLINE_CATEGORIES` (20 specialties)
- **`utils/serviceContent.js`** — `SERVICE_CONTENT` dict with durations, descriptions, banners per service
- **`utils/general.js`** — `slugToTitle()` helper

## Path Aliases

`@/*` maps to project root (configured in `jsconfig.json`)

## Commands

- `pnpm dev` — Start dev server (Turbopack)
- `pnpm build` — Production build
- `pnpm start` — Start production server
- `pnpm lint` — Run ESLint

## Environment Variables

- `NEXT_PUBLIC_URL` — Frontend URL
- `NEXT_PUBLIC_API_URL` — Backend API base URL
- `NEXT_PUBLIC_PLACE_HOLDER_IMG` — Placeholder image URL
- `NEXTAUTH_URL` — NextAuth callback URL (must match domain)
- `NEXTAUTH_SECRET` — Secret for JWT signing

## Important Notes

- No direct database access — everything goes through the CMS API
- Images: all remote HTTPS sources allowed in `next.config.mjs`
- Slots system supports week/month views, conflict detection, 30-min intervals, service-based coloring
- Role-based sidebar menus are filtered server-side in the dashboard layout
