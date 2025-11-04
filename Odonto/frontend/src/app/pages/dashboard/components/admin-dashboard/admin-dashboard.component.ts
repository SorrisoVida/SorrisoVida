import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../../../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  currentUser: User | null = null;
  cadastrosPendentes: number = 0;
  faturamentoDoMes: number = 0;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    this.carregarDadosDoPainel();
  }

  private carregarDadosDoPainel(): void {
    // Simulação de busca de dados para o admin
    this.faturamentoDoMes = 45800.00;
    this.cadastrosPendentes = 2;
  }
}
