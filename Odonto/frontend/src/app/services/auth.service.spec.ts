// import { TestBed } from '@angular/core/testing';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { AuthService } from './auth.service';

// describe('AuthService', () => {
//   let service: AuthService;
//   let httpMock: HttpTestingController;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//       providers: [AuthService]
//     });
//     service = TestBed.inject(AuthService);
//     httpMock = TestBed.inject(HttpTestingController);
//   });

//   afterEach(() => {
//     localStorage.clear();
//     httpMock.verify();
//   });

//   it('deve ser criado', () => {
//     expect(service).toBeTruthy();
//   });

//   it('deve fazer login e salvar usuário no localStorage', () => {
//     const mockUser = { id: 1, name: 'Vitória', email: 'vitoria@test.com' };

//     service.login('vitoria@test.com', '123456').subscribe(user => {
//       expect(user).toEqual(mockUser);
//       expect(localStorage.getItem('user')).toContain('Vitória');
//     });

//     const req = httpMock.expectOne('http://localhost:8080/api/auth/login');
//     expect(req.request.method).toBe('POST');
//     req.flush(mockUser);
//   });

//   it('deve registrar usuário corretamente', () => {
//     const newUser = { name: 'Vitória', email: 'vitoria@test.com', password: '123456' };

//     service.register(newUser.name, newUser.email, newUser.password).subscribe(response => {
//       expect(response).toBeTruthy();
//     });

//     const req = httpMock.expectOne('http://localhost:8080/api/auth/register');
//     expect(req.request.method).toBe('POST');
//     req.flush({ success: true });
//   });

//   it('deve retornar true se o usuário estiver autenticado', () => {
//     localStorage.setItem('user', JSON.stringify({ name: 'Vitória' }));
//     expect(service.isAuthenticated()).toBeTrue();
//   });

//   it('deve limpar o localStorage ao fazer logout', () => {
//     localStorage.setItem('user', JSON.stringify({ name: 'Vitória' }));
//     service.logout();
//     expect(localStorage.getItem('user')).toBeNull();
//   });
// });
