import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NavigationService } from '../../../services/navigation.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public navigationService: NavigationService 
  ) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get email() {
    return this.forgotPasswordForm.get('email');
  }

  onForgotPassword(): void {
    this.successMessage = null;
    this.errorMessage = null;

    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      const emailValue = this.email?.value;

      this.authService.forgotPassword(emailValue).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.';
          this.forgotPasswordForm.reset();
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Ocorreu um erro ao tentar enviar o e-mail. Tente novamente mais tarde.';
        }
      });
    } else {
      this.forgotPasswordForm.markAllAsTouched();
    }
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
