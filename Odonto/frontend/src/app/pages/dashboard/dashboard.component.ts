import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Appointment } from './models/appointment.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  user: any;
  proximaConsulta: Appointment | null = null;
  historicoConsultas: Appointment[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.carregarConsultas();
  }

  // Simula o carregamento das consultas de uma API
  carregarConsultas(): void {
    const todasConsultas: Appointment[] = [
      { id: 1, data: '2025-11-15', horario: '10:00', servico: 'Limpeza Dental', profissional: 'Dra. Ana Paula' },
      { id: 2, data: '2025-09-20', horario: '14:30', servico: 'Clareamento', profissional: 'Dr. Carlos Souza' },
      { id: 3, data: '2025-07-05', horario: '11:00', servico: 'Ortodontia', profissional: 'Dra. Ana Paula' },
    ];

    // Filtra para encontrar a próxima consulta e o histórico
    const hoje = new Date().toISOString().split('T')[0]; 

    this.proximaConsulta = todasConsultas.find(c => c.data >= hoje) || null;
    this.historicoConsultas = todasConsultas.filter(c => c.data < hoje);
  }
}
