# Goalline Frontend

The Angular client for the Goalline football analytics API. It lets authenticated users browse competitions, seasons, teams, players, and match results; view live league standings; run head-to-head and rolling form analytics with Chart.js visualisations; and annotate matches with personal notes. An admin view covers competition management.

**Companion API:** [Goalline-Backend](https://github.com/CathalF/Goalline-Backend) (Python/Flask, MongoDB)

---

## Table of Contents

- [Why I built this](#why-i-built-this)
- [Key Features](#key-features)
- [Testing & Quality](#testing--quality)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Screens & Routes](#screens--routes)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [What I'd Do Differently](#what-id-do-differently)
- [Status](#status)

---

## Why I built this

This frontend was the companion piece to the Goalline-Backend module coursework at Ulster University. The backend provides a clean REST API; the frontend's job was to give it a usable interface without making the backend carry presentation logic. I wanted to demonstrate that I could wire up a realistic Angular app: route guards, HTTP interceptors, a service layer that the components never bypass, and Chart.js analytics views that visualise what the aggregation pipelines produce.

The admin panel and the role-based view logic (some controls only render if `isAdmin()` returns true) show RBAC working end to end, from the token payload through the guard and into the template.

---

## Key Features

- **Route guards:** `authGuard` blocks all protected routes and redirects to `/login?returnUrl=...`; `adminGuard` restricts the admin panel to users with `role: admin`
- **HTTP interceptors:** `authInterceptor` clones every outgoing request and attaches `Authorization: Bearer <token>`; `errorInterceptor` is wired into the provider chain
- **JwtHelperService** (`@auth0/angular-jwt`) checks token expiry client-side on every authentication check, clearing localStorage automatically if the token has expired
- **Reactive auth state:** `AuthService` exposes a `BehaviorSubject<user | null>`; components subscribe to `currentUser` rather than polling localStorage
- **Chart.js analytics** via `ng2-charts`: head-to-head bar charts and rolling form visualisations on `AnalyticsDashboard`
- **Angular Material + Bootstrap:** Material components for form inputs and dialogs; Bootstrap 5 grid for layout
- **Pagination:** `ngx-pagination` on all list views, wired to the API's `?page=` and `?page_size=` parameters
- **Admin panel:** competition CRUD behind `adminGuard`, separate admin module with its own routing

---

## Testing & Quality

**Honest test count:** 33 spec files exist, each containing a single Angular CLI-generated "should create" test. Total: approximately 35 tests. Every test confirms the class can be instantiated; none exercise business logic, service calls, guard behaviour, or component interactions.

> **Context discrepancy:** The associated coursework submission referenced 264 automated tests. That figure is not present in this repository. If a more comprehensive test suite exists, it is not committed here.

To run what is present:

```bash
npm test
# or
ng test
```

The test builder is configured in `angular.json`. Vitest is listed as a dev dependency (`^4.0.8`) but the project uses Angular's default test runner via `ng test`.

**What meaningful tests would look like here:**

```typescript
// auth.service.spec.ts – what it should cover
describe('AuthService', () => {
  it('stores token in localStorage on successful login');
  it('clears localStorage on logout');
  it('returns false from isAuthenticated when token is expired');
  it('returns true for isAdmin when user role is admin');
});

// auth-guard.spec.ts – actual guard behaviour
describe('authGuard', () => {
  it('allows navigation when token is valid');
  it('redirects to /login with returnUrl when unauthenticated');
});
```

---

## Architecture

```
src/app/
├── admin/                      # Admin feature module
│   ├── admin-dashboard/        # Admin landing page
│   └── admin-competitions/     # Competition CRUD (adminGuard)
│
├── components/                 # Feature components (one folder per route)
│   ├── analytics-dashboard/    # Chart.js h2h and form views
│   ├── competitions-list/      # Paginated competition browser
│   ├── competition-detail/     # Single competition + seasons
│   ├── teams-list/             # Teams with name/country filter
│   ├── team-detail/            # Squad and stats
│   ├── matches-list/           # Fixtures/results with date filter
│   ├── match-detail/           # Lineups, events, notes
│   ├── match-notes/            # Per-user annotations (auth required)
│   ├── players-list/           # Player browser
│   ├── player-detail/          # Player profile
│   ├── league-table/           # Standings table
│   ├── head-to-head/           # H2H analytics form + chart
│   ├── form-guide/             # Rolling form guide
│   ├── login/                  # Login form
│   ├── header/ footer/         # Layout shell
│   └── loading-spinner/        # Shared loading indicator
│
├── guards/
│   ├── auth-guard.ts           # Redirects unauthenticated users
│   └── admin-guard.ts          # Restricts admin routes
│
├── interceptors/
│   ├── auth-interceptor.ts     # Attaches Bearer token to all requests
│   └── error-interceptor.ts   # Wired but currently a pass-through
│
├── pages/
│   └── home/                   # Public landing page
│
├── services/
│   ├── api.service.ts          # All HTTP calls; single source of truth
│   ├── auth.service.ts         # Auth state (BehaviorSubject, JWT helpers)
│   ├── analytics.ts            # Analytics service
│   ├── competition.ts          # Competition service
│   ├── match.ts                # Match service
│   ├── note.ts                 # Note service
│   ├── player.ts               # Player service
│   └── team.ts                 # Team service
│
├── app.routes.ts               # Flat route table with canActivate guards
├── app.config.ts               # provideRouter, provideHttpClient, interceptors
└── models.ts                   # Shared TypeScript interfaces
```

### Key design decisions

**1. Single ApiService for all HTTP calls.**
Every component uses `ApiService` rather than calling `HttpClient` directly. This means mock-replacement in tests and base-URL changes both have a single point of control.

**2. `authInterceptor` as a functional interceptor.**
Angular 21 favours `HttpInterceptorFn` (a plain function) over class-based interceptors. The interceptor reads the token from `localStorage` directly rather than injecting `AuthService` to avoid a circular dependency between the HTTP provider and the service that uses HTTP.

**3. JWT expiry checked client-side on every guard evaluation.**
`AuthService.isAuthenticated()` calls `jwtHelper.isTokenExpired(token)` on every route guard check. This means expired tokens are cleared immediately on the next navigation rather than waiting for a 401 from the API.

**4. `returnUrl` in the auth guard redirect.**
The guard passes `{ queryParams: { returnUrl: state.url } }` to the login navigation, so after a successful login the user can be sent back to the page they were trying to reach.

---

## Tech Stack

| Technology | Version | Role |
|---|---|---|
| Angular | 21.0 | Framework (standalone components) |
| TypeScript | 5.9 | Language |
| Angular Material | 21.0 | UI component library |
| Bootstrap | 5.3 | Layout and utilities |
| Bootstrap Icons | 1.13 | Icon set |
| Chart.js | 4.5 | Analytics charting |
| ng2-charts | 8.0 | Angular Chart.js wrapper |
| @auth0/angular-jwt | 5.2 | JWT decode and expiry checking |
| ngx-pagination | 6.0 | Paginated list component |
| RxJS | 7.8 | Reactive programming |
| Vitest | 4.0 | Testing (listed as dependency) |

---

## Screens & Routes

| Path | Guard | Component | Description |
|---|---|---|---|
| `/home` | none | `Home` | Public landing page |
| `/login` | none | `Login` | Auth form |
| `/competitions` | authGuard | `CompetitionsList` | Paginated competition browser |
| `/competitions/:id` | authGuard | `CompetitionDetail` | Competition detail + seasons |
| `/teams` | authGuard | `TeamsListComponent` | Teams with filter |
| `/teams/:id` | authGuard | `TeamDetail` | Team detail + squad |
| `/matches` | authGuard | `MatchesList` | Fixtures and results |
| `/matches/:id` | authGuard | `MatchDetail` | Match detail + notes |
| `/players` | authGuard | `PlayersList` | Player browser |
| `/players/:id` | authGuard | `PlayerDetail` | Player profile |
| `/analytics` | authGuard | `AnalyticsDashboard` | H2H and form charts |
| `/tables` | authGuard | `TablesSeasons` | League standings |
| `/management` | authGuard | `ManagementDashboard` | Shared management view |
| `/account` | authGuard | `AccountDetails` | User profile |
| `/settings` | authGuard | `Settings` | App settings |
| `/admin` (module) | adminGuard | `AdminDashboard` | Admin panel entry |

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- The [Goalline API](https://github.com/CathalF/Goalline-Backend) running on `http://localhost:5000`

### Install and run

```bash
git clone https://github.com/CathalF/Goalline_Frontend.git
cd Goalline_Frontend
npm install
npm start
```

The development server starts at `http://localhost:4200`. The API URL is configured in `src/environments/environment.ts`.

### Production build

```bash
npm run build
```

Output goes to `dist/`. Angular's build budget is set to 500 kB warning / 1 MB error for the initial bundle.

### Point at a different API

Edit `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://your-api-host/api/v1',
  apiKey: ''
};
```

---

## Environment Configuration

There is no `.env` file. The only runtime configuration is `apiUrl` in `src/environments/environment.ts`. Change this file to point at a different backend; the Angular build inlines it at build time.

---

## What I'd Do Differently

**1. Write real tests.**
The 33 spec files are all Angular CLI scaffolding, each with a single "should create" smoke test. `AuthService`, the route guards, the HTTP interceptors, and `ApiService` all contain logic that is currently untested. These are the highest-value test targets in the project.

**2. Fix the stub files.**
`api.ts`, `auth.ts`, and several domain service stubs (`analytics.ts`, `competition.ts`, etc.) are empty classes generated by the CLI and never implemented. The actual implementations live in `api.service.ts` and `auth.service.ts`. The stub files, and their spec files, should either be filled in or deleted.

**3. The error interceptor is a no-op.**
`error-interceptor.ts` simply calls `return next(req)`. A real implementation would catch 401 responses and trigger `AuthService.clearAuth()`, and could provide consistent user-facing error messages instead of letting each component handle HTTP errors individually.

**4. Admin routing is empty.**
`admin-routing-module.ts` defines an empty routes array. Admin navigation relies on the flat `app.routes.ts` rather than proper lazy-loaded admin routing. The module exists but does nothing.

**5. Update the environment URL before deployment.**
`environment.ts` hardcodes `http://localhost:5000/api/v1`. A production environment file (`environment.prod.ts`) should override this with the deployed API URL.

---

## Status

Built February–April 2024 as coursework for the Full Stack Development module at Ulster University (companion to Goalline-Backend). Maintained as a portfolio piece.

---

<!-- TODO: add screenshots -->
