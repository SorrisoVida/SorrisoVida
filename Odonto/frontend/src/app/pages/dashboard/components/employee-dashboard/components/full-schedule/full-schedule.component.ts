import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { GoogleCalendarService, CalendarEvent } from '../../../../../../services/google-calendar.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-full-schedule',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './full-schedule.component.html',
  styleUrls: ['./full-schedule.component.scss']
})
export class FullScheduleComponent implements OnInit {
  loggedIn = false;
  user: SocialUser | null = null;
  appointments: CalendarEvent[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private socialAuthService: SocialAuthService,
    private calendarService: GoogleCalendarService
  ) {}

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      if (this.loggedIn) {
        this.fetchAppointments();
      }
    });
  }

  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.socialAuthService.signOut();
  }

  fetchAppointments(): void {
    if (!this.loggedIn) {
      this.error = 'Você precisa estar conectado com o Google para ver a agenda.';
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.appointments = [];

    this.calendarService.getAppointments().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response) => {
        this.appointments = response.items;
      },
      error: (err) => {
        console.error('Erro ao buscar agendamentos:', err);
        this.error = 'Falha ao buscar agendamentos. Verifique sua conexão e permissões no Google Calendar.';
      }
    });
  }
}