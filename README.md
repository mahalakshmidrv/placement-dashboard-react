# PlaceTrack: Student Placement Dashboard

A React front-end project where students track placement drives, apply for jobs, follow applications and interviews, and view placement statistics. All data is mock JSON served through a small async API layer, so no backend is needed.

## Features

| Module | What it does |
|---|---|
| Student authentication | Login, registration with validation, profile management |
| Placement opportunities | Job list with search, category/type/mode filters, eligibility filter, sorting, job details and an apply form |
| Application tracking | Applications with status stepper (Applied, Under Review, Interview Scheduled, Selected, Rejected), status filters, withdraw |
| Interview schedule | Upcoming and completed interviews with date, time, venue and instructions |
| Dashboard analytics | Pipeline bar, stat cards, placement trend line chart, company-wise bar chart, status donut, upcoming deadlines |
| Notifications | Interview alerts, company updates, announcements; filter, mark read, dismiss; new alert created when you apply |

## Technology

React 18, Vite 5, React Router 6, Recharts (charts), lucide-react (icons), plain CSS with variables. State: Context API and hooks. Persistence: `localStorage`.

## Run the project

Requires Node.js 18 or newer.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in /dist
npm run preview    # preview the production build
```

**Demo login:** `demo@student.edu` / `Demo@123` (the "Fill demo account" button fills it for you). You can also register a new account; it starts with no applications.

## Project structure

```
src/
  components/   Reusable UI (Layout, JobCard, FormField, Modal, StatCard, charts/...)
  pages/        Login, Register, Dashboard, Jobs, Applications, Interviews, Notifications, Profile
  context/      AuthContext (session, users, profile), AppDataContext (jobs, applications, notifications)
  hooks/        useForm, useLocalStorage, useDebounce, useAsync
  services/     api.js (mock async API, swap for real fetch calls later)
  data/         jobs, interviews, notifications, stats, seed applications (JSON)
  utils/        validators, formatters, constants
  assets/
  App.jsx       Route table
  main.jsx      Entry point
```

## Routing

| Path | Page | Access |
|---|---|---|
| `/login` | Login | Public |
| `/register` | Registration | Public |
| `/dashboard` | Dashboard | Logged in |
| `/jobs` | Job Openings (search, filter, apply) | Logged in |
| `/applications` | My Applications | Logged in |
| `/interviews` | Interview Schedule | Logged in |
| `/notifications` | Notifications | Logged in |
| `/profile` | Profile | Logged in |
| `/` | Redirects to `/dashboard` | |
| `*` | Not found page | |

`ProtectedRoute` redirects unauthenticated visitors to `/login` and returns them to the page they asked for after login.

## React concepts used

- **Components:** small reusable components (`StatCard`, `JobCard`, `FormField`, `Modal`, `StatusBadge`, `ApplicationStepper`, `PipelineBar`, chart components).
- **Router:** nested routes with a shared `Layout`, `NavLink` active styling, route guard, redirect state.
- **Hooks:** `useState`, `useEffect`, `useMemo`, `useCallback`, `useRef` (search focus with the `/` key, modal focus), plus custom hooks `useForm`, `useLocalStorage`, `useDebounce`, `useAsync`.
- **Context API:** `AuthContext` (logged-in student, login/register/logout/update profile) and `AppDataContext` (jobs, interviews, stats, applications, notifications). The data provider is keyed by student email so each account has its own data.
- **Form validation:** `utils/validators.js` plus `useForm`; errors show on blur and on submit (login, registration, profile, job application).
- **Responsive UI:** sidebar becomes a slide-in menu under 860px; grids collapse for tablet and mobile.

## Component reference

| Component | Purpose |
|---|---|
| `Layout` | Sidebar, top bar, notification bell, outlet for pages |
| `ProtectedRoute` | Route guard and per-student data provider |
| `FormField` | Label, input/select/textarea/checkbox, hint and error message |
| `JobCard`, `ApplyForm`, `Modal` | Job listing card, apply form, accessible dialog |
| `StatCard`, `PipelineBar` | Dashboard summary widgets |
| `TrendsChart`, `CompanyChart`, `StatusChart` | Recharts visualisations |
| `ApplicationStepper`, `StatusBadge` | Application status display |
| `EmptyState`, `Loader`, `PageHeader`, `Logo`, `NotificationBell` | Shared UI pieces |

## Using a real API

All data access is in `src/services/api.js`. Replace the bodies of `fetchJobs`, `fetchInterviews`, `fetchStats` and `fetchNotifications` with `fetch()` calls. Authentication currently stores demo passwords in `localStorage`; a real deployment must authenticate on a server.

## Deploy (live URL)

- **Vercel:** push to GitHub, import the repo at vercel.com, keep the defaults (build `npm run build`, output `dist`). `vercel.json` handles page refreshes.
- **Netlify:** import the repo or drag the `dist` folder after `npm run build`. `public/_redirects` handles page refreshes.

## Screenshots

Run the app and add screenshots of Login, Dashboard, Job Openings, My Applications, Interviews, Notifications and Profile here for your submission.
