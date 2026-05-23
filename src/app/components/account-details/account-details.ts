import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './account-details.html',
  styleUrl: './account-details.css'
})
export class AccountDetails implements OnInit {
  currentUser: any = null;
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  loading = false;
  error: string = '';
  successMessage: string = '';
  editMode = false;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.email = user.email || '';
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    this.error = '';
    this.successMessage = '';

    // Reset form if canceling
    if (!this.editMode) {
      this.email = this.currentUser?.email || '';
      this.newPassword = '';
      this.confirmPassword = '';
    }
  }

  async onSubmit(): Promise<void> {
    this.error = '';
    this.successMessage = '';

    // Validation
    if (!this.email) {
      this.error = 'Email is required';
      return;
    }

    // If password is being changed, validate it
    if (this.newPassword || this.confirmPassword) {
      if (this.newPassword !== this.confirmPassword) {
        this.error = 'Passwords do not match';
        return;
      }
      if (this.newPassword.length < 6) {
        this.error = 'Password must be at least 6 characters';
        return;
      }
    }

    this.loading = true;

    try {
      const updateData: any = {
        email: this.email
      };

      // Only include password if it's being changed
      if (this.newPassword) {
        updateData.password = this.newPassword;
      }

      await this.apiService.updateProfile(updateData);

      this.successMessage = 'Account updated successfully!';
      this.editMode = false;
      this.newPassword = '';
      this.confirmPassword = '';

      // Refresh user data
      await this.authService.refreshUser();

      this.loading = false;
    } catch (err: any) {
      this.loading = false;
      this.error = err.error?.message || 'Failed to update account. Please try again.';
    }
  }

  getUserDisplayName(): string {
    if (this.currentUser?.email) {
      return this.currentUser.email.split('@')[0];
    }
    return 'User';
  }

  getUserInitials(): string {
    const displayName = this.getUserDisplayName();
    return displayName.substring(0, 2).toUpperCase();
  }
}
