import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface QueuePatient {
  id: number;
  name: string;
  arrivalTime: Date;
}

@Component({
  selector: 'app-manage-queue',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './manage-queue.component.html',
  styleUrl: './manage-queue.component.scss'
})
export class ManageQueueComponent implements OnInit {
  queue: QueuePatient[] = [];
  isLoading = true;

  constructor() { }

  ngOnInit(): void {
    // TODO: Substituir por chamada de API real (WebSocket ou polling)
    setTimeout(() => {
      this.queue = [
        { id: 1, name: 'João da Silva', arrivalTime: new Date('2024-08-15T09:02:00') },
        { id: 2, name: 'Maria Oliveira', arrivalTime: new Date('2024-08-15T09:05:00') },
        { id: 3, name: 'Pedro Martins', arrivalTime: new Date('2024-08-15T09:11:00') },
      ];
      this.isLoading = false;
    }, 1000);
  }

  callNext(): void {
    const nextPatient = this.queue.shift();
    console.log(`Chamando paciente: ${nextPatient?.name}`);
    // TODO: Implementar lógica de API para chamar o próximo e atualizar a UI
  }
}