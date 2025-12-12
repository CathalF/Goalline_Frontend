import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-match-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './match-detail.html',
  styleUrl: './match-detail.css',
})
export class MatchDetail implements OnInit {
  match: any = null;
  loading = false;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadMatch(id);
    }
  }

  loadMatch(id: string): void {
    this.loading = true;
    this.error = '';

    this.apiService.getMatch(id).subscribe({
      next: (response) => {
        this.match = response;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load match details. Please try again later.';
        this.loading = false;
        console.error('Error loading match:', err);
      }
    });
  }

  getMatchStatus(match: any): string {
    if (!match) return 'Unknown';
    if (match.status === 'FINISHED') return 'FT';
    if (match.status === 'IN_PLAY') return 'LIVE';
    if (match.status === 'SCHEDULED') return 'Scheduled';
    return match.status || 'Unknown';
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

    return null;
  }
}
