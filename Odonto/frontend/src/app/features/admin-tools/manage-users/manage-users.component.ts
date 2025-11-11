import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface User {
  id: number;
  nome: string;
  email: string;
  role: 'admin' | 'dentista' | 'atendente' | 'paciente';
}

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  activeFilter = 'todos';
  private http = inject(HttpClient);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<User[]>('/api/users').subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
      },
      error: (err) => console.error('Erro ao carregar usuários', err)
    });
  }

  filterByRole(role: string): void {
    this.activeFilter = role;
    if (role === 'todos') {
      this.filteredUsers = this.users;
    } else {
      this.filteredUsers = this.users.filter(u => u.role === role);
    }
  }

  sortByName(): void {
    this.filteredUsers = [...this.filteredUsers].sort((a, b) =>
      a.nome.localeCompare(b.nome)
    );
  }

  editUser(id: number): void {
    this.router.navigate([`/admin/users/edit/${id}`]);
  }

  removeUser(id: number): void {
    if (!confirm('Tem certeza que deseja remover este usuário?')) return;
    this.http.delete(`/api/users/${id}`).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== id);
        this.filteredUsers = this.filteredUsers.filter(u => u.id !== id);
      },
      error: (err) => console.error('Erro ao remover usuário', err)
    });
  }

  getRoleClass(role: string): string {
    const roleClasses: { [key: string]: string } = {
      admin: 'bg-danger',
      dentista: 'bg-primary',
      atendente: 'bg-info',
      paciente: 'bg-success'
    };
    return roleClasses[role] || 'bg-secondary';
  }
}