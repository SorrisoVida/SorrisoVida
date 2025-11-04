import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {

  downloadReport(format: 'csv' | 'excel' | 'pdf'): void {
    // Em uma aplicação real, aqui seria a lógica para gerar e baixar o arquivo.
    console.log(`Simulando download do relatório em formato: ${format.toUpperCase()}`);
    alert(`Iniciando download do relatório em ${format.toUpperCase()}... (simulação)`);
  }
}