import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // O serviço que verifica se o usuário está logado

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true; // Usuário autenticado, permite o acesso.
  }

  // Usuário não autenticado, redireciona para a página de login.
  router.navigate(['/auth/login']);
  return false;
};