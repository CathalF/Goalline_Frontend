import { Routes } from "@angular/router";
import { Home } from "./pages/home/home";
import { CompetitionsList } from "./components/competitions-list/competitions-list";
import { CompetitionDetail } from "./components/competition-detail/competition-detail";
import { TeamsListComponent } from "./components/teams-list/teams-list";
import { TeamDetail } from "./components/team-detail/team-detail";
import { MatchesList } from "./components/matches-list/matches-list";
import { MatchDetail } from "./components/match-detail/match-detail";
import { PlayersList } from "./components/players-list/players-list";
import { PlayerDetail } from "./components/player-detail/player-detail";
import { AnalyticsDashboard } from "./components/analytics-dashboard/analytics-dashboard";
import { ManagementDashboard } from "./components/management/management";
import { TablesSeasons } from "./components/tables-seasons/tables-seasons";
import { Login } from "./components/login/login";
import { AccountDetails } from "./components/account-details/account-details";
import { Settings } from "./components/settings/settings";
import { authGuard } from "./guards/auth-guard";


export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'login', component: Login },

  // Protected routes - require authentication
  { path: 'account', component: AccountDetails, canActivate: [authGuard] },
  { path: 'settings', component: Settings, canActivate: [authGuard] },
  { path: 'competitions', component: CompetitionsList, canActivate: [authGuard] },
  { path: 'competitions/:id', component: CompetitionDetail, canActivate: [authGuard] },
  { path: 'teams', component: TeamsListComponent, canActivate: [authGuard] },
  { path: 'teams/:id', component: TeamDetail, canActivate: [authGuard] },
  { path: 'matches', component: MatchesList, canActivate: [authGuard] },
  { path: 'matches/:id', component: MatchDetail, canActivate: [authGuard] },
  { path: 'players', component: PlayersList, canActivate: [authGuard] },
  { path: 'players/:id', component: PlayerDetail, canActivate: [authGuard] },
  { path: 'analytics', component: AnalyticsDashboard, canActivate: [authGuard] },
  { path: 'management', component: ManagementDashboard, canActivate: [authGuard] },
  { path: 'tables', component: TablesSeasons, canActivate: [authGuard] },

  { path: '**', redirectTo: '/home' }
];