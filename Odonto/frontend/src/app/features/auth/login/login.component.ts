import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  senha = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.authService.login({ email: this.email, senha: this.senha }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => alert('Credenciais inválidas')
    });
  }
}
