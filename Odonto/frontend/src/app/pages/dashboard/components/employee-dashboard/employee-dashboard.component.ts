import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService, User } from '../../../../services/auth.service';
import { WaitingRoomService } from '../../../../services/waiting-room.service';
import { Appointment, AppointmentService } from '../../../../services/appointment.service';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss']
})
export class EmployeeDashboard implements OnInit, OnDestroy {
  currentUser: User | null = null;
  agendaDoDia: Appointment[] = [];
  isLoadingAgenda = true;
  errorAgenda: string | null = null;

  // Flags de permissão
  isDentista = false;
  isAtendente = false;
  isAdmin = false;
  isPatient = false;
  isAuthenticated = false;

  // Contadores / widgets
  pacientesEmEspera = 0;
  aprovacoesPendentes = 0; // Mock
  relatoriosPendentes = 0; // Mock

  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private appointmentService = inject(AppointmentService);
  private waitingRoomService = inject(WaitingRoomService);
  private router = inject(Router);
  private subs: Subscription[] = [];

  ngOnInit(): void {
    
    // Subscribes
    this.subs.push(
      this.authService.currentUser.subscribe(user => {
        this.currentUser = user;
        this.isAuthenticated = !!user;
        this.isDentista = !!user && user.role === 'dentista';
        this.isAtendente = !!user && user.role === 'atendente';
        this.isAdmin = !!user && user.role === 'admin';
        this.isPatient = !!user && user.role === 'paciente';
        if (user) {
          this.loadAgendaDoDia();
          this.loadDashboardCounts();
        }
      })
    );
  }

  private loadAgendaDoDia(): void {
    this.isLoadingAgenda = true;
    this.errorAgenda = null;

    // Mock: Filtra agendamentos para o profissional logado (se for dentista)
    // ou mostra todos se for atendente.
    this.appointmentService.getAppointments().subscribe({
      next: (appointments: Appointment[]) => {
        const todayDate = new Date();
        const year = todayDate.getFullYear();
        const month = (todayDate.getMonth() + 1).toString().padStart(2, '0');
        const day = todayDate.getDate().toString().padStart(2, '0');
        const today = `${year}-${month}-${day}`; // Formato YYYY-MM-DD local

        this.agendaDoDia = appointments.filter(ap => {
          const isToday = ap.data === today;
          if (this.isDentista) {
            return isToday && ap.profissionalId === this.currentUser?.id;
          }
          return isToday; // Atendente vê todos do dia
        }).sort((a, b) => a.horario.localeCompare(b.horario));

        this.isLoadingAgenda = false;
      },
      error: (err: any) => {
        console.error('Erro ao carregar agenda', err);
        this.errorAgenda = 'Erro ao carregar agenda. Tente novamente mais tarde.';
        this.isLoadingAgenda = false;
      }
    });
  }

  private loadDashboardCounts(): void {
    this.waitingRoomService.getWaitingPatients().subscribe(patients => {
      this.pacientesEmEspera = patients.length;
    });
  }

  goToFullCalendar(): void {
    this.router.navigate(['/employee/full-calendar']);
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }
}
