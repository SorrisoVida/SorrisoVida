import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BsDropdownModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user: any;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => this.user = user);
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get isAdmin(): boolean {
    return this.user?.role === 'admin';
  }

  get isEmployee(): boolean {
    const role = this.user?.role;
    return role === 'dentista' || role === 'atendente';
  }

  get isPatient(): boolean {
    return this.isAuthenticated && !this.isAdmin && !this.isEmployee;
  }

  /**
   * Retorna a rota correta para o link do logo com base no perfil do usuário.
   */
  get logoRoute(): string[] {
    if (this.isAdmin) {
      return ['/dashboard/admin'];
    }
    if (this.isEmployee) {
      return ['/dashboard/funcionario'];
    }
    // Para pacientes e usuários não autenticados, o logo leva para a home.
    return ['/home'];
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
