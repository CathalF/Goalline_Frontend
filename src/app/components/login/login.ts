import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string = '';
  password: string = '';
  loading = false;
  error: string = '';
  isLoginMode = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.error = '';
    this.email = '';
    this.password = '';
  }

  async onSubmit(): Promise<void> {
    if (!this.email || !this.password) {
      this.error = 'Please enter both email and password';
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      if (this.isLoginMode) {
        await this.authService.login(this.email, this.password);
        this.router.navigate(['/']);
      } else {
        await this.authService.register(this.email, this.password);
        // After registration, automatically log in
        await this.authService.login(this.email, this.password);
        this.router.navigate(['/']);
      }
      this.loading = false;
    } catch (err) {
      this.loading = false;
      this.error = this.isLoginMode
        ? 'Login failed. Please check your credentials.'
        : 'Registration failed. Please try again.';
      console.error('Auth error:', err);
    }
  }
}
