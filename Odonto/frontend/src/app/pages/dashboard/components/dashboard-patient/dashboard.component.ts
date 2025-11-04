import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Appointment } from '../../models/appointment.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'] // Corrigido para styleUrls
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  proximasConsultas: Appointment[] = [];
  historicoConsultas: Appointment[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.carregarConsultas();
  }

  // Simula o carregamento das consultas de uma API
  carregarConsultas(): void {
    const todasConsultas: Appointment[] = [
      { id: 1, data: new Date('2025-08-15T10:00:00'), horario: '10:00', servico: 'Limpeza Dental', profissional: 'Dra. Ana Paula' },
      { id: 2, data: new Date('2024-09-20T14:30:00'), horario: '14:30', servico: 'Clareamento', profissional: 'Dr. Carlos Souza' },
      { id: 3, data: new Date('2024-07-05T11:00:00'), horario: '11:00', servico: 'Ortodontia', profissional: 'Dra. Ana Paula' },
      { id: 4, data: new Date('2025-02-10T09:00:00'), horario: '09:00', servico: 'Manutenção de Aparelho', profissional: 'Dra. Ana Paula' },
    ];

    // Filtra para encontrar a próxima consulta e o histórico
    const hoje = new Date();
    const hojeSemHoras = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

    // Filtra e ordena as consultas futuras (da mais próxima para a mais distante)
    this.proximasConsultas = todasConsultas
      .filter(c => c.data >= hoje)
      .sort((a, b) => a.data.getTime() - b.data.getTime());

    // Filtra e ordena o histórico (da mais recente para a mais antiga)
    this.historicoConsultas = todasConsultas
      .filter(c => c.data < hojeSemHoras)
      .sort((a, b) => b.data.getTime() - a.data.getTime());
  }
}
