import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../../../services/auth.service';
import { NavigationService } from '../../../services/navigation.service';
import { Appointment } from '../../../pages/dashboard/models/appointment.model';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-appointments.component.html',
  styleUrls: ['./my-appointments.component.scss']
})
export class MyAppointmentsComponent implements OnInit {
  currentUser: User | null = null;

  // Dados para Paciente
  proximasConsultas: Appointment[] = [];
  historicoConsultas: Appointment[] = [];

  // Controle de feedback
  showCancellationSuccess = false;

  constructor(
    private authService: AuthService,
    public navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    this.carregarDados();
  }

  private carregarDados(): void {
    // Lógica para carregar consultas do paciente (similar ao dashboard de paciente)
    this.proximasConsultas = [
      { id: 1, data: new Date('2024-09-20T14:00:00'), horario: '14:00', paciente: this.currentUser?.nome || '', servico: 'Clareamento', profissional: 'Dra. Ana', status: 'confirmada' },
      { id: 2, data: new Date('2025-08-15T10:00:00'), horario: '10:00', paciente: this.currentUser?.nome || '', servico: 'Manutenção de Aparelho', profissional: 'Dr. Carlos', status: 'agendada' },
    ];
    this.historicoConsultas = [
      { id: 3, data: new Date('2024-07-05T11:00:00'), horario: '11:00', paciente: this.currentUser?.nome || '', servico: 'Ortodontia', profissional: 'Dr. Carlos', status: 'realizada' },
    ];
  }

  get isPatient(): boolean { return this.currentUser?.role === 'paciente'; }

  /**
   * Simula o cancelamento de uma consulta.
   * @param consultaId O ID da consulta a ser cancelada.
   */
  cancelarConsulta(consultaId: number): void {
    // Encontra a consulta na lista de próximas
    const consultaParaCancelar = this.proximasConsultas.find(c => c.id === consultaId);

    if (consultaParaCancelar) {
      // Altera o status para 'cancelada'
      consultaParaCancelar.status = 'cancelada';

      // Move a consulta para o histórico
      this.historicoConsultas.unshift(consultaParaCancelar); // Adiciona no início do histórico

      // Remove da lista de próximas consultas
      this.proximasConsultas = this.proximasConsultas.filter(c => c.id !== consultaId);

      // Exibe a mensagem de sucesso e a esconde após 5 segundos
      this.showCancellationSuccess = true;
      setTimeout(() => this.showCancellationSuccess = false, 5000);
    }
  }
}