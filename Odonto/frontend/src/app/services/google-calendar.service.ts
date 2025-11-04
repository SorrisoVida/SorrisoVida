import { Injectable } from '@angular/core';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

declare var gapi: any;

export interface CalendarEvent {
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class GoogleCalendarService {

  private readonly API_KEY = 'SUA_API_KEY_DO_GOOGLE_AQUI';
  private readonly CALENDAR_ID = 'primary'; 

  constructor(private authService: SocialAuthService, private http: HttpClient) {
    this.loadGapi();
  }

  private loadGapi(): void {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      gapi.load('client', () => {
        gapi.client.init({
          apiKey: this.API_KEY,
          discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        });
      });
    };
    document.body.appendChild(script);
  }

  getAppointments(): Observable<any> {
    return this.authService.authState.pipe(
      switchMap((user: SocialUser) => {
        if (!user) {
          return throwError(() => new Error('Usuário não autenticado.'));
        }

        const headers = new HttpHeaders({
          'Authorization': `Bearer ${user.authToken}`
        });

        const now = new Date().toISOString();
        const url = `https://www.googleapis.com/calendar/v3/calendars/${this.CALENDAR_ID}/events?timeMin=${now}&orderBy=startTime&singleEvents=true`;

        return this.http.get(url, { headers });
      })
    );
  }

  /**
   * Inicia o monitoramento de um calendário para receber notificações push.
   * @returns Um Observable com a resposta da API do Google.
   */
  watchCalendarEvents(): Observable<any> {
    return this.authService.authState.pipe(
      switchMap((user: SocialUser) => {
        if (!user) {
          return throwError(() => new Error('Usuário não autenticado para iniciar o watch.'));
        }

        const headers = new HttpHeaders({
          'Authorization': `Bearer ${user.authToken}`,
          'Content-Type': 'application/json'
        });

        const watchRequest = {
          id: `sorrisovida-channel-${new Date().getTime()}`, // ID único para o canal
          type: 'web_hook',
          address: 'https://SEU_DOMINIO_PUBLICO_AQUI/api/notifications' // <-- IMPORTANTE: URL pública do seu backend
        };

        const url = `https://www.googleapis.com/calendar/v3/calendars/${this.CALENDAR_ID}/events/watch`;

        console.log('Enviando solicitação para watch:', watchRequest);
        return this.http.post(url, watchRequest, { headers });
      })
    );
  }
}