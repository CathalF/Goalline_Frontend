import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-teams-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './teams-list.html',
  styleUrls: ['./teams-list.css']
})
export class TeamsListComponent implements OnInit {
  teams: any[] = [];
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
    this.loadTeams();
  }

  loadTeams(page: number = this.page): void {
    this.loading = true;
    this.error = '';
    this.page = page;

    this.apiService.getTeams(this.page, this.pageSize, this.searchTerm || undefined).subscribe({
      next: (response) => {
        console.log('Teams API Response:', response);
        // Handle paginated/array response structure
        if (Array.isArray(response)) {
          this.teams = response;
        } else if (response.data && Array.isArray(response.data)) {
          this.teams = response.data;
          this.page = response.page || this.page;
          this.totalPages = response.total_pages || this.totalPages;
          this.pageSize = response.page_size || this.pageSize;
        } else if (response.items && Array.isArray(response.items)) {
          this.teams = response.items;
          this.page = response.page || this.page;
          this.totalPages = response.total_pages || this.totalPages;
          this.pageSize = response.page_size || this.pageSize;
        } else {
          this.teams = [];
        }
        this.loading = false;
        console.log('Teams loaded:', this.teams.length, 'Loading:', this.loading);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load teams. Please try again later.';
        this.loading = false;
        console.error('Error loading teams:', err);
        this.cdr.detectChanges();
      }
    });
  }

  previousPage(): void {
    if (this.page > 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.loadTeams(this.page - 1);
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.loadTeams(this.page + 1);
    }
  }

  onSearch(): void {
    this.page = 1;
    this.loadTeams(1);
  }
}
