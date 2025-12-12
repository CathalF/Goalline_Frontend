import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings implements OnInit {
  currentUser: any = null;

  // Notification settings
  emailNotifications = true;
  matchReminders = true;
  teamUpdates = false;

  // Display settings
  darkMode = false;
  compactView = false;

  // Privacy settings
  profilePublic = true;
  showEmail = false;

  loading = false;
  successMessage: string = '';
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadSettings();
  }

  loadUserData(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
  }

  loadSettings(): void {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        this.emailNotifications = settings.emailNotifications ?? true;
        this.matchReminders = settings.matchReminders ?? true;
        this.teamUpdates = settings.teamUpdates ?? false;
        this.darkMode = settings.darkMode ?? false;
        this.compactView = settings.compactView ?? false;
        this.profilePublic = settings.profilePublic ?? true;
        this.showEmail = settings.showEmail ?? false;
      } catch (e) {
        console.error('Failed to parse saved settings', e);
      }
    }
  }

  saveSettings(): void {
    this.loading = true;
    this.error = '';
    this.successMessage = '';

    const settings = {
      emailNotifications: this.emailNotifications,
      matchReminders: this.matchReminders,
      teamUpdates: this.teamUpdates,
      darkMode: this.darkMode,
      compactView: this.compactView,
      profilePublic: this.profilePublic,
      showEmail: this.showEmail
    };

    try {
      // Save to localStorage
      localStorage.setItem('userSettings', JSON.stringify(settings));

      // In a real app, you might also want to save to backend
      // await this.apiService.updateSettings(settings);

      this.successMessage = 'Settings saved successfully!';
      this.loading = false;

      // Clear success message after 3 seconds
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    } catch (err) {
      this.loading = false;
      this.error = 'Failed to save settings. Please try again.';
    }
  }

  resetSettings(): void {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      this.emailNotifications = true;
      this.matchReminders = true;
      this.teamUpdates = false;
      this.darkMode = false;
      this.compactView = false;
      this.profilePublic = true;
      this.showEmail = false;

      localStorage.removeItem('userSettings');
      this.successMessage = 'Settings reset to default!';

      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    }
  }

  getUserDisplayName(): string {
    if (this.currentUser?.email) {
      return this.currentUser.email.split('@')[0];
    }
    return 'User';
  }

  async deleteAccount(): Promise<void> {
    const confirmation = prompt(
      'Are you sure you want to delete your account? This action cannot be undone.\n\nType "DELETE" to confirm:'
    );

    if (confirmation === 'DELETE') {
      this.loading = true;
      this.error = '';
      this.successMessage = '';

      try {
        await this.authService.deleteAccount();
        // User will be redirected to login page by the authService
      } catch (err: any) {
        this.loading = false;
        this.error = err.error?.message || 'Failed to delete account. Please try again.';
        console.error('Account deletion error:', err);
      }
    }
  }
}
