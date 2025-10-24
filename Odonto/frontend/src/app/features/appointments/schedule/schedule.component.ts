import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Profissional } from './models/profissional.model';

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
  horariosDisponiveis: string[] = [];

  // Modelos para os valores selecionados no formulário
  servicoSelecionado: number | null = null;
  profissionalSelecionado: number | null = null;
  dataSelecionada: string = '';
  horarioSelecionado: string | null = null;

  // Variáveis para controlar o estado do carregamento
  carregandoProfissionais = false;
  carregandoHorarios = false;

  constructor() { }

  ngOnInit(): void {
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
    this.horarioSelecionado = null; 
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
}
