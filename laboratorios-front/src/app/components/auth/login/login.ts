import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (success) => {
          if (success) {
            const user = this.authService.getCurrentUser();
            if (user?.rol === 'ADMINISTRADOR') {
              this.router.navigate(['/dashboard/admin']);
            } else if (user?.rol === 'MEDICO') {
              this.router.navigate(['/dashboard/medico']);
            } else {
              this.router.navigate(['/dashboard']);
            }
          } else {
            this.errorMessage = 'Email o contraseña incorrectos';
          }
        },
        error: () => {
          this.errorMessage = 'Error al intentar iniciar sesión';
        }
      });
    }
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
