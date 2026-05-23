import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  isAuthenticated = false;
  currentUser: any = null;
  showUserMenu = false;

  features = [
    {
      title: 'Competitions',
      description: 'Browse football competitions from around the world',
      icon: 'trophy',
      route: '/competitions',
      color: 'primary'
    },
    {
      title: 'Teams',
      description: 'Explore teams, their rosters and statistics',
      icon: 'people',
      route: '/teams',
      color: 'success'
    },
    {
      title: 'Matches',
      description: 'View match schedules, results and details',
      icon: 'calendar',
      route: '/matches',
      color: 'info'
    },
    {
      title: 'Players',
      description: 'Search for players and view their profiles',
      icon: 'person',
      route: '/players',
      color: 'warning'
    },
    {
      title: 'Analytics',
      description: 'View league tables, top scorers and statistics',
      icon: 'chart-bar',
      route: '/analytics',
      color: 'danger'
    },
    {
      title: 'Management',
      description: 'Create and manage teams, players, matches and more',
      icon: 'gear-fill',
      route: '/management',
      color: 'secondary'
    },
    {
      title: 'Tables & Seasons',
      description: 'View league tables and season information',
      icon: 'table',
      route: '/tables',
      color: 'dark'
    }
  ];

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = this.authService.isAuthenticated();
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', this.onDocumentClick.bind(this));
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.onDocumentClick.bind(this));
  }

  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const userMenu = target.closest('.user-menu-container');
    if (!userMenu && this.showUserMenu) {
      this.showUserMenu = false;
    }
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  logout(): void {
    this.authService.logout();
    this.showUserMenu = false;
  }

  getUserDisplayName(): string {
    if (this.currentUser?.email) {
      return this.currentUser.email.split('@')[0];
    }
    return 'User';
  }
}
