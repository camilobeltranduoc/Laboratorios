import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { PasswordValidators } from '../../../validators/password.validator';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      rut: ['', [Validators.required, Validators.pattern(/^\d{7,8}-[\dkK]$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        PasswordValidators.minLength(8),
        PasswordValidators.maxLength(20),
        PasswordValidators.hasSpecialChar(),
        PasswordValidators.hasNumber()
      ]],
      telefono: ['', [Validators.required, Validators.pattern(/^\+?56\d{9}$/)]],
      direccion: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      rol: ['PACIENTE', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: (success) => {
          if (success) {
            this.successMessage = 'Registro exitoso. Redirigiendo al login...';
            this.errorMessage = '';
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          } else {
            this.errorMessage = 'El email o RUT ya están registrados';
            this.successMessage = '';
          }
        },
        error: () => {
          this.errorMessage = 'Error al intentar registrar usuario';
          this.successMessage = '';
        }
      });
    }
  }

  get nombre() { return this.registerForm.get('nombre'); }
  get apellido() { return this.registerForm.get('apellido'); }
  get rut() { return this.registerForm.get('rut'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get telefono() { return this.registerForm.get('telefono'); }
  get direccion() { return this.registerForm.get('direccion'); }
  get fechaNacimiento() { return this.registerForm.get('fechaNacimiento'); }
}
