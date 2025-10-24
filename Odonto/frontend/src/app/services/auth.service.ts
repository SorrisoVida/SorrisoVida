import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

// Interfaces para tipagem forte da resposta da API e do usuário
export interface User {
  id: number;
  nome: string;
  email: string;
  role: 'admin' | 'dentista' | 'atendente' | 'paciente';
}

export interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth'; 
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(credentials: { email: string; senha: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: LoginResponse) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.currentUserSubject.next(res.user); 
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
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): User | null {
    return this.currentUserSubject.getValue();
  }

  private getUserFromStorage(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  // --- Novos métodos para gerenciamento de papéis ---
  getUserRole(): 'admin' | 'dentista' | 'atendente' | 'paciente' | null {
    const user = this.currentUserSubject.getValue();
    return user?.role ?? null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  isDentista(): boolean {
    return this.getUserRole() === 'dentista';
  }

  isAtendente(): boolean {
    return this.getUserRole() === 'atendente';
  }

  // --- Método para simular login em desenvolvimento ---
  public simulateLogin(role: User['role'] = 'paciente'): void {
    let mockUser: User;

    switch (role) {
      case 'admin':
        mockUser = { id: 99, nome: 'Admin Dev', email: 'admin.dev@sorrisovida.com', role: 'admin' };
        break;
      case 'dentista':
        mockUser = { id: 98, nome: 'Dentista Dev', email: 'dentista.dev@sorrisovida.com', role: 'dentista' };
        break;
      case 'atendente':
        mockUser = { id: 97, nome: 'Atendente Dev', email: 'atendente.dev@sorrisovida.com', role: 'atendente' };
        break;
      case 'paciente':
      default:
        mockUser = { id: 96, nome: 'Paciente Dev', email: 'paciente.dev@sorrisovida.com', role: 'paciente' };
        break;
    }
    
    const mockToken = `mock-jwt-token-for-${role}-development`;

    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    this.currentUserSubject.next(mockUser);
    console.log(`Login simulado com sucesso como ${role}!`, mockUser);
    this.router.navigate(['/dashboard']); // Redireciona para o dashboard após o login
  }
}
