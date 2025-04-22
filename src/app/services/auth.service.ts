import { Injectable, Signal, computed, signal, inject, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { User, UserRole } from '../models/user.model';
import { Router } from '@angular/router';

interface LoginResponse {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<User | null>(null);
  
  private readonly router = inject(Router);
  
  readonly initEffect = effect(() => {
    this.loadUserFromStorage();
  });

  get currentUser(): Signal<User | null> {
    return this.currentUserSignal.asReadonly();
  }

  get isLoggedIn(): Signal<boolean> {
    return computed(() => !!this.currentUserSignal());
  }

  get isReviewer(): Signal<boolean> {
    return computed(() => {
      const user = this.currentUserSignal();
      return !!user && user.role === UserRole.REVIEWER;
    });
  }

  login(username: string, password: string): Observable<LoginResponse> {
    if (username === 'user' && password === 'password') {
      const mockUser: User = {
        id: '1',
        username: 'user',
        role: UserRole.USER,
        token: 'mock-jwt-token-user'
      };
      return this.handleLogin(mockUser);
    } else if (username === 'reviewer' && password === 'password') {
      const mockUser: User = {
        id: '2',
        username: 'reviewer',
        role: UserRole.REVIEWER,
        token: 'mock-jwt-token-reviewer'
      };
      return this.handleLogin(mockUser);
    }

    return throwError(() => new Error('Invalid credentials'));
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  private handleLogin(user: User): Observable<LoginResponse> {
    const response: LoginResponse = {
      user,
      token: user.token || ''
    };

    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSignal.set(user);
    
    return of(response);
  }

  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSignal.set(user);
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('currentUser');
      }
    }
  }
} 