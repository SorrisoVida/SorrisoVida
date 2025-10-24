import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router'; 
import { Appointment } from '../../models/appointment.model'; 
import { AuthService, User } from '../../../../services/auth.service';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true, 
  imports: [CommonModule, RouterModule], 
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.scss' 
})
export class EmployeeDashboard implements OnInit {
  currentUser: User | null = null;
  
  agendaDoDia: Appointment[] = [];
  pacientesEmEspera: number = 0; // Renomeado para clareza

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    this.carregarDadosDoPainel();
  }

  // Getters para facilitar a verificação de perfil no template
  get isDentista(): boolean {
    return this.currentUser?.role === 'dentista';
  }

  get isAtendente(): boolean {
    return this.currentUser?.role === 'atendente';
  }

  // Simula o carregamento de dados com base no perfil
  private carregarDadosDoPainel(): void {
    if (this.isDentista || this.isAtendente) {
      this.agendaDoDia = [
        { id: 1, data: new Date(), horario: '09:00', paciente: 'Carlos Silva', servico: 'Limpeza', profissional: 'Dra. Ana' },
        { id: 2, data: new Date(), horario: '10:00', paciente: 'Maria Oliveira', servico: 'Restauração', profissional: 'Dra. Ana' },
        { id: 3, data: new Date(), horario: '11:00', paciente: 'Pedro Martins', servico: 'Avaliação', profissional: 'Dra. Ana' },
      ];
    }

    if (this.isAtendente) {
      this.pacientesEmEspera = 5; 
    }
  }
}
