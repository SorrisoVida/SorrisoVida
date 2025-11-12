import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Profissional } from '../features/appointments/schedule/models/profissional.model';

export interface Appointment {
  id: number;
  servico: string;
  profissionalId: number;
  profissionalNome: string;
  data: string;
  horario: string;
  pacienteId: number;
  pacienteNome: string;
  status: 'agendado' | 'confirmado' | 'cancelado' | 'realizado';
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  getProfessionals(): Observable<Profissional[]> {
    return this.http.get<Profissional[]>(`${this.apiUrl}/professionals`);
  }

  getAvailableTimes(profissionalId: number, data: string): Observable<string[]> {
    const params = new HttpParams()
      .set('profissionalId', profissionalId.toString())
      .set('data', data);
    return this.http.get<string[]>(`${this.apiUrl}/available-times`, { params });
  }

  createAppointment(appointmentData: Omit<Appointment, 'id' | 'status'>): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiUrl}/appointments`, appointmentData);
  }

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/appointments`);
  }

  getAppointmentsByPatient(patientId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/appointments/patient/${patientId}`);
  }
}