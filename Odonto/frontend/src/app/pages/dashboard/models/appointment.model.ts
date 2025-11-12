export interface Appointment {
    id: number;
    data: Date;
    horario: string;
    paciente?: string;
    servico: string;
    profissional: string;
    status?: 'agendada' | 'confirmada' | 'cancelada' | 'realizada' | string; 
  }
  