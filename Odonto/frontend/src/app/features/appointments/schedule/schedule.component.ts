import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Profissional } from './models/profissional.model';
import { NavigationService } from '../../../services/navigation.service'; 
import { Router, RouterModule } from '@angular/router';
import { AppointmentService } from '../../../services/appointment.service'; 
import { AuthService, User } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service'; 

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent implements OnInit {

  // Listas para armazenar os dados que virão da API
  profissionais: Profissional[] = [];
  pacientes: User[] = [];

  // Modelos para os valores selecionados no formulário
  servicoSelecionado: string = '';
  profissionalSelecionado: number | null = null;
  dataSelecionada: string = '';
  horarioSelecionado: string = '';
  pacienteSelecionadoId: number | null = null; // Apenas para atendente

  horariosDisponiveis: string[] = [];

  // Variáveis para controlar o estado do carregamento
  carregandoProfissionais = false;
  carregandoHorarios = false;
  errorMessage: string | null = null;

  private appointmentService = inject(AppointmentService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);

  isAtendente = false;

  constructor(
    public navigationService: NavigationService,
    
  ) { }

  ngOnInit(): void {
    const currentUser = this.authService.getUser();
    this.isAtendente = currentUser?.role === 'atendente';

    this.buscarProfissionais();
    if (this.isAtendente) {
      this.buscarPacientes();
    }
  }

  buscarProfissionais(): void {
    this.carregandoProfissionais = true;
    this.appointmentService.getProfessionals().subscribe(data => {
      this.profissionais = data;
      this.carregandoProfissionais = false;
    });
  }

  buscarPacientes(): void {
    this.userService.getPatients().subscribe(users => {
      // Filtra para garantir que estamos pegando apenas pacientes
      this.pacientes = users.filter(u => u.role === 'paciente');
    });
  }

  onFilterChange(): void {
    this.horariosDisponiveis = []; 

    // Só busca novos horários se uma data e um profissional forem selecionados
    if (this.dataSelecionada && this.profissionalSelecionado) {
      this.buscarHorarios();
    }
  }

  // Método que simula a busca de horários na API com base nos filtros
  buscarHorarios(): void {
    this.carregandoHorarios = true;
    // A verificação de data e profissional já é feita em onFilterChange
    this.appointmentService.getAvailableTimes(this.profissionalSelecionado!, this.dataSelecionada).subscribe(horarios => {
      this.horariosDisponiveis = horarios;
      this.carregandoHorarios = false;
    });
  }

  // Atualiza o horário selecionado
  selecionarHorario(horario: string): void { 
    this.horarioSelecionado = horario;
  }

  // Método para otimizar o *ngFor
  trackByProfissional(index: number, profissional: Profissional): number {
    return profissional.id;
  }

  onSubmit(): void {
    this.errorMessage = null; // Limpa a mensagem de erro anterior
    if (!this.servicoSelecionado || !this.profissionalSelecionado || !this.dataSelecionada || !this.horarioSelecionado || (this.isAtendente && !this.pacienteSelecionadoId)) {
      this.errorMessage = 'Por favor, preencha todos os campos para agendar.';
      return;
    }

    const currentUser = this.authService.getUser();
    if (!currentUser) {
      alert('Você precisa estar logado para agendar uma consulta.');
      return;
    }

    let paciente: User | undefined | null;
    if (this.isAtendente) {
      paciente = this.pacientes.find(p => p.id === this.pacienteSelecionadoId);
    } else {
      paciente = currentUser;
    }

    if (!paciente) {
      alert('Paciente não encontrado ou inválido.');
      return;
    }

    const profissional = this.profissionais.find(p => p.id === this.profissionalSelecionado);
    if (!profissional) return;

    const appointmentData = {
      servico: this.servicoSelecionado,
      profissionalId: this.profissionalSelecionado,
      profissionalNome: profissional.nome,
      data: this.dataSelecionada,
      horario: this.horarioSelecionado,
      pacienteId: Number(paciente.id),
      pacienteNome: paciente.nome
    };

    this.appointmentService.createAppointment(appointmentData).subscribe({ 
      next: (response) => {
        console.log('Agendamento criado com sucesso:', response);
        if (this.isAtendente) {
          // Se for atendente, volta para o painel de funcionário com uma mensagem
          alert('Consulta agendada com sucesso!'); // Usamos alert aqui pois não temos um "toast" no painel do funcionário ainda
          this.router.navigate(['/dashboard/funcionario']);
        } else {
          // Se for paciente, vai para "Minhas Consultas" com a mensagem de sucesso
          this.router.navigate(['/my-appointments'], { state: { successMessage: 'Sua consulta foi agendada com sucesso!' } });
        }
      },
      error: (err) => {
        console.error('Erro ao agendar consulta:', err);
        this.errorMessage = err.error.message || 'Houve um erro ao agendar sua consulta. Tente novamente mais tarde.';
      }
    });
  }
}
