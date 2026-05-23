# GoalLine Frontend

Angular 17 web client for the GoalLine football data API. Browse competitions, seasons, teams, players, and live match data; log personal match notes; and view a full admin panel for competition management.

## Features

- **Dashboard** — upcoming matches, league table, season overview
- **Competitions & Seasons** — browse and filter all competitions and season data
- **Teams & Players** — squad lists, individual player profiles
- **Matches** — fixtures, results, detailed match view
- **Analytics** — aggregated statistics and charts
- **Match Notes** — personal per-match notes (authenticated users)
- **Admin panel** — competition management (admin role)
- **JWT authentication** — login/logout with token-based session

## Stack

- **Angular 17** — standalone components, signals-ready
- **Angular Router** — lazy-loaded feature modules
- **RxJS** — reactive HTTP client
- **Angular CLI** — build tooling

## Getting Started

**Prerequisites:** Node 18+, the [GoalLine API](https://github.com/CathalF/Goalline-Backend) running locally.

```bash
npm install
npm start
```

The dev server starts at `http://localhost:4200`. The API is expected at `http://localhost:5000` by default; edit `src/environments/environment.ts` to point at a different host.

```bash
# Production build
npm run build
```

## Project Structure

```
src/
├── app/
│   ├── admin/              # Admin feature module (competitions management)
│   ├── components/         # Shared feature components
│   │   ├── analytics-dashboard/
│   │   ├── competitions-list/ & competition-detail/
│   │   ├── form-guide/ & head-to-head/
│   │   ├── header/ & footer/
│   │   ├── league-table/
│   │   ├── match-notes/ & matches/
│   │   ├── players/
│   │   └── seasons/
│   ├── services/           # HTTP service layer
│   ├── app.routes.ts
│   └── app.config.ts
└── environments/           # API base URL configuration
```

## License

MIT
