import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { PasswordValidators } from '../../../validators/password.validator';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  forgotForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [
        Validators.required,
        PasswordValidators.minLength(8),
        PasswordValidators.maxLength(20),
        PasswordValidators.hasSpecialChar(),
        PasswordValidators.hasNumber()
      ]]
    });
  }

  onSubmit(): void {
    if (this.forgotForm.valid) {
      const { email, newPassword } = this.forgotForm.value;

      this.authService.resetPassword(email, newPassword).subscribe({
        next: (success) => {
          if (success) {
            this.successMessage = 'Contraseña actualizada. Redirigiendo al login...';
            this.errorMessage = '';
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          } else {
            this.errorMessage = 'Email no encontrado';
            this.successMessage = '';
          }
        },
        error: () => {
          this.errorMessage = 'Error al intentar restablecer contraseña';
          this.successMessage = '';
        }
      });
    }
  }

  get email() {
    return this.forgotForm.get('email');
  }

  get newPassword() {
    return this.forgotForm.get('newPassword');
  }
}
