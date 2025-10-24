import { TestBed } from '@angular/core/testing';
import { HttpClient, HTTP_INTERCEPTORS, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthInterceptor } from './auth-interceptor';
import { AuthService } from '../../services/auth.service';

describe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: spy },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve adicionar o cabeçalho de autorização quando o token existir', () => {
    const token = 'test-token';
    authServiceSpy.getToken.and.returnValue(token);

    httpClient.get('/api/test').subscribe();

    const httpRequest = httpMock.expectOne('/api/test');

    expect(httpRequest.request.headers.has('Authorization')).toBeTrue();
    expect(httpRequest.request.headers.get('Authorization')).toBe(`Bearer ${token}`);

    httpRequest.flush({}); // Finaliza a requisição
  });
});
