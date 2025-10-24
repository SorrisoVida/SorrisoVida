export interface Appointment {
    id: number;
    data: Date;
    horario: string;
    servico: string;
    profissional: string;
    paciente?: string; 
  }
  