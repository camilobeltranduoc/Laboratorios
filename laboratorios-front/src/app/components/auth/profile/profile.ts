import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  profileForm: FormGroup;
  currentUser: User | null = null;
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      direccion: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.profileForm.patchValue({
        nombre: this.currentUser.nombre,
        apellido: this.currentUser.apellido,
        telefono: this.currentUser.telefono,
        direccion: this.currentUser.direccion
      });
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.currentUser) {
      const updatedUser: User = {
        ...this.currentUser,
        ...this.profileForm.value
      };

      this.authService.updateProfile(updatedUser).subscribe({
        next: (success) => {
          if (success) {
            this.successMessage = 'Perfil actualizado correctamente';
            setTimeout(() => this.successMessage = '', 3000);
          }
        },
        error: () => {
          console.error('Error al actualizar perfil');
        }
      });
    }
  }
}
