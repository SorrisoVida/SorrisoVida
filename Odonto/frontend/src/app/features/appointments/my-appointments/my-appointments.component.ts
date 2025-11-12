import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService, User } from '../../../services/auth.service'; 
import { NavigationService } from '../../../services/navigation.service'; 
import { Appointment, AppointmentService } from '../../../services/appointment.service';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-appointments.component.html',
  styleUrls: ['./my-appointments.component.scss']
})
export class MyAppointmentsComponent implements OnInit {
  currentUser: User | null = null;

  // Flags de permissão
  isEmployee = false;
  isAtendente = false;
  isDentista = false;

  // Dados para Paciente
  proximasConsultas: Appointment[] = [];
  historicoConsultas: Appointment[] = [];

  // Controle de feedback
  showCancellationSuccess = false;
  showSchedulingSuccess = false;
  successMessage: string | null = null;

  constructor(
    private authService: AuthService,
    public navigationService: NavigationService,
    private appointmentService: AppointmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    this.isEmployee = this.currentUser?.role === 'dentista' || this.currentUser?.role === 'atendente';
    this.isAtendente = this.currentUser?.role === 'atendente';
    this.isDentista = this.currentUser?.role === 'dentista';

    // Verifica se há uma mensagem de sucesso vinda da navegação (pós-agendamento)
    const navigationState = this.router.getCurrentNavigation()?.extras.state;
    if (navigationState && navigationState['successMessage']) {
      this.successMessage = navigationState['successMessage'];
      this.showSchedulingSuccess = true;
      setTimeout(() => this.showSchedulingSuccess = false, 5000);
    }

    this.carregarDados();
  }

  private carregarDados(): void {
    if (!this.currentUser) return;

    let appointments$: Observable<Appointment[]>;

    if (this.isPatient) {
      appointments$ = this.appointmentService.getAppointmentsByPatient(Number(this.currentUser.id));
    } else { 
      // Para Atendente e Dentista, usamos dados mockados mais completos para a visão de Agenda Completa
      const mockAppointments: Appointment[] = [
        // Próximas
        { id: 10, servico: 'Clareamento', profissionalId: 3, profissionalNome: 'Dra. Ana Paula', data: '2025-11-15', horario: '10:00', pacienteId: 10, pacienteNome: 'Fernanda Lima', status: 'confirmado' }, // Dra. Ana
        { id: 11, servico: 'Manutenção de Aparelho', profissionalId: 3, profissionalNome: 'Dra. Ana Paula', data: '2025-11-18', horario: '14:00', pacienteId: 11, pacienteNome: 'Ricardo Alves', status: 'agendado' }, // Dra. Ana
        { id: 12, servico: 'Avaliação de Implante', profissionalId: 6, profissionalNome: 'Dr. Carlos Souza', data: '2025-11-15', horario: '15:00', pacienteId: 12, pacienteNome: 'Beatriz Costa', status: 'agendado' }, // Dr. Carlos
        { id: 13, servico: 'Limpeza', profissionalId: 6, profissionalNome: 'Dr. Carlos Souza', data: '2025-11-20', horario: '09:00', pacienteId: 13, pacienteNome: 'Lucas Martins', status: 'agendado' }, // Dr. Carlos
        // Histórico
        { id: 1, servico: 'Limpeza', profissionalId: 3, profissionalNome: 'Dra. Ana Paula', data: '2025-11-12', horario: '10:00', pacienteId: 2, pacienteNome: 'Rafaela', status: 'realizado' }, // Dra. Ana
        { id: 2, servico: 'Avaliação', profissionalId: 3, profissionalNome: 'Dra. Ana Paula', data: '2025-11-12', horario: '11:00', pacienteId: 5, pacienteNome: 'Pietro', status: 'realizado' }, // Dra. Ana
        { id: 3, servico: 'Extração', profissionalId: 3, profissionalNome: 'Dra. Ana Paula', data: '2025-11-10', horario: '09:00', pacienteId: 14, pacienteNome: 'Juliana Paes', status: 'cancelado' }, // Dra. Ana
        { id: 4, servico: 'Restauração', profissionalId: 6, profissionalNome: 'Dr. Carlos Souza', data: '2025-10-25', horario: '16:00', pacienteId: 15, pacienteNome: 'Márcio Garcia', status: 'realizado' }, // Dr. Carlos
        { id: 5, servico: 'Consulta de Rotina', profissionalId: 6, profissionalNome: 'Dr. Carlos Souza', data: '2025-11-05', horario: '11:00', pacienteId: 16, pacienteNome: 'Sandra Annenberg', status: 'realizado' }, // Dr. Carlos
      ];
      appointments$ = of(mockAppointments);
      // Se quiser usar os dados do backend, descomente a linha abaixo e comente o mock
      // appointments$ = this.appointmentService.getAppointments();
    }

    appointments$.subscribe(appointments => {
      let filteredAppointments = appointments;

      // Se for dentista, filtra apenas as suas consultas
      if (this.isDentista) {
        filteredAppointments = appointments.filter(ap => ap.profissionalId === this.currentUser?.id);
      }

      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0); // Zera a hora para comparar apenas a data

      this.proximasConsultas = filteredAppointments
        .filter(ap => new Date(ap.data) >= hoje && (ap.status === 'agendado' || ap.status === 'confirmado'))
        .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

      this.historicoConsultas = filteredAppointments
        .filter(ap => new Date(ap.data) < hoje || ap.status === 'realizado' || ap.status === 'cancelado')
        .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    });
  }

  get isPatient(): boolean { return this.currentUser?.role === 'paciente'; }

  /**
   * Simula o cancelamento de uma consulta.
   * @param consultaId O ID da consulta a ser cancelada.
   */
  cancelarConsulta(consultaId: number): void {
    // TODO: Implementar a chamada de API para cancelar a consulta no backend
    // Ex: this.appointmentService.cancelAppointment(consultaId).subscribe(...)

    // Encontra a consulta na lista de próximas
    const consultaParaCancelar = this.proximasConsultas.find(c => c.id === consultaId);

    if (consultaParaCancelar) {
      // Altera o status para 'cancelada'
      consultaParaCancelar.status = 'cancelado';
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