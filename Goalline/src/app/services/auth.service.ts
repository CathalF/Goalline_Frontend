import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();
  private jwtHelper = new JwtHelperService();

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const user = localStorage.getItem('currentUser');
    const token = localStorage.getItem('token');
    
    if (user && token) {
      if (!this.jwtHelper.isTokenExpired(token)) {
        this.currentUserSubject.next(JSON.parse(user));
      } else {
        this.clearAuth();
      }
    }
  }

  login(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.login({ email, password }).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
          resolve(response);
        },
        error: (error) => reject(error)
      });
    });
  }

  register(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.register({ email, password }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error)
      });
    });
  }

  logout(): void {
    this.apiService.logout().subscribe({
      next: () => {
        this.clearAuth();
        this.router.navigate(['/login']);
      },
      error: () => {
        this.clearAuth();
        this.router.navigate(['/login']);
      }
    });
  }

  private clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'admin';
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  refreshUser(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.getProfile().subscribe({
        next: (response) => {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
          resolve();
        },
        error: (error) => reject(error)
      });
    });
  }

  async deleteAccount(): Promise<void> {
    await this.apiService.deleteAccount();
    this.clearAuth();
    this.router.navigate(['/login']);
  }
}