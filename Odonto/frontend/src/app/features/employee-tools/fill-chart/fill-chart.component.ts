import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'app-fill-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fill-chart.component.html',
  styleUrls: ['./fill-chart.component.scss']
})
export class FillChartComponent {
  public navigationService = inject(NavigationService);
  private route = inject(ActivatedRoute);
  private location = inject(Location);

  // Mock de dados do prontuário a ser preenchido
  chart = {
    id: 1,
    patientName: 'Rafaela Santos',
    service: 'Limpeza',
    appointmentDate: '2025-11-12'
  };

  goBack(): void {
    this.location.back();
  }
}