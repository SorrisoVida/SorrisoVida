import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-redirect',
  standalone: true,
  imports: [CommonModule],
  // Este template é simples, pois o usuário será redirecionado quase que instantaneamente
  template: `<p class="text-center mt-5">Redirecionando para o seu painel...</p>`,
})
export class DashboardRedirectComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    const userRole = user?.role;

    if (userRole === 'admin') {
      this.router.navigate(['/dashboard/admin']);
    } else if (userRole === 'dentista' || userRole === 'atendente') {
      this.router.navigate(['/dashboard/funcionario']);
    } else {
      this.router.navigate(['/dashboard/paciente']);
    }
  }
}