import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../services/auth.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  user: User | null = null;
  editForm!: FormGroup;

  // Mock de todos os usuários do sistema para simular a busca
  private allUsers: User[] = [
    { id: 1, nome: 'Admin Geral', email: 'admin@sorrisovida.com', role: 'admin' },
    { id: 2, nome: 'Dra. Ana Costa', email: 'ana.costa@sorrisovida.com', role: 'dentista' },
    { id: 3, nome: 'Carlos Almeida', email: 'carlos.almeida@sorrisovida.com', role: 'atendente' },
    { id: 4, nome: 'Juliana Pereira', email: 'juliana.p@email.com', role: 'paciente' },
    { id: 5, nome: 'Dr. Marcos Lima', email: 'marcos.lima@sorrisovida.com', role: 'dentista' },
    { id: 6, nome: 'Beatriz Souza', email: 'beatriz.s@email.com', role: 'paciente' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      // Simula a busca de um usuário por ID
      this.user = this.allUsers.find(u => u.id === +userId) || null;
    }

    this.buildForm();
  }

  private buildForm(): void {
    this.editForm = this.fb.group({
      nome: [this.user?.nome || '', Validators.required],
      email: [this.user?.email || '', [Validators.required, Validators.email]],
      role: [this.user?.role || 'paciente', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.editForm.valid && this.user) {
      console.log(`Salvando alterações para o usuário ID: ${this.user.id}`);
      console.log('Novos dados:', this.editForm.value);
      // Aqui viria a lógica para chamar um serviço e atualizar o usuário na API
      alert('Usuário atualizado com sucesso! (Simulação)');
      this.router.navigate(['/admin/gerenciar-usuarios']);
    }
  }
}