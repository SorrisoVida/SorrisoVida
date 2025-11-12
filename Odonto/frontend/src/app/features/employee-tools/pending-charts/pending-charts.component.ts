import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavigationService } from '../../../services/navigation.service';

interface PendingChart {
  id: number;
  patientName: string;
  service: string;
  appointmentDate: string;
}

@Component({
  selector: 'app-pending-charts',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pending-charts.component.html',
  styleUrls: ['./pending-charts.component.scss']
})
export class PendingChartsComponent {
  public navigationService = inject(NavigationService);

  pendingCharts: PendingChart[] = [
    { id: 1, patientName: 'Rafaela Santos', service: 'Limpeza', appointmentDate: '2025-11-12' },
    { id: 2, patientName: 'Pietro Cardoso', service: 'Avaliação', appointmentDate: '2025-11-12' },
    { id: 4, patientName: 'Márcio Garcia', service: 'Restauração', appointmentDate: '2025-10-25' },
  ];
}