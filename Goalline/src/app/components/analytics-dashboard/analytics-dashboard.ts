import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './analytics-dashboard.html',
  styleUrl: './analytics-dashboard.css',
})
export class AnalyticsDashboard implements OnInit {
  team1: string = '';
  team2: string = '';
  h2hData: any = null;
  loading = false;
  error: string = '';
  hasSearched = false;

  // Teams from database
  availableTeams: any[] = [];
  loadingTeams = false;

  // Team Form
  selectedTeamForm: string = '';
  formMatches: number = 5;
  formBy: string = 'overall';
  formData: any = null;
  loadingForm = false;

  // Streaks
  streakType: string = 'winning';
  streakLimit: number = 10;
  streaksData: any = null;
  loadingStreaks = false;

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTeams();
    this.loadStreaks(); // Load streaks by default
  }

  loadTeams(): void {
    this.loadingTeams = true;
    // Fetch all teams from the database (using a large page size to get all teams)
    this.apiService.getTeams(1, 1000).subscribe({
      next: (response) => {
        console.log('Teams loaded for analytics:', response);
        if (Array.isArray(response)) {
          this.availableTeams = response;
        } else if (response?.items && Array.isArray(response.items)) {
          this.availableTeams = response.items;
        } else if (response?.data && Array.isArray(response.data)) {
          this.availableTeams = response.data;
        } else {
          this.availableTeams = [];
        }
        // Sort teams alphabetically by name
        this.availableTeams.sort((a, b) => {
          const nameA = a.name || '';
          const nameB = b.name || '';
          return nameA.localeCompare(nameB);
        });
        this.loadingTeams = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading teams:', err);
        this.availableTeams = [];
        this.loadingTeams = false;
        this.cdr.detectChanges();
      }
    });
  }

  searchHeadToHead(): void {
    if (!this.team1 || !this.team2) {
      this.error = 'Please select both teams';
      return;
    }

    if (this.team1 === this.team2) {
      this.error = 'Please select two different teams';
      return;
    }

    this.loading = true;
    this.error = '';
    this.hasSearched = true;

    this.apiService.getHeadToHead(this.team1, this.team2).subscribe({
      next: (response) => {
        console.log('H2H Response:', response);

        // Transform the backend response to match the template expectations
        if (response.summary) {
          const summary = response.summary;
          this.h2hData = {
            totalMatches: summary.played || 0,
            team1Wins: summary.wins?.[summary.team1] || 0,
            team2Wins: summary.wins?.[summary.team2] || 0,
            draws: summary.draws || 0,
            team1Goals: summary.goals?.[summary.team1] || 0,
            team2Goals: summary.goals?.[summary.team2] || 0,
            matches: response.matches || []
          };
        } else {
          this.h2hData = response;
        }

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load head-to-head data. Please try again.';
        this.loading = false;
        console.error('Error loading analytics:', err);
        this.cdr.detectChanges();
      }
    });
  }

  reset(): void {
    this.team1 = '';
    this.team2 = '';
    this.h2hData = null;
    this.error = '';
    this.hasSearched = false;
  }

  getTeamName(teamId: string): string {
    // Find the team name from the availableTeams array
    const team = this.availableTeams.find(t => (t._id || t.id) === teamId);
    return team?.name || teamId;
  }

  loadTeamForm(): void {
    if (!this.selectedTeamForm) {
      return;
    }

    this.loadingForm = true;
    this.apiService.getTeamForm(this.formMatches, this.formBy, this.selectedTeamForm).subscribe({
      next: (response) => {
        console.log('Form Response:', response);
        this.formData = response;
        this.loadingForm = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading form:', err);
        this.loadingForm = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadStreaks(): void {
    this.loadingStreaks = true;
    this.apiService.getStreaks(this.streakType, this.streakLimit).subscribe({
      next: (response) => {
        console.log('Streaks Response:', response);
        this.streaksData = response;
        this.loadingStreaks = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading streaks:', err);
        this.loadingStreaks = false;
        this.cdr.detectChanges();
      }
    });
  }
}
