import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-tables-seasons',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tables-seasons.html',
  styleUrl: './tables-seasons.css',
})
export class TablesSeasons implements OnInit {
  activeTab: string = 'tables';

  // Tables
  competitions: any[] = [];
  seasons: any[] = [];
  selectedCompetition: string = '';
  selectedSeason: string = '';
  tableData: any = null;
  loadingTable = false;
  tableError = '';

  // Seasons List
  allSeasons: any[] = [];
  loadingSeasons = false;
  seasonsError = '';
  seasonsPage = 1;
  seasonsTotalPages = 1;

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCompetitions();
    this.loadAllSeasons();
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
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

  onCompetitionChange(): void {
    this.selectedSeason = '';
    this.tableData = null;
    if (!this.selectedCompetition) {
      this.seasons = [];
      return;
    }

    // Load seasons for the selected competition
    this.apiService.getSeasons(1, 100).subscribe({
      next: (response) => {
        let allSeasons: any[] = [];
        if (Array.isArray(response)) {
          allSeasons = response;
        } else if (response?.data) {
          allSeasons = response.data;
        } else if (response?.items) {
          allSeasons = response.items;
        }

        // Filter seasons by selected competition
        this.seasons = allSeasons.filter(s =>
          (s.competition_id === this.selectedCompetition) ||
          (s.competition?._id === this.selectedCompetition) ||
          (s.competition?.id === this.selectedCompetition)
        );
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading seasons:', err)
    });
  }

  loadTable(): void {
    if (!this.selectedCompetition || !this.selectedSeason) {
      this.tableError = 'Please select both competition and season';
      return;
    }

    this.loadingTable = true;
    this.tableError = '';
    this.tableData = null;

    this.apiService.getLeagueTable(this.selectedCompetition, this.selectedSeason).subscribe({
      next: (response) => {
        console.log('Table Response:', response);
        // Handle different response formats
        if (Array.isArray(response)) {
          this.tableData = { standings: response };
        } else if (response?.data) {
          this.tableData = { standings: response.data };
        } else if (response?.standings) {
          this.tableData = response;
        } else if (response?.table) {
          this.tableData = { standings: response.table };
        } else {
          this.tableData = response;
        }
        // Normalize numbers and derived fields to avoid bad values
        if (this.tableData?.standings) {
          this.tableData.standings = this.tableData.standings.map((row: any) => this.normalizeRow(row));
        }
        this.loadingTable = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.tableError = 'Failed to load table: ' + (err.error?.message || err.message);
        this.loadingTable = false;
        console.error('Error loading table:', err);
        this.cdr.detectChanges();
      }
    });
  }

  loadAllSeasons(): void {
    this.loadingSeasons = true;
    this.seasonsError = '';

    this.apiService.getSeasons(this.seasonsPage, 20).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.allSeasons = response;
        } else if (response?.data) {
          this.allSeasons = response.data;
          this.seasonsPage = response.page || 1;
          this.seasonsTotalPages = response.total_pages || 1;
        } else if (response?.items) {
          this.allSeasons = response.items;
          this.seasonsPage = response.page || 1;
          this.seasonsTotalPages = response.total_pages || 1;
        }
        this.loadingSeasons = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.seasonsError = 'Failed to load seasons';
        this.loadingSeasons = false;
        console.error('Error loading seasons:', err);
        this.cdr.detectChanges();
      }
    });
  }

  previousSeasonsPage(): void {
    if (this.seasonsPage > 1) {
      this.seasonsPage--;
      this.loadAllSeasons();
    }
  }

  nextSeasonsPage(): void {
    if (this.seasonsPage < this.seasonsTotalPages) {
      this.seasonsPage++;
      this.loadAllSeasons();
    }
  }

  getCompetitionName(competitionId: string): string {
    const comp = this.competitions.find(c => (c._id || c.id) === competitionId);
    return comp?.name || competitionId;
  }

  getItemId(item: any): string {
    return item._id || item.id || '';
  }

  getItemName(item: any): string {
    return item.name || item.title || 'Unnamed';
  }

  private normalizeRow(row: any) {
    const toNum = (v: any) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    };

    const wins = toNum(row.wins ?? row.won ?? row.W);
    const draws = toNum(row.draws ?? row.drawn ?? row.D);
    const losses = toNum(row.losses ?? row.lost ?? row.L);
    const played = toNum(row.played ?? row.P) || (wins + draws + losses);
    const gf = toNum(row.goals_for ?? row.gf ?? row.GF);
    const ga = toNum(row.goals_against ?? row.ga ?? row.GA);
    const gd = gf - ga;
    const points = toNum(row.points ?? row.Pts) || (wins * 3 + draws);

    return {
      ...row,
      wins,
      draws,
      losses,
      played,
      goals_for: gf,
      goals_against: ga,
      goal_difference: gd,
      points,
    };
  }
}
