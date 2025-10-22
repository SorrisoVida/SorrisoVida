import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth'; 
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(this.getUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(credentials: { email: string; senha: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          const user = res.user || {};
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSubject.next(user); 
        }
      })
    );
  }

  register(data: { nome: string; email: string; senha: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null); 
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): any {
    return this.currentUserSubject.value;
  }

  private getUserFromStorage(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  // --- Método para simular login em desenvolvimento ---
  public simulateLogin(): void {
    const mockUser = {
      id: 99,
      nome: 'Vitoria',
      email: 'dev@sorrisovida.com'
    };
    const mockToken = 'mock-jwt-token-for-development-only';

    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    this.currentUserSubject.next(mockUser);
    console.log('Login simulado com sucesso!', mockUser);
  }
}
