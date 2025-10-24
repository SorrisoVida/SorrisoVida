import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../../services/auth.service';

import { ScheduleComponent } from './schedule.component';

describe('Schedule', () => {
  let component: ScheduleComponent;
  let fixture: ComponentFixture<ScheduleComponent>;
  let mockAuthService: Partial<AuthService>;

  beforeEach(async () => {
    // Mock para o AuthService
    mockAuthService = {
      getUser: () => null, // Comportamento padrão
    };

    await TestBed.configureTestingModule({
      imports: [ScheduleComponent, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
