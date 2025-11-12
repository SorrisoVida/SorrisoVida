import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Mock da interface de um paciente na fila
export interface WaitingPatient { 
  id: number;
  nome: string;
  chegada: string; // Horário de chegada
  motivo: string;
}

@Injectable({
  providedIn: 'root'
})
export class WaitingRoomService {

  // Dados mockados para a sala de espera
  private mockWaitingPatients: WaitingPatient[] = [
    { id: 101, nome: 'Carlos Pereira', chegada: '14:05', motivo: 'Avaliação' },
    { id: 102, nome: 'Mariana Costa', chegada: '14:20', motivo: 'Limpeza' },
    { id: 103, nome: 'João Silva', chegada: '14:30', motivo: 'Consulta de Rotina' },
  ];

  constructor() { }

  /**
   * Retorna um Observable com a lista de pacientes na sala de espera.
   */
  getWaitingPatients(): Observable<WaitingPatient[]> {
    return of(this.mockWaitingPatients);
  }
}