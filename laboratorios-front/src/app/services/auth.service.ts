import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;

  private users: User[] = [
    {
      id: 1,
      nombre: 'Admin',
      apellido: 'Sistema',
      rut: '11111111-1',
      email: 'admin@laboratorios.cl',
      password: 'Admin123!',
      telefono: '+56912345678',
      direccion: 'Santiago Centro',
      fechaNacimiento: '1990-01-01',
      rol: 'ADMINISTRADOR'
    },
    {
      id: 2,
      nombre: 'Dr. Juan',
      apellido: 'Pérez',
      rut: '22222222-2',
      email: 'medico@laboratorios.cl',
      password: 'Medico123!',
      telefono: '+56987654321',
      direccion: 'Providencia',
      fechaNacimiento: '1985-05-15',
      rol: 'MEDICO'
    },
    {
      id: 3,
      nombre: 'María',
      apellido: 'González',
      rut: '33333333-3',
      email: 'paciente@laboratorios.cl',
      password: 'Paciente123!',
      telefono: '+56911111111',
      direccion: 'Las Condes',
      fechaNacimiento: '1995-03-20',
      rol: 'PACIENTE'
    },
    {
      id: 4,
      nombre: 'Carlos',
      apellido: 'Rojas',
      rut: '44444444-4',
      email: 'lab@laboratorios.cl',
      password: 'Lab123!',
      telefono: '+56922222222',
      direccion: 'Ñuñoa',
      fechaNacimiento: '1988-11-10',
      rol: 'LABORATORISTA'
    }
  ];

  constructor() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  login(email: string, password: string): boolean {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  hasRole(role: string): boolean {
    return this.currentUser?.rol === role;
  }

  register(user: Omit<User, 'id'>): boolean {
    if (this.users.some(u => u.email === user.email || u.rut === user.rut)) {
      return false;
    }
    const newUser: User = {
      ...user,
      id: Math.max(...this.users.map(u => u.id)) + 1
    };
    this.users.push(newUser);
    return true;
  }

  updateProfile(updatedUser: User): boolean {
    const index = this.users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = updatedUser;
      if (this.currentUser?.id === updatedUser.id) {
        this.currentUser = updatedUser;
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
      return true;
    }
    return false;
  }

  resetPassword(email: string, newPassword: string): boolean {
    const user = this.users.find(u => u.email === email);
    if (user) {
      user.password = newPassword;
      return true;
    }
    return false;
  }
}
