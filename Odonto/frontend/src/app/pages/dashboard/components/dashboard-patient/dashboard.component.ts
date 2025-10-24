import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Appointment } from '../../models/appointment.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  proximaConsulta: Appointment | null = null;
  historicoConsultas: Appointment[] = [];

  constructor() {}

  ngOnInit(): void {
    this.carregarConsultas();
  }

  // Simula o carregamento das consultas de uma API
  carregarConsultas(): void {
    const todasConsultas: Appointment[] = [
      { id: 1, data: new Date('2025-11-15T10:00:00'), horario: '10:00', servico: 'Limpeza Dental', profissional: 'Dra. Ana Paula' },
      { id: 2, data: new Date('2024-09-20T14:30:00'), horario: '14:30', servico: 'Clareamento', profissional: 'Dr. Carlos Souza' },
      { id: 3, data: new Date('2024-07-05T11:00:00'), horario: '11:00', servico: 'Ortodontia', profissional: 'Dra. Ana Paula' },
    ];

    // Filtra para encontrar a próxima consulta e o histórico
    const hoje = new Date();
    // Garante que a comparação ignore a hora do dia para o histórico
    hoje.setHours(0, 0, 0, 0);

    this.proximaConsulta = todasConsultas.find(c => c.data >= hoje) || null;
    this.historicoConsultas = todasConsultas.filter(c => c.data < hoje);
  }
}
