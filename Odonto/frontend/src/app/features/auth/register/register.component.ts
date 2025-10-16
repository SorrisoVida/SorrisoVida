import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  nome = '';
  email = '';
  senha = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(): void {
    this.authService.register({ nome: this.nome, email: this.email, senha: this.senha }).subscribe({
      next: () => {
        alert('Cadastro realizado com sucesso!');
        this.router.navigate(['/login']);
      },
      error: () => alert('Erro ao registrar usuário.')
    });
  }
}
