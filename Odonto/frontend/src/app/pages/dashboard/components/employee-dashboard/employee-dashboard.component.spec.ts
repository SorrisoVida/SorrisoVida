import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EmployeeDashboard } from './employee-dashboard.component';
import { AuthService, User } from '../../../../services/auth.service'; 

// Mock do AuthService
const mockAuthService = {
  // Usamos um método que pode ser espionado (spyOn) para controlar o retorno
  getUser: () => null as User | null,
};

describe('EmployeeDashboard', () => {
  let component: EmployeeDashboard;
  let fixture: ComponentFixture<EmployeeDashboard>;
  let compiled: HTMLElement;

  // Configuração inicial do TestBed
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeDashboard, RouterTestingModule],
      providers: [
        // Dizemos ao Angular para usar nosso mock no lugar do AuthService real
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents(); 

    // Criamos o spy uma única vez aqui
    spyOn(mockAuthService, 'getUser').and.returnValue(null); // Valor padrão

    fixture = TestBed.createComponent(EmployeeDashboard);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
  });

  it('should create', () => {
    fixture.detectChanges(); // Executa o ngOnInit
    expect(component).toBeTruthy();
  });

  describe('quando o usuário é Dentista', () => {
    beforeEach(async () => {
      const dentistaUser: User = { id: 2, nome: 'Dentista Teste', email: 'd@d.com', role: 'dentista' };
      // Apenas configuramos o valor de retorno do spy, sem recriá-lo
      (mockAuthService.getUser as jasmine.Spy).and.returnValue(dentistaUser);
      fixture.detectChanges(); // Executa o ngOnInit com o usuário dentista
    });

    it('deve mostrar o widget de Agenda do Dia', () => {
      expect(compiled.querySelector('h5:has(i.bi-calendar-day)')?.textContent).toContain('Agenda do Dia');
    });

    it('não deve mostrar o widget de Sala de Espera', () => {
      // Apenas atendentes veem a sala de espera
      expect(compiled.querySelector('h5:i.bi-people-fill')).toBeFalsy();
    });
  });

  describe('quando o usuário é Atendente', () => {
    beforeEach(async () => {
      const atendenteUser: User = { id: 3, nome: 'Atendente Teste', email: 'at@at.com', role: 'atendente' };
      // Apenas configuramos o valor de retorno do spy
      (mockAuthService.getUser as jasmine.Spy).and.returnValue(atendenteUser);
      fixture.detectChanges(); // Executa o ngOnInit com o usuário atendente
    });

    it('deve mostrar os widgets de Sala de Espera e Agenda do Dia', () => {
      expect(compiled.querySelector('h5:has(i.bi-people-fill)')?.textContent).toContain('Sala de Espera');
      expect(compiled.querySelector('h5:has(i.bi-calendar-day)')?.textContent).toContain('Agenda do Dia');
    });

    it('não deve mostrar widgets específicos de outros perfis (ex: admin)', () => {
      // Verifica se um widget de admin (Faturamento) não está presente
      expect(compiled.querySelector('h5:has(i.bi-cash-coin)')).toBeFalsy();
    });
  });
});
