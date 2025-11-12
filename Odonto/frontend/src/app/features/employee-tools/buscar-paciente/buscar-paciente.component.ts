import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationService } from '../../../services/navigation.service';
import { RouterModule } from '@angular/router';

interface MockPatient {
  id: number;
  nome: string;
  cpf: string;
  ultimaConsulta: string;
}

@Component({
  selector: 'app-buscar-paciente',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './buscar-paciente.component.html',
  styleUrls: ['./buscar-paciente.component.scss']
})
export class BuscarPacienteComponent implements OnInit {
  public navigationService = inject(NavigationService);
  
  searchTerm: string = '';
  
  allPatients: MockPatient[] = [
    { id: 2, nome: 'Rafaela Santos', cpf: '223.454.767-89', ultimaConsulta: '2025-11-12' },
    { id: 5, nome: 'Pietro Cardoso', cpf: '343.234.100-80', ultimaConsulta: '2025-11-11' },
    { id: 10, nome: 'Fernanda Lima', cpf: '111.222.333-44', ultimaConsulta: '2025-11-15' },
    { id: 11, nome: 'Ricardo Alves', cpf: '444.555.666-77', ultimaConsulta: '2025-11-18' },
    { id: 12, nome: 'Beatriz Costa', cpf: '777.888.999-00', ultimaConsulta: '2025-11-15' },
    { id: 13, nome: 'Lucas Martins', cpf: '123.456.789-10', ultimaConsulta: '2025-11-20' },
    { id: 14, nome: 'Ana Clara Dias', cpf: '123.123.123-11', ultimaConsulta: '2025-10-01' },
    { id: 15, nome: 'Bruno Gomes', cpf: '234.234.234-22', ultimaConsulta: '2025-10-05' },
    { id: 16, nome: 'Carla Azevedo', cpf: '345.345.345-33', ultimaConsulta: '2025-09-15' },
    { id: 17, nome: 'Daniel Farias', cpf: '456.456.456-44', ultimaConsulta: '2025-11-02' },
    { id: 18, nome: 'Eduarda Rocha', cpf: '567.567.567-55', ultimaConsulta: '2025-08-20' },
    { id: 19, nome: 'Felipe Nogueira', cpf: '678.678.678-66', ultimaConsulta: '2025-11-10' },
    { id: 20, nome: 'Gabriela Monteiro', cpf: '789.789.789-77', ultimaConsulta: '2025-07-30' },
    { id: 21, nome: 'Heitor Viana', cpf: '890.890.890-88', ultimaConsulta: '2025-10-22' },
    { id: 22, nome: 'Isabela Peixoto', cpf: '901.901.901-99', ultimaConsulta: '2025-09-05' },
    { id: 23, nome: 'Jorge Andrade', cpf: '012.012.012-10', ultimaConsulta: '2025-11-08' },
  ];

  filteredPatients: MockPatient[] = [];

  ngOnInit(): void {
    this.filteredPatients = this.allPatients;
  }

  filterPatients(): void {
    if (!this.searchTerm) {
      this.filteredPatients = this.allPatients;
      return;
    }

    const lowerCaseSearch = this.searchTerm.toLowerCase();
    this.filteredPatients = this.allPatients.filter(patient => 
      patient.nome.toLowerCase().includes(lowerCaseSearch) ||
      patient.cpf.replace(/[.-]/g, '').includes(lowerCaseSearch.replace(/[.-]/g, ''))
    );
  }
}
