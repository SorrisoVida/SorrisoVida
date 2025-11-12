import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

import { passwordMatcherValidator } from '../components/password-matcher/password-matcher.validator';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/)]],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      passwordGroup: this.fb.group(
        {
          password: ['', [Validators.required, Validators.minLength(6)]],
          confirmPassword: ['', Validators.required],
        },
        { validators: passwordMatcherValidator }
      ),
      terms: [false, Validators.requiredTrue]
    });
  }

  // Getters para facilitar o acesso no template
  get fullName() { return this.registerForm.get('fullName'); }
  get cpf() { return this.registerForm.get('cpf'); }
  get phone() { return this.registerForm.get('phone'); }
  get email() { return this.registerForm.get('email'); }
  get passwordGroup() { return this.registerForm.get('passwordGroup'); }
  get password() { return this.registerForm.get('passwordGroup.password'); }
  get confirmPassword() { return this.registerForm.get('passwordGroup.confirmPassword'); }
  get terms() { return this.registerForm.get('terms'); }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const payload = {
        nome: this.registerForm.value.fullName,
        email: this.registerForm.value.email,
        password: this.registerForm.value.passwordGroup.password,
        cpf: this.registerForm.value.cpf,
        telefone: this.registerForm.value.phone
      };
      this.auth.register(payload).subscribe({
        next: () => {
          alert('Cadastro realizado com sucesso! Você foi autenticado.');
          this.router.navigate(['/auth/login']);
        },
        error: (err: any) => {
          console.error('Erro ao cadastrar', err);
          alert(err?.error?.message || 'Erro ao cadastrar');
        }
      });
    } else {
      console.log('Formulário inválido. Verifique os campos.');
      this.registerForm.markAllAsTouched();
    }
  }
}