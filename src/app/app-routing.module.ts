import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Home } from "./pages/home/home";
import { CompetitionsList } from "./components/competitions-list/competitions-list";
import { TeamsListComponent } from "./components/teams-list/teams-list";
import { MatchesList } from "./components/matches-list/matches-list";
import { AnalyticsDashboard } from "./components/analytics-dashboard/analytics-dashboard";
import { Login } from "./components/login/login";
import { PlayersList } from "./components/players-list/players-list";
import { PlayerDetail } from "./components/player-detail/player-detail";


const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "home", component: Home },
  { path: "competitions", component: CompetitionsList },
  { path: "players", component: PlayersList },
  { path: "players/:id", component: PlayerDetail },
  { path: "teams", component: TeamsListComponent },
  { path: "matches", component: MatchesList },
  { path: "analytics", component: AnalyticsDashboard },
  { path: "login", component: Login },
  { path: "**", redirectTo: "/home" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
