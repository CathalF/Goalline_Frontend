import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-matches-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './matches-list.html',
  styleUrl: './matches-list.css',
})
export class MatchesList implements OnInit {
  allMatches: any[] = [];
  matches: any[] = [];
  loading = false;
  error: string = '';
  page = 1;
  totalPages = 1;
  pageSize = 20;
  searchTerm = '';

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMatches();
  }

  loadMatches(page: number = this.page): void {
    this.loading = true;
    this.error = '';
    this.page = page;

    const params: any = { page: this.page, page_size: this.pageSize };

    this.apiService.getMatches(params).pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (response) => {
        try {
          console.log('Matches API Response:', response);
          // Normalize payload shapes
          if (Array.isArray(response)) {
            this.allMatches = response;
          } else if (response?.data && Array.isArray(response.data)) {
            this.allMatches = response.data;
            this.page = response.page || this.page;
            this.totalPages = response.total_pages || this.totalPages;
            this.pageSize = response.page_size || this.pageSize;
          } else if (response?.items && Array.isArray(response.items)) {
            this.allMatches = response.items;
            this.page = response.page || this.page;
            this.totalPages = response.total_pages || this.totalPages;
            this.pageSize = response.page_size || this.pageSize;
          } else if (response?.matches && Array.isArray(response.matches)) {
            this.allMatches = response.matches;
            this.page = response.page || this.page;
            this.totalPages = response.total_pages || this.totalPages;
            this.pageSize = response.page_size || this.pageSize;
          } else {
            this.allMatches = [];
          }

          this.matches = this.applySearchFilter(this.allMatches);
          console.log('Matches loaded:', this.matches.length, 'Loading:', this.loading);
          this.cdr.detectChanges();
        } catch (err) {
          console.error('Error normalizing matches response', err);
          this.error = 'Failed to process matches data.';
          this.matches = [];
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.error = 'Failed to load matches. Please try again later.';
        console.error('Error loading matches:', err);
        this.cdr.detectChanges();
      }
    });
  }

  previousPage(): void {
    if (this.page > 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.loadMatches(this.page - 1);
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.loadMatches(this.page + 1);
    }
  }

  onSearch(): void {
    this.page = 1;
    this.loadMatches(1);
  }

  getMatchStatus(match: any): string {
    if (match.status === 'FINISHED') return 'FT';
    if (match.status === 'IN_PLAY') return 'LIVE';
    if (match.status === 'SCHEDULED') return 'Scheduled';
    // If score exists, treat as finished
    if (match.score && (match.score.ft || match.score.fullTime)) return 'FT';
    return 'Scheduled';
  }

  getStatusClass(match: any): string {
    if (match.status === 'FINISHED') return 'status-finished';
    if (match.status === 'IN_PLAY') return 'status-live';
    if (match.status === 'SCHEDULED') return 'status-scheduled';
    return 'status-default';
  }

  parseScore(score: any): { home: number, away: number } | null {
    if (!score) return null;

    // Handle string format "2-1"
    if (typeof score === 'string') {
      const parts = score.split('-').map(s => parseInt(s.trim()));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return { home: parts[0], away: parts[1] };
      }
    }

    // Handle object with ft property
    if (score.ft) {
      // Array format [2, 1]
      if (Array.isArray(score.ft) && score.ft.length === 2) {
        return { home: score.ft[0], away: score.ft[1] };
      }
      // Object format {home: 2, away: 1}
      if (typeof score.ft === 'object' && score.ft.home !== undefined && score.ft.away !== undefined) {
        return { home: score.ft.home, away: score.ft.away };
      }
    }

    // Handle fullTime object (common from some APIs)
    if (score.fullTime && score.fullTime.homeTeam !== undefined && score.fullTime.awayTeam !== undefined) {
      return { home: score.fullTime.homeTeam, away: score.fullTime.awayTeam };
    }

    return null;
  }

  getHomeName(match: any): string {
    return match.homeTeam?.name || match.home_team || match.home || 'Home Team';
  }

  getAwayName(match: any): string {
    return match.awayTeam?.name || match.away_team || match.away || 'Away Team';
  }

  getDisplayDate(match: any): string | null {
    // Prefer utcDate if present, else date + time strings
    if (match.utcDate) return match.utcDate;
    if (match.date && match.time) return `${match.date}T${match.time}`;
    if (match.date) return match.date;
    return null;
  }

  private applySearchFilter(list: any[]): any[] {
    const safeList = Array.isArray(list) ? list : [];
    const term = (this.searchTerm || '').toLowerCase().trim();
    if (!term) return safeList;
    return safeList.filter(m => {
      const home = this.getHomeName(m).toLowerCase();
      const away = this.getAwayName(m).toLowerCase();
      return home.includes(term) || away.includes(term);
    });
  }
}
