import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../../../services/navigation.service';
@Component({
  selector: 'app-dashboard-redirect',
  standalone: true,
  imports: [CommonModule],
  // Este template é simples, pois o usuário será redirecionado quase que instantaneamente
  template: `<p class="text-center mt-5">Redirecionando para o seu painel...</p>`,
})
export class DashboardRedirectComponent implements OnInit {
  constructor(
    private navigationService: NavigationService
  ) {}
  ngOnInit(): void {
    // A lógica de redirecionamento agora é centralizada no serviço.
    this.navigationService.navigateBackToDashboard();
  }
}