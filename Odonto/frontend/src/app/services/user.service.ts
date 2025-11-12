import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  // Busca todos os usuários. O componente irá filtrar por pacientes.
  // Em um app maior, o ideal seria um endpoint /api/users?role=paciente
  getPatients(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  // Usado para criar novos usuários (pacientes ou dentistas)
  createUser(userData: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, userData);
  }
}
