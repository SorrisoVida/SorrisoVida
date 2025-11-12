import { Component, AfterViewInit, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavigationService } from '../../../services/navigation.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reports.component.html',
  // styleUrls: ['./reports.component.scss'] // Removido pois o arquivo está vazio
})
export class ReportsComponent implements AfterViewInit {
  public navigationService = inject(NavigationService);

  @ViewChild('revenueChart') revenueChart!: ElementRef<HTMLCanvasElement>;

  downloadReport(format: 'csv' | 'excel' | 'pdf'): void {
    // Em uma aplicação real, aqui seria a lógica para gerar e baixar o arquivo.
    console.log(`Simulando download do relatório em formato: ${format.toUpperCase()}`);
    alert(`Iniciando download do relatório em ${format.toUpperCase()}... (simulação)`);
  }

  ngAfterViewInit(): void {
    this.createRevenueChart();
  }

  createRevenueChart(): void {
    const context = this.revenueChart.nativeElement.getContext('2d');
    if (context) {
      new Chart(context, {
        type: 'bar',
        data: {
          labels: ['Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro'],
          datasets: [{
            label: 'Faturamento Mensal (R$)',
            data: [38500, 42300, 41200, 48700, 45100, 46500],
            backgroundColor: 'rgba(25, 135, 84, 0.6)',
            borderColor: 'rgba(25, 135, 84, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true, ticks: { callback: (value) => `R$ ${Number(value) / 1000}k` } }
          },
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: {                 label: (context) => {
                  const value = context.raw as number;
                  if (value === null || value === undefined) {
                    return '';
                  }
                  // Formatação manual para garantir compatibilidade
                  return `Faturamento: R$ ${value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
                }
              }
            }
          }
        }
      });
    }
  }
}