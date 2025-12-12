import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-team-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './team-detail.html',
  styleUrl: './team-detail.css',
})
export class TeamDetail implements OnInit {
  team: any = null;
  loading = false;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTeam(id);
    }
  }

  loadTeam(id: string): void {
    this.loading = true;
    this.error = '';

    this.apiService.getTeam(id).subscribe({
      next: (response) => {
        this.team = response;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load team details. Please try again later.';
        this.loading = false;
        console.error('Error loading team:', err);
      }
    });
  }
}
