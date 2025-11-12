import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface User { id: number | string; nome: string; email: string; role: string; }
export interface LoginResponse { token: string; user: User; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // inicializa currentUser a partir do localStorage se disponível
    const rawUser = localStorage.getItem('user');
    if (rawUser) {
      try {
        const user: User = JSON.parse(rawUser);
        this.currentUserSubject.next(user);
      } catch { /* ignore */ }
    }
  }

  // --- token / user helpers ---
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): User | null {
    return this.currentUserSubject.getValue();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // role checks
  isAdmin(): boolean {
    const u = this.getUser();
    return !!u && u.role === 'admin';
  }

  isDentista(): boolean {
    const u = this.getUser();
    return !!u && u.role === 'dentista';
  }

  isAtendente(): boolean {
    const u = this.getUser();
    return !!u && u.role === 'atendente';
  }

  // --- auth flows ---
  // register
  register(payload: { nome: string; email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/register', payload).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.currentUserSubject.next(res.user);
      })
    );
  }

  // login tradicional (email + password) — adapte endpoint conforme backend
  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', credentials).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.currentUserSubject.next(res.user);
      })
    );
  }

  // social login (idToken) — já existente em conversas anteriores
  socialLogin(idToken: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/google', { idToken }).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.currentUserSubject.next(res.user);
      })
    );
  }

  // forgot password — adapte endpoint conforme backend
  forgotPassword(email: string): Observable<any> {
    return this.http.post('/api/auth/forgot-password', { email });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  // utilitário de desenvolvimento / testes (simula login local)
  simulateLogin(role: string): void {
    const fakeUser: User = {
      id: `sim-${role}`,
      nome: `Usuário ${role}`,
      email: `${role}@local.test`,
      role
    };
    const fakeToken = `sim-token-${role}`;
    localStorage.setItem('token', fakeToken);
    localStorage.setItem('user', JSON.stringify(fakeUser));
    this.currentUserSubject.next(fakeUser);
  }
}
