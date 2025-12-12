import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-competition-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './competition-detail.html',
  styleUrl: './competition-detail.css',
})
export class CompetitionDetail implements OnInit {
  competition: any = null;
  loading = false;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCompetition(id);
    }
  }

  loadCompetition(id: string): void {
    this.loading = true;
    this.error = '';

    this.apiService.getCompetition(id).subscribe({
      next: (response) => {
        this.competition = response;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load competition details. Please try again later.';
        this.loading = false;
        console.error('Error loading competition:', err);
      }
    });
  }
}
