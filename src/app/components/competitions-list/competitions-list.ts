import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-competitions-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './competitions-list.html',
  styleUrl: './competitions-list.css',
})
export class CompetitionsList implements OnInit {
  competitions: any[] = [];
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
    this.loadCompetitions();
  }

  loadCompetitions(page: number = this.page): void {
    this.loading = true;
    this.error = '';
    this.page = page;

    this.apiService.getCompetitions(this.page, this.pageSize, undefined, this.searchTerm || undefined).subscribe({
      next: (response) => {
        console.log('Competitions API Response:', response);
        // Handle various response shapes (array, {data: [...]}, {items: [...]})
        if (Array.isArray(response)) {
          this.competitions = response;
        } else if (response?.data && Array.isArray(response.data)) {
          this.competitions = response.data;
          this.page = response.page || this.page;
          this.totalPages = response.total_pages || this.totalPages;
          this.pageSize = response.page_size || this.pageSize;
        } else if (response?.items && Array.isArray(response.items)) {
          this.competitions = response.items;
          this.page = response.page || this.page;
          this.totalPages = response.total_pages || this.totalPages;
          this.pageSize = response.page_size || this.pageSize;
        } else {
          this.competitions = [];
        }
        this.loading = false;
        console.log('Competitions loaded:', this.competitions.length, 'Loading:', this.loading);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load competitions. Please try again later.';
        this.loading = false;
        console.error('Error loading competitions:', err);
        this.cdr.detectChanges();
      }
    });
  }

  previousPage(): void {
    if (this.page > 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.loadCompetitions(this.page - 1);
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.loadCompetitions(this.page + 1);
    }
  }

  onSearch(): void {
    this.page = 1;
    this.loadCompetitions(1);
  }
}
