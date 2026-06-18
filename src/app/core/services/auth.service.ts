import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface AuthResponse {
  token: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  isLoggedIn = signal<boolean>(this.hasValidToken());

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('email', res.email);
        this.isLoggedIn.set(true);
      }));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private hasValidToken(): boolean {
    return !!localStorage.getItem('token');
  }
}
