import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const employeeGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Permite o acesso se o usuário estiver autenticado E for 'dentista' ou 'atendente'
  if (authService.isAuthenticated() && (authService.isDentista() || authService.isAtendente())) {
    return true;
  }

  router.navigate(['/auth/login']); // Redireciona para o login se não for um funcionário autorizado
  return false;
};
