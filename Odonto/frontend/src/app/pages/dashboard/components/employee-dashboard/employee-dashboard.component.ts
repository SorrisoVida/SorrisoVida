import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router'; 
import { AuthService, User } from '../../../../services/auth.service';
import { Subscription } from 'rxjs';

// Interface temporária para os dados da agenda, para não depender do GoogleCalendarService
export interface Appointment {
  horario: string;
  paciente: string;
  servico: string;
}

@Component({
  selector: 'app-employee-dashboard',
  standalone: true, 
  imports: [CommonModule, RouterModule], 
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.scss' 
})
export class EmployeeDashboard implements OnInit, OnDestroy {
  currentUser: User | null = null;
  
  agendaDoDia: Appointment[] = [];
  pacientesEmEspera: number = 0;
  isLoadingAgenda = false;
  errorAgenda: string | null = null;
  private authSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Assina as mudanças no estado de autenticação.
    this.authSubscription = this.authService.currentUser.subscribe((user: User | null) => {
      if (!user) return; // Se o usuário for nulo, não faz nada.

      this.currentUser = user;
      this.carregarDadosDoPainel();
    });
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
    // Lógica para carregar dados que não dependem de APIs externas
    if (this.isAtendente) {
      this.pacientesEmEspera = 5; 
    }

    // Restaurando os dados fictícios para a agenda do dia, garantindo que ela seja exibida.
    this.agendaDoDia = [
      { horario: '09:00', paciente: 'Carlos Silva', servico: 'Limpeza' },
      { horario: '10:00', paciente: 'Maria Oliveira', servico: 'Restauração' },
      { horario: '11:00', paciente: 'Pedro Martins', servico: 'Avaliação' },
    ];
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
