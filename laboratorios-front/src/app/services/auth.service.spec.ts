import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', () => {
      const result = service.login('admin@laboratorios.cl', 'Admin123!');
      expect(result).toBe(true);
      expect(service.getCurrentUser()).toBeTruthy();
      expect(service.getCurrentUser()?.email).toBe('admin@laboratorios.cl');
    });

    it('should fail login with invalid email', () => {
      const result = service.login('invalid@laboratorios.cl', 'Admin123!');
      expect(result).toBe(false);
      expect(service.getCurrentUser()).toBeNull();
    });

    it('should fail login with invalid password', () => {
      const result = service.login('admin@laboratorios.cl', 'wrongpassword');
      expect(result).toBe(false);
      expect(service.getCurrentUser()).toBeNull();
    });

    it('should store user in localStorage on successful login', () => {
      service.login('admin@laboratorios.cl', 'Admin123!');
      const stored = localStorage.getItem('currentUser');
      expect(stored).toBeTruthy();
      const user = JSON.parse(stored!);
      expect(user.email).toBe('admin@laboratorios.cl');
    });
  });

  describe('logout', () => {
    it('should clear current user', () => {
      service.login('admin@laboratorios.cl', 'Admin123!');
      expect(service.getCurrentUser()).toBeTruthy();

      service.logout();
      expect(service.getCurrentUser()).toBeNull();
    });

    it('should remove user from localStorage', () => {
      service.login('admin@laboratorios.cl', 'Admin123!');
      expect(localStorage.getItem('currentUser')).toBeTruthy();

      service.logout();
      expect(localStorage.getItem('currentUser')).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when no user is logged in', () => {
      expect(service.getCurrentUser()).toBeNull();
    });

    it('should return current user when logged in', () => {
      service.login('medico@laboratorios.cl', 'Medico123!');
      const user = service.getCurrentUser();
      expect(user).toBeTruthy();
      expect(user?.nombre).toBe('Dr. Juan');
      expect(user?.rol).toBe('MEDICO');
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when not logged in', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should return true when logged in', () => {
      service.login('admin@laboratorios.cl', 'Admin123!');
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false after logout', () => {
      service.login('admin@laboratorios.cl', 'Admin123!');
      service.logout();
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('hasRole', () => {
    it('should return true if user has the specified role', () => {
      service.login('admin@laboratorios.cl', 'Admin123!');
      expect(service.hasRole('ADMINISTRADOR')).toBe(true);
    });

    it('should return false if user does not have the specified role', () => {
      service.login('admin@laboratorios.cl', 'Admin123!');
      expect(service.hasRole('MEDICO')).toBe(false);
    });

    it('should return false if no user is logged in', () => {
      expect(service.hasRole('ADMINISTRADOR')).toBe(false);
    });
  });

  describe('register', () => {
    it('should register a new user successfully', () => {
      const newUser: Omit<User, 'id'> = {
        nombre: 'Test',
        apellido: 'User',
        rut: '55555555-5',
        email: 'test@laboratorios.cl',
        password: 'Test123!',
        telefono: '+56933333333',
        direccion: 'Test Address',
        fechaNacimiento: '2000-01-01',
        rol: 'PACIENTE'
      };

      const result = service.register(newUser);
      expect(result).toBe(true);
    });

    it('should fail to register user with duplicate email', () => {
      const duplicateUser: Omit<User, 'id'> = {
        nombre: 'Duplicate',
        apellido: 'User',
        rut: '66666666-6',
        email: 'admin@laboratorios.cl',
        password: 'Test123!',
        telefono: '+56933333333',
        direccion: 'Test Address',
        fechaNacimiento: '2000-01-01',
        rol: 'PACIENTE'
      };

      const result = service.register(duplicateUser);
      expect(result).toBe(false);
    });

    it('should fail to register user with duplicate RUT', () => {
      const duplicateUser: Omit<User, 'id'> = {
        nombre: 'Duplicate',
        apellido: 'User',
        rut: '11111111-1',
        email: 'unique@laboratorios.cl',
        password: 'Test123!',
        telefono: '+56933333333',
        direccion: 'Test Address',
        fechaNacimiento: '2000-01-01',
        rol: 'PACIENTE'
      };

      const result = service.register(duplicateUser);
      expect(result).toBe(false);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', () => {
      service.login('admin@laboratorios.cl', 'Admin123!');
      const currentUser = service.getCurrentUser()!;

      const updatedUser: User = {
        ...currentUser,
        nombre: 'Updated Name',
        telefono: '+56999999999'
      };

      const result = service.updateProfile(updatedUser);
      expect(result).toBe(true);
      expect(service.getCurrentUser()?.nombre).toBe('Updated Name');
      expect(service.getCurrentUser()?.telefono).toBe('+56999999999');
    });

    it('should update localStorage when updating current user profile', () => {
      service.login('admin@laboratorios.cl', 'Admin123!');
      const currentUser = service.getCurrentUser()!;

      const updatedUser: User = {
        ...currentUser,
        nombre: 'Updated Name'
      };

      service.updateProfile(updatedUser);

      const stored = localStorage.getItem('currentUser');
      const storedUser = JSON.parse(stored!);
      expect(storedUser.nombre).toBe('Updated Name');
    });

    it('should fail to update non-existent user', () => {
      const nonExistentUser: User = {
        id: 999,
        nombre: 'Non',
        apellido: 'Existent',
        rut: '99999999-9',
        email: 'nonexistent@laboratorios.cl',
        password: 'Test123!',
        telefono: '+56933333333',
        direccion: 'Test Address',
        fechaNacimiento: '2000-01-01',
        rol: 'PACIENTE'
      };

      const result = service.updateProfile(nonExistentUser);
      expect(result).toBe(false);
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', () => {
      const result = service.resetPassword('admin@laboratorios.cl', 'NewPassword123!');
      expect(result).toBe(true);

      const loginResult = service.login('admin@laboratorios.cl', 'NewPassword123!');
      expect(loginResult).toBe(true);
    });

    it('should fail to reset password for non-existent email', () => {
      const result = service.resetPassword('nonexistent@laboratorios.cl', 'NewPassword123!');
      expect(result).toBe(false);
    });
  });

  describe('localStorage persistence', () => {
    it('should restore user from localStorage on service creation', () => {
      const user: User = {
        id: 1,
        nombre: 'Test',
        apellido: 'User',
        rut: '11111111-1',
        email: 'test@laboratorios.cl',
        password: 'Test123!',
        telefono: '+56933333333',
        direccion: 'Test Address',
        fechaNacimiento: '2000-01-01',
        rol: 'ADMINISTRADOR'
      };

      localStorage.setItem('currentUser', JSON.stringify(user));

      const newService = new AuthService();
      expect(newService.getCurrentUser()).toBeTruthy();
      expect(newService.getCurrentUser()?.email).toBe('test@laboratorios.cl');
      expect(newService.isAuthenticated()).toBe(true);
    });
  });
});
