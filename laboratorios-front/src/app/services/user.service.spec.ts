import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../models/user.model';
import { API_CONFIG } from '../config/api.config';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockUsers: User[] = [
    {
      id: 1,
      nombre: 'Admin',
      apellido: 'Sistema',
      email: 'admin@laboratorios.cl',
      password: 'Admin123!',
      rut: '11111111-1',
      rol: 'ADMINISTRADOR',
      telefono: '+56911111111',
      direccion: 'Calle 123',
      fechaNacimiento: '1990-01-01'
    },
    {
      id: 2,
      nombre: 'Dr. Juan',
      apellido: 'Pérez',
      email: 'medico@laboratorios.cl',
      password: 'Medico123!',
      rut: '22222222-2',
      rol: 'MEDICO',
      telefono: '+56922222222',
      direccion: 'Avenida 456',
      fechaNacimiento: '1985-05-15'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return all users', (done) => {
      service.getAll().subscribe(users => {
        expect(users.length).toBe(2);
        expect(users).toEqual(mockUsers);
        done();
      });

      const req = httpMock.expectOne(API_CONFIG.userService);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });

    it('should return empty array on error', (done) => {
      service.getAll().subscribe(users => {
        expect(users).toEqual([]);
        done();
      });

      const req = httpMock.expectOne(API_CONFIG.userService);
      req.flush({ message: 'Error' }, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getById', () => {
    it('should return user when found', (done) => {
      service.getById(1).subscribe(user => {
        expect(user).toEqual(mockUsers[0]);
        done();
      });

      const req = httpMock.expectOne(`${API_CONFIG.userService}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers[0]);
    });

    it('should return undefined when user not found', (done) => {
      service.getById(999).subscribe(user => {
        expect(user).toBeUndefined();
        done();
      });

      const req = httpMock.expectOne(`${API_CONFIG.userService}/999`);
      req.flush({ message: 'User not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('create', () => {
    it('should create a new user successfully', (done) => {
      const newUserData: Omit<User, 'id'> = {
        nombre: 'Nuevo',
        apellido: 'Usuario',
        email: 'nuevo@laboratorios.cl',
        password: 'Nuevo123!',
        rut: '55555555-5',
        rol: 'PACIENTE',
        telefono: '+56933333333',
        direccion: 'Calle Nueva 789',
        fechaNacimiento: '2000-01-01'
      };

      const createdUser = { ...newUserData, id: 3 };

      service.create(newUserData).subscribe(user => {
        expect(user).toEqual(createdUser);
        expect(user.id).toBeDefined();
        done();
      });

      const req = httpMock.expectOne(API_CONFIG.userService);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newUserData);
      req.flush(createdUser);
    });

    it('should throw error on creation failure', (done) => {
      const newUserData: Omit<User, 'id'> = {
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

      service.create(newUserData).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        }
      });

      const req = httpMock.expectOne(API_CONFIG.userService);
      req.flush({ message: 'Email already exists' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('update', () => {
    it('should update existing user successfully', (done) => {
      const updatedUser: User = {
        ...mockUsers[0],
        nombre: 'Admin Actualizado'
      };

      service.update(1, updatedUser).subscribe(user => {
        expect(user.nombre).toBe('Admin Actualizado');
        done();
      });

      const req = httpMock.expectOne(`${API_CONFIG.userService}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedUser);
      req.flush(updatedUser);
    });

    it('should throw error when updating non-existent user', (done) => {
      const updatedUser: User = {
        ...mockUsers[0],
        id: 999
      };

      service.update(999, updatedUser).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        }
      });

      const req = httpMock.expectOne(`${API_CONFIG.userService}/999`);
      req.flush({ message: 'User not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('delete', () => {
    it('should delete existing user successfully', (done) => {
      service.delete(1).subscribe(() => {
        expect().nothing();
        done();
      });

      const req = httpMock.expectOne(`${API_CONFIG.userService}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should throw error when deleting non-existent user', (done) => {
      service.delete(999).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        }
      });

      const req = httpMock.expectOne(`${API_CONFIG.userService}/999`);
      req.flush({ message: 'User not found' }, { status: 404, statusText: 'Not Found' });
    });
  });
});
