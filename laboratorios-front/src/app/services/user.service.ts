import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
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

  getAll(): User[] {
    return [...this.users];
  }

  getById(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }

  create(user: Omit<User, 'id'>): User {
    const newUser: User = {
      ...user,
      id: Math.max(...this.users.map(u => u.id)) + 1
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: number, user: User): boolean {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users[index] = { ...user, id };
      return true;
    }
    return false;
  }

  delete(id: number): boolean {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }
}
