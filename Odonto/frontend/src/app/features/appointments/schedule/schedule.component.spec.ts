import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../../services/auth.service';

import { NavigationService } from '../../../services/navigation.service';
import { ScheduleComponent } from './schedule.component';

describe('Schedule', () => {
  let component: ScheduleComponent;
  let fixture: ComponentFixture<ScheduleComponent>;
  let mockNavigationService: Partial<NavigationService>;
  let mockAuthService: Partial<AuthService>;

  beforeEach(async () => {
  
    mockAuthService = {
      getUser: () => null, // Comportamento padrão
    };

    // Mock para o NavigationService
    mockNavigationService = {
      navigateBackToDashboard: jasmine.createSpy('navigateBackToDashboard'),
    };

    await TestBed.configureTestingModule({
      imports: [ScheduleComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: NavigationService, useValue: mockNavigationService },
      ],
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
