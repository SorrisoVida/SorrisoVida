import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Observable, of, switchMap } from 'rxjs';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { io, Socket } from 'socket.io-client';

declare var gapi: any;

// exporte um tipo reutilizável para eventos do Calendar
export interface CalendarEvent {
  id: string;
  summary?: string;
  description?: string;
  start: { dateTime?: string; date?: string, timeZone?: string };
  end?: { dateTime?: string; date?: string, timeZone?: string };
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class GoogleCalendarService {
  private readonly API_KEY = 'AIzaSyB7eSFjW45FBbUaDS7e8bVp-tMDnSfDl5g';
  private readonly CALENDAR_ID = 'primary';
  private socket?: Socket;
  private calendarUpdateSubject = new Subject<void>();
  public calendarUpdates$ = this.calendarUpdateSubject.asObservable();

  private http = inject(HttpClient);
  private authService: SocialAuthService | null = null; // Lazy inject

  constructor() {
    // Não injetar SocialAuthService aqui
    this.ensureSocketConnected();
  }

  private ensureAuthService(): SocialAuthService {
    if (!this.authService) {
      this.authService = inject(SocialAuthService);
    }
    return this.authService;
  }

  private ensureSocketConnected(): void {
    if (!this.socket) {
      this.socket = io('http://localhost:3000');
      this.socket.on('connect', () => console.log('socket connected'));
      this.socket.on('disconnect', () => console.log('socket disconnected'));
      // registrar o listener de atualizações
      this.socket.on('calendar-update', (data: any) => {
        console.log('socket calendar-update received', data);
        this.calendarUpdateSubject.next();
      });
    }
  }

  // Retorna um Observable com items tipados
  getAppointments(): Observable<{ items: CalendarEvent[] }> {
    const authService = this.ensureAuthService();
    return authService.authState.pipe(
      switchMap((user: SocialUser | null) => {
        if (!user) {
          return of({ items: [] });
        }
        // garante socket (opcional) — não imprescindível para get, mas mantêm pipeline reativa
        this.ensureSocketConnected();
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${user.authToken}`
        });
        const now = new Date().toISOString();
        const url = `https://www.googleapis.com/calendar/v3/calendars/${this.CALENDAR_ID}/events?timeMin=${now}&orderBy=startTime&singleEvents=true`;
        return this.http.get<{ items: CalendarEvent[] }>(url, { headers });
      })
    );
  }

  // Adiciona um novo evento ao calendário
  createAppointment(eventData: { summary: string; description: string; start: Date; end: Date }): Observable<CalendarEvent | null> {
    const authService = this.ensureAuthService();
    return authService.authState.pipe(
      switchMap((user: SocialUser | null) => {
        if (!user) { 
          return of(null);
        }

        const headers = new HttpHeaders({
          'Authorization': `Bearer ${user.authToken}`,
          'Content-Type': 'application/json'
        });

        const event: Partial<CalendarEvent> = {
          summary: eventData.summary,
          description: eventData.description,
          start: { dateTime: eventData.start.toISOString(), timeZone: 'America/Sao_Paulo' },
          end: { dateTime: eventData.end.toISOString(), timeZone: 'America/Sao_Paulo' }
        };

        const url = `https://www.googleapis.com/calendar/v3/calendars/${this.CALENDAR_ID}/events`;
        return this.http.post<CalendarEvent>(url, event, { headers });
      })
    );
  }

  watchCalendarEvents(): Observable<any> {
    const authService = this.ensureAuthService();
    return authService.authState.pipe(
      switchMap((user: SocialUser | null) => {
        if (!user) return of(null);
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${user.authToken}`,
          'Content-Type': 'application/json'
        });
        const watchRequest = {
          id: `sorrisovida-channel-${new Date().getTime()}`,
          type: 'web_hook',
          address: 'http://localhost:3000/api/notifications'
        };
        const url = `https://www.googleapis.com/calendar/v3/calendars/${this.CALENDAR_ID}/events/watch`;
        return this.http.post(url, watchRequest, { headers });
      })
    );
  }

  private loadGapi(): void {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      gapi.load('client:auth2', () => {
        gapi.client.init({
          apiKey: this.API_KEY,
          discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        });
      });
    };
    document.body.appendChild(script);
  }
}