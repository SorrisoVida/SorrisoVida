import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verifica se o usuário está autenticado E se ele tem o papel de 'admin'
  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true; // Permite o acesso
  }
  
  router.navigate(['/auth/login']); // Redireciona para o login se não for um admin autorizado
  return false;
};