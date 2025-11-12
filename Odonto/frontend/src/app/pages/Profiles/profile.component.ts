import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service'; // Mantido para obter o usuário
import { NavigationService } from '../../services/navigation.service';

// Define um tipo para os dados do formulário
type ProfileFormType = {
  nome: string | null;
  email: string | null;
  telefone: string | null;
  especialidade: string | null;
  senhaAtual: string | null;
  novaSenha: string | null;
  confirmarNovaSenha: string | null;
};

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  profileForm!: FormGroup;
  isEditing = false;
  showSuccessToast = false;
  toastMessage: string | null = null;
  private initialFormValue!: ProfileFormType; // Tipagem forte para o valor inicial do formulário

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    public navigationService: NavigationService 
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    this.buildForm();
    this.setupPasswordControlsLogic();
    // Armazena o estado inicial do formulário (incluindo campos desabilitados)
    this.initialFormValue = this.profileForm.getRawValue();
  }

  private buildForm(): void {
    this.profileForm = this.fb.group({
      nome: [{ value: this.currentUser?.nome, disabled: true }, Validators.required],
      email: [{ value: this.currentUser?.email, disabled: true }, [Validators.required, Validators.email]],
      // Campos específicos de perfil (exemplos)
      telefone: [{ value: '(11) 98765-4321', disabled: true }],
      especialidade: [{ value: this.isDentista ? 'Ortodontia' : '', disabled: true }],
      // Novos campos para a seção de segurança
      senhaAtual: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(6)]],
      novaSenha: [{ value: '', disabled: true }, [Validators.minLength(6)]],
      confirmarNovaSenha: [{ value: '', disabled: true }, [Validators.minLength(6)]],
    }, { validators: this.passwordMatchValidator() });
  }

  /**
   * Habilita/desabilita os campos de nova senha com base na validade da senha atual.
   */
  private setupPasswordControlsLogic(): void {
    const senhaAtualControl = this.profileForm.get('senhaAtual');
    const novaSenhaControl = this.profileForm.get('novaSenha');
    const confirmarNovaSenhaControl = this.profileForm.get('confirmarNovaSenha');

    // Lógica para habilitar/desabilitar campos de nova senha
    senhaAtualControl?.statusChanges.subscribe(status => {
      if (status === 'VALID') {
        novaSenhaControl?.enable();
        confirmarNovaSenhaControl?.enable();
      } else {
        novaSenhaControl?.disable();
        confirmarNovaSenhaControl?.disable();
      }
    });

    // Lógica para tornar a confirmação obrigatória
    novaSenhaControl?.valueChanges.subscribe(value => {
      const isRequired = !!value; // Se novaSenha tem valor, a confirmação é obrigatória
      confirmarNovaSenhaControl?.setValidators(isRequired ? [Validators.required, Validators.minLength(6)] : [Validators.minLength(6)]);
      confirmarNovaSenhaControl?.updateValueAndValidity({ emitEvent: false });
    });
  }

  // Validador customizado para verificar se as senhas coincidem
  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const novaSenha = control.get('novaSenha');
      const confirmarNovaSenha = control.get('confirmarNovaSenha');

      // Se os campos não existem ou não estão habilitados, não faz nada
      if (!novaSenha || !confirmarNovaSenha || novaSenha.disabled || confirmarNovaSenha.disabled) {
        return null;
      }

      // Se a nova senha foi preenchida, mas a confirmação não, ou se são diferentes
      if (novaSenha.value && novaSenha.value !== confirmarNovaSenha.value) {
        return { mismatch: true };
      }

      return null; // Retorna null se as senhas coincidirem ou se ambos estiverem vazios
    };
  };

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.profileForm.enable();
      // Manter o email desabilitado para não permitir alteração
      this.profileForm.get('email')?.disable();
      // Garante que os campos de nova senha comecem desabilitados
      this.profileForm.get('novaSenha')?.disable();
      this.profileForm.get('confirmarNovaSenha')?.disable();

    } else {
      this.profileForm.disable();
      // Se cancelar, reverte para os valores originais
      this.profileForm.reset(this.initialFormValue);
    }
  }

  onSubmit(): void {
    // Marca todos os campos como "tocados" para exibir os erros de validação
    this.profileForm.markAllAsTouched();

    if (this.profileForm.valid) { 
      const currentValue = this.profileForm.getRawValue();

      // Compara o valor atual com o valor inicial para ver se houve mudanças
      if (JSON.stringify(this.initialFormValue) === JSON.stringify(currentValue)) {
        // Nenhuma alteração foi feita, apenas desabilita o modo de edição
        this.isEditing = false;
        this.profileForm.disable();
        return;
      }

      console.log('Dados do perfil salvos:', this.profileForm.value);
      // Aqui você chamaria um serviço para salvar os dados na API
      // Ex: this.userService.updateProfile(this.currentUser.id, this.profileForm.value).subscribe(...)
      this.isEditing = false;
      this.profileForm.disable();

      // Exibe a mensagem de sucesso e a esconde após 3 segundos
      this.toastMessage = 'Perfil atualizado com sucesso!';
      this.showSuccessToast = true;
      setTimeout(() => this.showSuccessToast = false, 3500);
    }
  }

  /**
   * Verifica se houve alguma alteração real nos dados do formulário.
   * @returns `true` se os dados foram modificados, `false` caso contrário.
   */
  get hasChanges(): boolean {
    return JSON.stringify(this.initialFormValue) !== JSON.stringify(this.profileForm.getRawValue());
  }

  get isDentista(): boolean {
    return this.currentUser?.role === 'dentista';
  }

  get isAtendente(): boolean {
    return this.currentUser?.role === 'atendente';
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  get isEmployee(): boolean {
    return this.isDentista || this.isAtendente;
  }

  // Getter para verificar se o usuário é paciente
  get isPatient(): boolean { return this.currentUser?.role === 'paciente'; }
}