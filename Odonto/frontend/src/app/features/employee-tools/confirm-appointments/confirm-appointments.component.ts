import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

type AppointmentStatus = 'A confirmar' | 'Confirmado' | 'Cancelado';

interface ConfirmAppointment {
  id: number;
  paciente: string;
  horario: string;
  telefone: string;
  servico: string;
  status: AppointmentStatus;
}

@Component({
  selector: 'app-confirm-appointments',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './confirm-appointments.component.html',
  styleUrls: ['./confirm-appointments.component.scss']
})
export class ConfirmAppointmentsComponent implements OnInit {
  appointments: ConfirmAppointment[] = [];
  tomorrow = new Date();

  constructor() {
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
  }

  ngOnInit(): void {
    // Dados mockados para a lista de confirmação
    this.appointments = [
      { id: 1, paciente: 'Fernanda Lima', horario: '09:00', telefone: '(21) 99887-6655', servico: 'Limpeza', status: 'A confirmar' },
      { id: 2, paciente: 'Ricardo Alves', horario: '10:00', telefone: '(11) 98765-4321', servico: 'Restauração', status: 'Confirmado' },
      { id: 3, paciente: 'Beatriz Costa', horario: '11:00', telefone: '(81) 99554-4332', servico: 'Avaliação', status: 'A confirmar' },
      { id: 4, paciente: 'Lucas Martins', horario: '14:00', telefone: '(48) 99123-4567', servico: 'Clareamento', status: 'A confirmar' },
      { id: 5, paciente: 'Mariana Gomes', horario: '15:00', telefone: '(31) 98888-7777', servico: 'Manutenção de Aparelho', status: 'Cancelado' },
    ];
  }

  updateStatus(id: number, newStatus: AppointmentStatus): void {
    const appointment = this.appointments.find(apt => apt.id === id);
    if (appointment) {
      appointment.status = newStatus;
    }
  }

  getStatusClass(status: AppointmentStatus): string {
    switch (status) {
      case 'A confirmar': return 'bg-warning text-dark';
      case 'Confirmado': return 'bg-success';
      case 'Cancelado': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
}