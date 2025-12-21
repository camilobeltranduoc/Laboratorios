import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { API_CONFIG } from '../config/api.config';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockUser: User = {
    id: 1,
    nombre: 'Admin',
    apellido: 'Sistema',
    email: 'admin@laboratorios.cl',
    password: 'Admin123!',
    rut: '11111111-1',
    rol: 'ADMINISTRADOR',
    telefono: '+56911111111',
    direccion: 'Calle Principal 123',
    fechaNacimiento: '1990-01-01'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login successfully and store user', (done) => {
      service.login('admin@laboratorios.cl', 'Admin123!').subscribe(result => {
        expect(result).toBe(true);
        expect(service.getCurrentUser()).toEqual(mockUser);
        expect(localStorage.getItem('currentUser')).toBeTruthy();
        done();
      });

      const req = httpMock.expectOne(`${API_CONFIG.userService}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email: 'admin@laboratorios.cl', password: 'Admin123!' });
      req.flush(mockUser);
    });

    it('should return false on login failure', (done) => {
      service.login('wrong@example.com', 'wrong').subscribe(result => {
        expect(result).toBe(false);
        expect(service.getCurrentUser()).toBeNull();
        done();
      });

      const req = httpMock.expectOne(`${API_CONFIG.userService}/auth/login`);
      req.flush({ message: 'Credenciales inválidas' }, { status: 401, statusText: 'Unauthorized' });
    });

    it('should return false when response has no id', (done) => {
      service.login('admin@laboratorios.cl', 'Admin123!').subscribe(result => {
        expect(result).toBe(false);
        done();
      });

      const req = httpMock.expectOne(`${API_CONFIG.userService}/auth/login`);
      req.flush({ email: 'admin@laboratorios.cl' });
    });
  });

  describe('logout', () => {
    it('should clear current user and localStorage', () => {
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      service['currentUserSubject'].next(mockUser);

      service.logout();

      expect(service.getCurrentUser()).toBeNull();
      expect(localStorage.getItem('currentUser')).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when no user is logged in', () => {
      expect(service.getCurrentUser()).toBeNull();
    });

    it('should return current user when logged in', () => {
      service['currentUserSubject'].next(mockUser);
      const user = service.getCurrentUser();
      expect(user).toEqual(mockUser);
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when not logged in', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should return true when logged in', () => {
      service['currentUserSubject'].next(mockUser);
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false after logout', () => {
      service['currentUserSubject'].next(mockUser);
      service.logout();
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('hasRole', () => {
    it('should return true if user has the specified role', () => {
      service['currentUserSubject'].next(mockUser);
      expect(service.hasRole('ADMINISTRADOR')).toBe(true);
    });

    it('should return false if user does not have the specified role', () => {
      service['currentUserSubject'].next(mockUser);
      expect(service.hasRole('MEDICO')).toBe(false);
    });

    it('should return false if no user is logged in', () => {
      expect(service.hasRole('ADMINISTRADOR')).toBeFalsy();
    });
  });

  describe('register', () => {
    it('should register a new user successfully', (done) => {
      const newUser: Omit<User, 'id'> = {
        nombre: 'Test',
        apellido: 'User',
        email: 'test@laboratorios.cl',
        password: 'Test123!',
        rut: '55555555-5',
        rol: 'PACIENTE',
        telefono: '+56933333333',
        direccion: 'Test Address 456',
        fechaNacimiento: '2000-01-01'
      };

      service.register(newUser).subscribe(result => {
        expect(result).toBe(true);
        done();
      });

      const req = httpMock.expectOne(`${API_CONFIG.userService}/auth/register`);
      expect(req.request.method).toBe('POST');
      req.flush({ ...newUser, id: 2 });
    });

    it('should return false on registration error', (done) => {
      const newUser: Omit<User, 'id'> = {
        nombre: 'Test',
        apellido: 'Duplicate',
        email: 'duplicate@laboratorios.cl',
        password: 'Test123!',
        rut: '55555555-5',
        rol: 'PACIENTE',
        telefono: '+56933333333',
        direccion: 'Test Address',
        fechaNacimiento: '2000-01-01'
      };

      service.register(newUser).subscribe(result => {
        expect(result).toBe(false);
        done();
      });

      const req = httpMock.expectOne(`${API_CONFIG.userService}/auth/register`);
      req.flush({ message: 'Email already exists' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('updateProfile', () => {
    it('should update profile successfully for current user', (done) => {
      service['currentUserSubject'].next(mockUser);
      const updatedUser: User = { ...mockUser, nombre: 'Updated Name' };

      service.updateProfile(updatedUser).subscribe(result => {
        expect(result).toBe(true);
        expect(service.getCurrentUser()?.nombre).toBe('Updated Name');
        done();
      });

      const req = httpMock.expectOne(`${API_CONFIG.userService}/${mockUser.id}`);
      expect(req.request.method).toBe('PUT');
      req.flush(updatedUser);
    });

    it('should return false on update error', (done) => {
      const updatedUser: User = { ...mockUser, nombre: 'Updated' };

      service.updateProfile(updatedUser).subscribe(result => {
        expect(result).toBe(false);
        done();
      });

      const req = httpMock.expectOne(`${API_CONFIG.userService}/${mockUser.id}`);
      req.flush({ message: 'Update failed' }, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', (done) => {
      service.resetPassword('admin@laboratorios.cl', 'NewPass123!').subscribe(result => {
        expect(result).toBe(true);
        done();
      });

      const req = httpMock.expectOne(`${API_CONFIG.userService}/auth/reset-password`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email: 'admin@laboratorios.cl', newPassword: 'NewPass123!' });
      req.flush({ message: 'Password reset successfully' });
    });

    it('should return false on reset password error', (done) => {
      service.resetPassword('unknown@laboratorios.cl', 'NewPass123!').subscribe(result => {
        expect(result).toBe(false);
        done();
      });

      const req = httpMock.expectOne(`${API_CONFIG.userService}/auth/reset-password`);
      req.flush({ message: 'User not found' }, { status: 404, statusText: 'Not Found' });
    });
  });
});
