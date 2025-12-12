import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './player-detail.html',
  styleUrl: './player-detail.css',
})
export class PlayerDetail implements OnInit {
  player: any = null;
  loading = false;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPlayer(id);
    }
  }

  loadPlayer(id: string): void {
    this.loading = true;
    this.error = '';

    this.apiService.getPlayer(id).subscribe({
      next: (response) => {
        this.player = response;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load player details. Please try again later.';
        this.loading = false;
        console.error('Error loading player:', err);
      }
    });
  }
}
