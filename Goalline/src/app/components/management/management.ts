import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './management.html',
  styleUrl: './management.css',
})
export class ManagementDashboard implements OnInit {
  activeTab: string = 'teams';

  // Common
  loading = false;
  successMessage = '';
  errorMessage = '';

  // Teams
  newTeam = { name: '', country: '', founded: null };
  teams: any[] = [];
  teamToDelete = '';

  // Players
  newPlayer = { name: '', position: '', nationality: '', date_of_birth: '' };
  players: any[] = [];
  playerToDelete = '';

  // Competitions
  newCompetition = { name: '', country: '', type: '' };
  competitions: any[] = [];
  competitionToDelete = '';

  // Matches
  newMatch = { home_team_id: '', away_team_id: '', date: '', competition_id: '' };
  matches: any[] = [];
  matchToDelete = '';

  // Seasons
  newSeason = { name: '', competition_id: '', start_date: '', end_date: '' };
  seasons: any[] = [];
  seasonToDelete = '';

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
    this.clearMessages();
    this.loadData();
  }

  loadData(): void {
    switch (this.activeTab) {
      case 'teams':
        this.loadTeams();
        break;
      case 'players':
        this.loadPlayers();
        break;
      case 'competitions':
        this.loadCompetitions();
        break;
      case 'matches':
        this.loadMatches();
        break;
      case 'seasons':
        this.loadSeasons();
        break;
    }
  }

  loadTeams(): void {
    this.apiService.getTeams(1, 100).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.teams = response;
        } else if (response?.data) {
          this.teams = response.data;
        } else if (response?.items) {
          this.teams = response.items;
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading teams:', err)
    });
  }

  loadPlayers(): void {
    this.apiService.getPlayers(1, 100).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.players = response;
        } else if (response?.data) {
          this.players = response.data;
        } else if (response?.items) {
          this.players = response.items;
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading players:', err)
    });
  }

  loadCompetitions(): void {
    this.apiService.getCompetitions(1, 100).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.competitions = response;
        } else if (response?.data) {
          this.competitions = response.data;
        } else if (response?.items) {
          this.competitions = response.items;
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading competitions:', err)
    });
  }

  loadMatches(): void {
    this.apiService.getMatches({ page: 1, page_size: 100 }).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.matches = response;
        } else if (response?.data) {
          this.matches = response.data;
        } else if (response?.items) {
          this.matches = response.items;
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading matches:', err)
    });
  }

  loadSeasons(): void {
    this.apiService.getSeasons(1, 100).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.seasons = response;
        } else if (response?.data) {
          this.seasons = response.data;
        } else if (response?.items) {
          this.seasons = response.items;
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading seasons:', err)
    });
  }

  // Create operations
  createTeam(): void {
    if (!this.newTeam.name) {
      this.errorMessage = 'Team name is required';
      return;
    }

    this.loading = true;
    this.clearMessages();

    this.apiService.createTeam(this.newTeam).subscribe({
      next: () => {
        this.successMessage = 'Team created successfully!';
        this.newTeam = { name: '', country: '', founded: null };
        this.loadTeams();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Failed to create team: ' + (err.error?.message || err.message);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  createPlayer(): void {
    if (!this.newPlayer.name) {
      this.errorMessage = 'Player name is required';
      return;
    }

    this.loading = true;
    this.clearMessages();

    this.apiService.createPlayer(this.newPlayer).subscribe({
      next: () => {
        this.successMessage = 'Player created successfully!';
        this.newPlayer = { name: '', position: '', nationality: '', date_of_birth: '' };
        this.loadPlayers();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Failed to create player: ' + (err.error?.message || err.message);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  createCompetition(): void {
    if (!this.newCompetition.name) {
      this.errorMessage = 'Competition name is required';
      return;
    }

    this.loading = true;
    this.clearMessages();

    this.apiService.createCompetition(this.newCompetition).subscribe({
      next: () => {
        this.successMessage = 'Competition created successfully!';
        this.newCompetition = { name: '', country: '', type: '' };
        this.loadCompetitions();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Failed to create competition: ' + (err.error?.message || err.message);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  createMatch(): void {
    if (!this.newMatch.home_team_id || !this.newMatch.away_team_id) {
      this.errorMessage = 'Both teams are required';
      return;
    }

    this.loading = true;
    this.clearMessages();

    this.apiService.createMatch(this.newMatch).subscribe({
      next: () => {
        this.successMessage = 'Match created successfully!';
        this.newMatch = { home_team_id: '', away_team_id: '', date: '', competition_id: '' };
        this.loadMatches();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Failed to create match: ' + (err.error?.message || err.message);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  createSeason(): void {
    if (!this.newSeason.name || !this.newSeason.competition_id) {
      this.errorMessage = 'Season name and competition are required';
      return;
    }

    this.loading = true;
    this.clearMessages();

    this.apiService.createSeason(this.newSeason).subscribe({
      next: () => {
        this.successMessage = 'Season created successfully!';
        this.newSeason = { name: '', competition_id: '', start_date: '', end_date: '' };
        this.loadSeasons();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Failed to create season: ' + (err.error?.message || err.message);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Delete operations
  deleteTeam(): void {
    if (!this.teamToDelete) return;

    if (!confirm('Are you sure you want to delete this team?')) return;

    this.loading = true;
    this.clearMessages();

    this.apiService.deleteTeam(this.teamToDelete).subscribe({
      next: () => {
        this.successMessage = 'Team deleted successfully!';
        this.teamToDelete = '';
        this.loadTeams();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Failed to delete team: ' + (err.error?.message || err.message);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deletePlayer(): void {
    if (!this.playerToDelete) return;

    if (!confirm('Are you sure you want to delete this player?')) return;

    this.loading = true;
    this.clearMessages();

    this.apiService.deletePlayer(this.playerToDelete).subscribe({
      next: () => {
        this.successMessage = 'Player deleted successfully!';
        this.playerToDelete = '';
        this.loadPlayers();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Failed to delete player: ' + (err.error?.message || err.message);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteCompetition(): void {
    if (!this.competitionToDelete) return;

    if (!confirm('Are you sure you want to delete this competition?')) return;

    this.loading = true;
    this.clearMessages();

    this.apiService.deleteCompetition(this.competitionToDelete).subscribe({
      next: () => {
        this.successMessage = 'Competition deleted successfully!';
        this.competitionToDelete = '';
        this.loadCompetitions();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Failed to delete competition: ' + (err.error?.message || err.message);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteMatch(): void {
    if (!this.matchToDelete) return;

    if (!confirm('Are you sure you want to delete this match?')) return;

    this.loading = true;
    this.clearMessages();

    this.apiService.deleteMatch(this.matchToDelete).subscribe({
      next: () => {
        this.successMessage = 'Match deleted successfully!';
        this.matchToDelete = '';
        this.loadMatches();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Failed to delete match: ' + (err.error?.message || err.message);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteSeason(): void {
    if (!this.seasonToDelete) return;

    if (!confirm('Are you sure you want to delete this season?')) return;

    this.loading = true;
    this.clearMessages();

    this.apiService.deleteSeason(this.seasonToDelete).subscribe({
      next: () => {
        this.successMessage = 'Season deleted successfully!';
        this.seasonToDelete = '';
        this.loadSeasons();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Failed to delete season: ' + (err.error?.message || err.message);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  getItemId(item: any): string {
    return item._id || item.id || '';
  }

  getItemName(item: any): string {
    return item.name || item.title || 'Unnamed';
  }
}
