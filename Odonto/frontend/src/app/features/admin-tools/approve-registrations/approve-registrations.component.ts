import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-approve-registrations',
  standalone: true,
  imports: [CommonModule, RouterModule, TitleCasePipe],
  templateUrl: './approve-registrations.component.html',
  styleUrls: ['./approve-registrations.component.scss']
})
export class ApproveRegistrationsComponent implements OnInit {

  pendingUsers: Partial<User>[] = [];

  private http = inject(HttpClient);

  ngOnInit(): void {
    this.loadPendingUsers();
  }

  // Carrega usuários pendentes do backend (ou usa mock se endpoint não existir)
  loadPendingUsers(): void {
    this.http.get<Partial<User>[]>('/api/users/pending').subscribe({
      next: (data) => {
        this.pendingUsers = data || [];
      },
      error: () => {
        // fallback para mock enquanto backend não retorna essa rota
        this.pendingUsers = [
          { id: 101, nome: 'Laura Mendes', email: 'laura.m@email.com', role: 'paciente' },
          { id: 102, nome: 'Dr. Ricardo Gomes', email: 'ricardo.g@clinica.com', role: 'dentista' },
        ];
      }
    });
  }

  approve(id?: number | string): void {
    const userId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (userId == null || Number.isNaN(userId)) {
      console.warn('approve called with invalid id', id);
      return;
    }

    this.http.post(`/api/users/${userId}/approve`, {}).subscribe({
      next: () => {
        // remover usuário aprovado da lista local
        this.pendingUsers = this.pendingUsers.filter(u => u.id !== userId);
      },
      error: (err) => console.error('Erro ao aprovar usuário', err)
    });
  }

  reject(id?: number | string): void {
    const userId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (userId == null || Number.isNaN(userId)) {
      console.warn('reject called with invalid id', id);
      return;
    }

    this.http.post(`/api/users/${userId}/reject`, {}).subscribe({
      next: () => {
        // remover usuário rejeitado da lista local
        this.pendingUsers = this.pendingUsers.filter(u => u.id !== userId);
      },
      error: (err) => console.error('Erro ao rejeitar usuário', err)
    });
  }
}