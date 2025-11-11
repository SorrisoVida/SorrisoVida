import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocialAuthServiceConfig, GoogleLoginProvider, SocialLoginModule } from '@abacritt/angularx-social-login';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(
      HttpClientModule,
      BrowserAnimationsModule,
      BsDropdownModule.forRoot(),
      SocialLoginModule
    ),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '343772625583-nj5tc61uc40sv75nqvbjig6hdq2bgfdq.apps.googleusercontent.com',
              {
                scope: 'profile email https://www.googleapis.com/auth/calendar.events'
              }
            )
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ]
};
