import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { PasswordValidators } from '../../../validators/password.validator';

@Component({
  selector: 'app-users',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  currentUser: User | null = null;
  userForm: FormGroup;
  showModal: boolean = false;
  editingUser: User | null = null;
  searchTerm: string = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.userForm = this.fb.group({
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

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users;
      },
      error: (err) => console.error('Error al cargar usuarios:', err)
    });
  }

  onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchTerm = term;
    this.filteredUsers = this.users.filter(user =>
      user.nombre.toLowerCase().includes(term) ||
      user.apellido.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.rut.toLowerCase().includes(term)
    );
  }

  openCreateModal(): void {
    this.editingUser = null;
    this.userForm.reset({ rol: 'PACIENTE' });
    this.showModal = true;
  }

  openEditModal(user: User): void {
    this.editingUser = user;
    this.userForm.patchValue(user);
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingUser = null;
    this.userForm.reset({ rol: 'PACIENTE' });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData: User = this.userForm.value;

      if (this.editingUser) {
        userData.id = this.editingUser.id;
        this.userService.update(userData.id, userData).subscribe({
          next: () => {
            this.loadUsers();
            this.closeModal();
          },
          error: (err) => console.error('Error al actualizar usuario:', err)
        });
      } else {
        this.userService.create(userData).subscribe({
          next: () => {
            this.loadUsers();
            this.closeModal();
          },
          error: (err) => console.error('Error al crear usuario:', err)
        });
      }
    }
  }

  deleteUser(id: number): void {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      this.userService.delete(id).subscribe({
        next: () => this.loadUsers(),
        error: (err) => console.error('Error al eliminar usuario:', err)
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  get nombre() { return this.userForm.get('nombre'); }
  get apellido() { return this.userForm.get('apellido'); }
  get rut() { return this.userForm.get('rut'); }
  get email() { return this.userForm.get('email'); }
  get password() { return this.userForm.get('password'); }
  get telefono() { return this.userForm.get('telefono'); }
  get direccion() { return this.userForm.get('direccion'); }
  get fechaNacimiento() { return this.userForm.get('fechaNacimiento'); }
  get rol() { return this.userForm.get('rol'); }
}
