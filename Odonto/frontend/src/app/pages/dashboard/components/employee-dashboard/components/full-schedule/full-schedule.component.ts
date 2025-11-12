import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SocialAuthService, SocialUser, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { GoogleCalendarService, CalendarEvent } from '../../../../../../services/google-calendar.service';

@Component({
  selector: 'app-full-schedule',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './full-schedule.component.html',
  styleUrls: ['./full-schedule.component.scss']
})
export class FullScheduleComponent implements OnInit, OnDestroy {
  loggedIn = false;
  user: SocialUser | null = null;
  appointments: CalendarEvent[] = [];
  isLoading = false;
  error: string | null = null;
  private subs: Subscription[] = [];

  private socialAuthService = inject(SocialAuthService);
  private googleCalendarService = inject(GoogleCalendarService);

  ngOnInit(): void {
    // Monitorar login status
    this.subs.push(
      this.socialAuthService.authState.subscribe(user => {
        this.user = user || null;
        this.loggedIn = !!user;
        if (user) {
          this.fetchAppointments();
        }
      })
    );

    // Recarregar quando calendar atualizar
    this.subs.push(
      this.googleCalendarService.calendarUpdates$.subscribe(() => {
        if (this.loggedIn) {
          this.fetchAppointments();
        }
      })
    );
  }

  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.socialAuthService.signOut();
    this.appointments = [];
    this.loggedIn = false;
  }

  fetchAppointments(): void {
    if (!this.loggedIn) {
      this.error = 'Você precisa estar conectado.';
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.appointments = [];

    this.googleCalendarService.getAppointments().subscribe({
      next: (response: { items: CalendarEvent[] }) => {
        this.appointments = response.items || [];
        console.log('Agendamentos carregados:', this.appointments);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar agendamentos:', err);
        this.error = 'Erro ao buscar agendamentos. Verifique suas permissões no Google Calendar.';
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }
}