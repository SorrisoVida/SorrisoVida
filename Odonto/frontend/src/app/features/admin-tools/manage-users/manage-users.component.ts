import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../../services/auth.service';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, RouterModule, TitleCasePipe],
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  activeFilter: string = 'todos';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Dados mockados para a lista de usuários
    this.users = [
      { id: 1, nome: 'Admin Geral', email: 'admin@sorrisovida.com', role: 'admin' },
      { id: 2, nome: 'Dra. Ana Costa', email: 'ana.costa@sorrisovida.com', role: 'dentista' },
      { id: 3, nome: 'Carlos Almeida', email: 'carlos.almeida@sorrisovida.com', role: 'atendente' },
      { id: 4, nome: 'Juliana Pereira', email: 'juliana.p@email.com', role: 'paciente' },
      { id: 5, nome: 'Dr. Marcos Lima', email: 'marcos.lima@sorrisovida.com', role: 'dentista' },
      { id: 6, nome: 'Beatriz Souza', email: 'beatriz.s@email.com', role: 'paciente' },
    ];
    this.filteredUsers = [...this.users]; // Inicializa a lista filtrada com todos os usuários
  }

  editUser(userId: number): void {
    // Navega para a nova página de edição de usuário, passando o ID na rota.
    this.router.navigate(['/admin/editar-usuario', userId]);
  }

  removeUser(userId: number): void {
    if (confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
      this.users = this.users.filter(u => u.id !== userId);
      this.filterByRole(this.activeFilter); // Re-aplica o filtro para atualizar a lista visível
    }
  }

  filterByRole(role: string): void {
    this.activeFilter = role;
    if (role === 'todos') {
      this.filteredUsers = [...this.users];
    } else {
      this.filteredUsers = this.users.filter(user => user.role === role);
    }
  }

  sortByName(): void {
    this.filteredUsers.sort((a, b) => a.nome.localeCompare(b.nome));
  }

  getRoleClass(role: string): string {
    switch (role) {
      case 'admin': return 'bg-danger';
      case 'dentista': return 'bg-primary';
      case 'atendente': return 'bg-info text-dark';
      case 'paciente': return 'bg-secondary';
      default: return 'bg-light text-dark';
    }
  }
}