import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-players-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './players-list.html',
  styleUrl: './players-list.css',
})
export class PlayersList implements OnInit {
  players: any[] = [];
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
    this.loadPlayers();
  }

  loadPlayers(page: number = this.page): void {
    this.loading = true;
    this.error = '';
    this.page = page;

    this.apiService.getPlayers(this.page, this.pageSize, this.searchTerm || undefined).subscribe({
      next: (response) => {
        console.log('Players API Response:', response);
        // Handle various response shapes (array, {data: [...]}, {items: [...]})
        if (Array.isArray(response)) {
          this.players = response;
        } else if (response?.data && Array.isArray(response.data)) {
          this.players = response.data;
          this.page = response.page || this.page;
          this.totalPages = response.total_pages || this.totalPages;
          this.pageSize = response.page_size || this.pageSize;
        } else if (response?.items && Array.isArray(response.items)) {
          this.players = response.items;
          this.page = response.page || this.page;
          this.totalPages = response.total_pages || this.totalPages;
          this.pageSize = response.page_size || this.pageSize;
        } else {
          this.players = [];
        }
        this.loading = false;
        console.log('Players loaded:', this.players.length, 'Loading:', this.loading);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load players. Please try again later.';
        this.loading = false;
        console.error('Error loading players:', err);
        this.cdr.detectChanges();
      }
    });
  }

  previousPage(): void {
    if (this.page > 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.loadPlayers(this.page - 1);
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.loadPlayers(this.page + 1);
    }
  }

  onSearch(): void {
    this.page = 1;
    this.loadPlayers(1);
  }

  getPositionIcon(position: string): string {
    const pos = position?.toLowerCase() || '';
    if (pos.includes('forward') || pos.includes('striker')) return 'bi-bullseye';
    if (pos.includes('midfielder') || pos.includes('midfield')) return 'bi-hexagon';
    if (pos.includes('defender') || pos.includes('defence')) return 'bi-shield-fill-check';
    if (pos.includes('goalkeeper') || pos.includes('keeper')) return 'bi-hand-thumbs-up';
    return 'bi-person';
  }
}
