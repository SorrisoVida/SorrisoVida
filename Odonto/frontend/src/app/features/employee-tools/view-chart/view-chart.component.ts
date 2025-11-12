import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'app-view-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-chart.component.html',
  styleUrls: ['./view-chart.component.scss']
})
export class ViewChartComponent implements OnInit {
  public navigationService = inject(NavigationService);
  private route = inject(ActivatedRoute);
  private location = inject(Location);

  // Mock de um "banco de dados" de pacientes com mais detalhes
  private allPatientsData = [
    { id: 2, nome: 'Rafaela Santos', cpf: '223.454.767-89', dataNascimento: '1990-05-15', idade: 35, contato: '(11) 98877-6655', alergias: 'Penicilina, Camarão', observacoes: 'Paciente relata sensibilidade a ar frio.' },
    { id: 5, nome: 'Pietro Cardoso', cpf: '343.234.100-80', dataNascimento: '1985-02-10', idade: 40, contato: '(21) 99988-7766', alergias: 'Nenhuma relatada', observacoes: 'Nenhuma.' },
    { id: 10, nome: 'Fernanda Lima', cpf: '111.222.333-44', dataNascimento: '1992-11-30', idade: 32, contato: '(31) 98765-4321', alergias: 'Látex', observacoes: 'Paciente ansioso.' },
    // Adicione mais pacientes aqui se desejar
  ];

  patient: any = null; // Usamos 'any' para flexibilidade no mock

  // Mock de histórico de atendimentos
  atendimentos = [
    {
      patientId: 2, // Associado a Rafaela Santos
      data: '2025-11-12',
      servico: 'Limpeza',
      profissional: 'Dra. Ana Paula',
      procedimento: 'Realizada profilaxia completa com ultrassom e jato de bicarbonato.',
      prescricao: 'Nenhuma.'
    },
    {
      patientId: 2, // Associado a Rafaela Santos
      data: '2025-05-20',
      servico: 'Restauração',
      profissional: 'Dra. Ana Paula',
      procedimento: 'Restauração em resina composta no dente 26.',
      prescricao: 'Analgésico em caso de dor.'
    },
    {
      patientId: 5, // Associado a Pietro Cardoso
      data: '2025-11-11',
      servico: 'Avaliação',
      profissional: 'Dr. Carlos Souza',
      procedimento: 'Avaliação geral, sem necessidade de intervenção imediata.',
      prescricao: 'Retorno em 6 meses.'
    }
  ];

  ngOnInit(): void {
    // Pega o ID do paciente da URL
    const patientId = this.route.snapshot.paramMap.get('id');
    if (patientId) {
      // Encontra o paciente correspondente no nosso "banco de dados" mockado
      this.patient = this.allPatientsData.find(p => p.id === +patientId);
      // Filtra os atendimentos para mostrar apenas os do paciente selecionado
      this.atendimentos = this.atendimentos.filter(a => a.patientId === +patientId);
    }
  }

  goBack(): void {
    this.location.back();
  }
}
