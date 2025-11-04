import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  /**
   * Navega o usuário de volta para a sua página principal (dashboard ou home).
   * Esta função determina a rota do dashboard com base na role do usuário logado.
   */
  navigateBackToDashboard(): void {
    const user = this.authService.getUser();
    let returnUrl = '/home'; // Rota padrão para usuários não logados ou sem role definida

    if (user) {
      switch (user.role) {
        case 'admin': returnUrl = '/dashboard/admin'; break;
        case 'dentista':
        case 'atendente': returnUrl = '/dashboard/funcionario'; break;
        case 'paciente': returnUrl = '/dashboard/paciente'; break;
      }
    }
    this.router.navigate([returnUrl]);
  }
}