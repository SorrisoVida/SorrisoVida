import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SocialUser, SocialAuthService, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { GoogleCalendarService, CalendarEvent } from '../../../../services/google-calendar.service';
import { AuthService, User } from '../../../../services/auth.service';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss']
})
export class EmployeeDashboard implements OnInit, OnDestroy {
  currentUser: User | null = null;
  googleUser: SocialUser | null = null;
  agendaDoDia: { horario: string; paciente: string; servico: string }[] = [];
  isLoadingAgenda = false;
  errorAgenda: string | null = null;

  // Contadores / widgets
  pacientesEmEspera = 0;
  aprovacoesPendentes = 0;
  relatoriosPendentes = 0;

  // Flags de permissão
  isDentista = false;
  isAtendente = false;
  isAdmin = false;
  isPatient = false;
  isAuthenticated = false;

  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private googleCalendarService = inject(GoogleCalendarService);
  private router = inject(Router);
  private subs: Subscription[] = [];
  private socialAuthService: SocialAuthService | null = null; // lazy inject

  ngOnInit(): void {
    // lazy inject do SocialAuthService — evita erros se provider ainda não estiver registrado
    try {
      this.socialAuthService = inject(SocialAuthService);
    } catch {
      this.socialAuthService = null;
    }

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
          this.loadDashboardCounts();
        }
      })
    );

    // Social auth state (apenas se o serviço estiver disponível)
    if (this.canUseSocialAuth()) {
      const sa = this.socialAuthService!;
      this.subs.push(
        sa.authState.subscribe((u: SocialUser | null) => {
          this.googleUser = u;
          if (u) this.loadAgendaDoDia();
          else this.agendaDoDia = [];
        })
      );
    }

    // Atualização por socket/calendar updates
    this.subs.push(
      this.googleCalendarService.calendarUpdates$.subscribe(() => {
        if (this.googleUser) this.loadAgendaDoDia();
      })
    );
  }

  private canUseSocialAuth(): boolean {
    return !!this.socialAuthService && typeof (this.socialAuthService as any).authState?.subscribe === 'function';
  }

  signInWithGoogle(): void {
    if (this.canUseSocialAuth()) {
      const calendarScope = 'https://www.googleapis.com/auth/calendar.events';
      this.socialAuthService!.signIn(GoogleLoginProvider.PROVIDER_ID, { scope: calendarScope });
    } else {
      console.warn('SocialAuthService não disponível no momento.');
      this.errorAgenda = 'Serviço de autenticação do Google indisponível.';
    }
  }

  signOutGoogle(): void {
    if (this.canUseSocialAuth()) {
      const sa = this.socialAuthService!;
      sa.signOut();
    }
    this.googleUser = null;
    this.agendaDoDia = [];
  }

  private loadAgendaDoDia(): void {
    if (!this.googleUser) return;
    this.isLoadingAgenda = true;
    this.errorAgenda = null;
    this.googleCalendarService.getAppointments().subscribe({
      next: (res: { items: CalendarEvent[] }) => {
        const items = res.items || [];
        this.agendaDoDia = items.map(ev => {
          const start = new Date(ev.start?.dateTime || ev.start?.date || '');
          return {
            horario: start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            paciente: ev.summary || 'Sem título',
            servico: ev.description || 'Não especificado'
          };
        });
        this.isLoadingAgenda = false;
      },
      error: err => {
        console.error('Erro ao carregar agenda', err);
        this.errorAgenda = 'Erro ao carregar agenda. Verifique permissões do Google.';
        this.isLoadingAgenda = false;
      }
    });
  }

  private loadDashboardCounts(): void {
    this.http.get<{ waiting: number }>('/api/clinic/waiting-count').subscribe({
      next: r => this.pacientesEmEspera = r.waiting,
      error: () => this.pacientesEmEspera = 0
    });

    this.http.get<{ approvals: number }>('/api/clinic/approvals-count').subscribe({
      next: r => this.aprovacoesPendentes = r.approvals,
      error: () => this.aprovacoesPendentes = 0
    });

    this.http.get<{ reports: number }>('/api/clinic/reports-count').subscribe({
      next: r => this.relatoriosPendentes = r.reports,
      error: () => this.relatoriosPendentes = 0
    });
  }

  goToFullCalendar(): void {
    this.router.navigate(['/employee/full-calendar']);
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }
}
