import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface PatientSearchResult {
  id: number;
  name: string;
  cpf: string;
  phone: string;
}

@Component({
  selector: 'app-search-patients',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './search-patients.component.html',
  styleUrl: './search-patients.component.scss'
})
export class SearchPatientsComponent {
  results: PatientSearchResult[] = [];
  isLoading = false;
  searchPerformed = false;
  lastSearchTerm = '';

  constructor() {}

  search(term: string): void {
    if (!term) return;

    this.isLoading = true;
    this.searchPerformed = true;
    this.lastSearchTerm = term;
    this.results = [];

    console.log(`Buscando por: ${term}`);

    // TODO: Substituir por chamada de API real
    setTimeout(() => {
      // Simula uma resposta da API
      this.results = [
        { id: 1, name: 'João da Silva Encontrado', cpf: '123.456.789-00', phone: '(11) 98765-4321' }
      ];
      this.isLoading = false;
    }, 1500);
  }
}