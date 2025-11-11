import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Profissional } from './models/profissional.model';
import { NavigationService } from '../../../services/navigation.service';
import { GoogleCalendarService } from '../../../services/google-calendar.service';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { RouterModule } from '@angular/router';

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

  // Modelos para os valores selecionados no formulário
  servicoSelecionado: string = '';
  profissionalSelecionado: number | null = null;
  dataSelecionada: string = '';
  horarioSelecionado: string = '';
  horariosDisponiveis: string[] = [];
  googleUser: SocialUser | null = null;

  // Variáveis para controlar o estado do carregamento
  carregandoProfissionais = false;
  carregandoHorarios = false;

  constructor(
    public navigationService: NavigationService,
    private googleCalendarService: GoogleCalendarService,
    private socialAuthService: SocialAuthService
  ) { }

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe(user => this.googleUser = user);
    this.buscarProfissionais();
  }

  buscarProfissionais(): void {
    this.carregandoProfissionais = true;

    setTimeout(() => {
      this.profissionais = [
        { id: 1, nome: 'Dra. Ana Paula' },
        { id: 2, nome: 'Dr. Carlos Souza' }
      ];
      this.carregandoProfissionais = false;
    }, 500);
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
    setTimeout(() => {
      if (this.profissionalSelecionado === 1) { 
        this.horariosDisponiveis = ["09:00", "10:00", "11:00"];
      } else if (this.profissionalSelecionado === 2) { 
        this.horariosDisponiveis = ["14:00", "15:00", "16:00"];
      } else { 
        this.horariosDisponiveis = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
      }
      this.carregandoHorarios = false;
    }, 1000);
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
    if (!this.servicoSelecionado || !this.profissionalSelecionado || !this.dataSelecionada || !this.horarioSelecionado) {
      alert('Por favor, preencha todos os campos para agendar.');
      return;
    }

    if (!this.googleUser) {
      alert('Por favor, conecte sua conta do Google no painel para salvar o agendamento no seu calendário.');
      return;
    }

    const profissional = this.profissionais.find(p => p.id === this.profissionalSelecionado);
    if (!profissional) return;

    // Construir as datas de início e fim
    const [ano, mes, dia] = this.dataSelecionada.split('-').map(Number);
    const [hora, minuto] = this.horarioSelecionado.split(':').map(Number);

    const dataInicio = new Date(ano, mes - 1, dia, hora, minuto);
    const dataFim = new Date(dataInicio.getTime() + 60 * 60 * 1000); // Adiciona 1 hora de duração

    const eventData = {
      summary: `Consulta: ${this.servicoSelecionado} com ${profissional.nome}`,
      description: `Serviço agendado: ${this.servicoSelecionado}.`,
      start: dataInicio,
      end: dataFim
    };

    this.googleCalendarService.createAppointment(eventData).subscribe({
      next: (createdEvent) => {
        if (createdEvent) {
          console.log('Evento criado com sucesso:', createdEvent);
          alert('Consulta agendada e salva no seu Google Agenda com sucesso!');
          // Lógica para salvar no seu banco de dados e redirecionar
        }
      },
      error: (err) => {
        console.error('Erro ao criar evento no Google Agenda:', err);
        alert('Houve um erro ao salvar a consulta no seu Google Agenda. Verifique as permissões e tente novamente.');
      }
    });
  }
}
