import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { User } from '../models/user.model';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return all users', () => {
      const users = service.getAll();
      expect(users.length).toBe(4);
    });

    it('should return a copy of the users array', () => {
      const users1 = service.getAll();
      const users2 = service.getAll();
      expect(users1).not.toBe(users2);
      expect(users1).toEqual(users2);
    });

    it('should include all default users', () => {
      const users = service.getAll();
      const emails = users.map(u => u.email);
      expect(emails).toContain('admin@laboratorios.cl');
      expect(emails).toContain('medico@laboratorios.cl');
      expect(emails).toContain('paciente@laboratorios.cl');
      expect(emails).toContain('lab@laboratorios.cl');
    });
  });

  describe('getById', () => {
    it('should return user when found', () => {
      const user = service.getById(1);
      expect(user).toBeTruthy();
      expect(user?.nombre).toBe('Admin');
      expect(user?.email).toBe('admin@laboratorios.cl');
    });

    it('should return undefined when user not found', () => {
      const user = service.getById(999);
      expect(user).toBeUndefined();
    });

    it('should return correct user for each ID', () => {
      const user1 = service.getById(1);
      const user2 = service.getById(2);
      const user3 = service.getById(3);

      expect(user1?.rol).toBe('ADMINISTRADOR');
      expect(user2?.rol).toBe('MEDICO');
      expect(user3?.rol).toBe('PACIENTE');
    });
  });

  describe('create', () => {
    it('should create a new user successfully', () => {
      const newUserData: Omit<User, 'id'> = {
        nombre: 'Nuevo',
        apellido: 'Usuario',
        rut: '55555555-5',
        email: 'nuevo@laboratorios.cl',
        password: 'Nuevo123!',
        telefono: '+56933333333',
        direccion: 'Nueva Direccion',
        fechaNacimiento: '2000-01-01',
        rol: 'PACIENTE'
      };

      const initialCount = service.getAll().length;
      const createdUser = service.create(newUserData);

      expect(createdUser).toBeTruthy();
      expect(createdUser.id).toBeDefined();
      expect(createdUser.nombre).toBe('Nuevo');
      expect(service.getAll().length).toBe(initialCount + 1);
    });

    it('should assign incremental ID to new user', () => {
      const users = service.getAll();
      const maxId = Math.max(...users.map(u => u.id));

      const newUserData: Omit<User, 'id'> = {
        nombre: 'Test',
        apellido: 'User',
        rut: '66666666-6',
        email: 'test@laboratorios.cl',
        password: 'Test123!',
        telefono: '+56944444444',
        direccion: 'Test Address',
        fechaNacimiento: '2000-01-01',
        rol: 'MEDICO'
      };

      const createdUser = service.create(newUserData);
      expect(createdUser.id).toBe(maxId + 1);
    });

    it('should add user to the users list', () => {
      const newUserData: Omit<User, 'id'> = {
        nombre: 'Test',
        apellido: 'User',
        rut: '77777777-7',
        email: 'test2@laboratorios.cl',
        password: 'Test123!',
        telefono: '+56955555555',
        direccion: 'Test Address',
        fechaNacimiento: '2000-01-01',
        rol: 'LABORATORISTA'
      };

      const createdUser = service.create(newUserData);
      const foundUser = service.getById(createdUser.id);

      expect(foundUser).toBeTruthy();
      expect(foundUser?.email).toBe('test2@laboratorios.cl');
    });
  });

  describe('update', () => {
    it('should update existing user successfully', () => {
      const updatedUser: User = {
        id: 1,
        nombre: 'Admin Actualizado',
        apellido: 'Sistema Updated',
        rut: '11111111-1',
        email: 'admin.updated@laboratorios.cl',
        password: 'NewPassword123!',
        telefono: '+56999999999',
        direccion: 'Nueva Direccion',
        fechaNacimiento: '1990-01-01',
        rol: 'ADMINISTRADOR'
      };

      const result = service.update(1, updatedUser);
      expect(result).toBe(true);

      const user = service.getById(1);
      expect(user?.nombre).toBe('Admin Actualizado');
      expect(user?.email).toBe('admin.updated@laboratorios.cl');
    });

    it('should return false when updating non-existent user', () => {
      const updatedUser: User = {
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

      const result = service.update(999, updatedUser);
      expect(result).toBe(false);
    });

    it('should preserve the ID when updating', () => {
      const updatedUser: User = {
        id: 999, // Trying to change ID
        nombre: 'Test',
        apellido: 'User',
        rut: '22222222-2',
        email: 'test@laboratorios.cl',
        password: 'Test123!',
        telefono: '+56933333333',
        direccion: 'Test Address',
        fechaNacimiento: '2000-01-01',
        rol: 'MEDICO'
      };

      service.update(2, updatedUser);
      const user = service.getById(2);

      expect(user?.id).toBe(2); // ID should remain 2
      expect(user?.nombre).toBe('Test');
    });

    it('should not add new user if ID does not exist', () => {
      const initialCount = service.getAll().length;

      const updatedUser: User = {
        id: 999,
        nombre: 'New',
        apellido: 'User',
        rut: '88888888-8',
        email: 'new@laboratorios.cl',
        password: 'Test123!',
        telefono: '+56933333333',
        direccion: 'Test Address',
        fechaNacimiento: '2000-01-01',
        rol: 'PACIENTE'
      };

      service.update(999, updatedUser);

      expect(service.getAll().length).toBe(initialCount);
      expect(service.getById(999)).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('should delete existing user successfully', () => {
      const initialCount = service.getAll().length;
      const result = service.delete(1);

      expect(result).toBe(true);
      expect(service.getAll().length).toBe(initialCount - 1);
      expect(service.getById(1)).toBeUndefined();
    });

    it('should return false when deleting non-existent user', () => {
      const result = service.delete(999);
      expect(result).toBe(false);
    });

    it('should not affect user count when deleting non-existent user', () => {
      const initialCount = service.getAll().length;
      service.delete(999);
      expect(service.getAll().length).toBe(initialCount);
    });

    it('should remove the correct user', () => {
      service.delete(2);

      expect(service.getById(2)).toBeUndefined();
      expect(service.getById(1)).toBeTruthy();
      expect(service.getById(3)).toBeTruthy();
      expect(service.getById(4)).toBeTruthy();
    });

    it('should allow deleting multiple users', () => {
      const initialCount = service.getAll().length;

      service.delete(1);
      service.delete(2);

      expect(service.getAll().length).toBe(initialCount - 2);
      expect(service.getById(1)).toBeUndefined();
      expect(service.getById(2)).toBeUndefined();
    });
  });

  describe('CRUD integration', () => {
    it('should handle complete CRUD cycle', () => {
      // Create
      const newUser = service.create({
        nombre: 'Integration',
        apellido: 'Test',
        rut: '99999999-9',
        email: 'integration@laboratorios.cl',
        password: 'Test123!',
        telefono: '+56933333333',
        direccion: 'Test Address',
        fechaNacimiento: '2000-01-01',
        rol: 'PACIENTE'
      });

      const createdId = newUser.id;

      // Read
      let foundUser = service.getById(createdId);
      expect(foundUser).toBeTruthy();
      expect(foundUser?.nombre).toBe('Integration');

      // Update
      const updateResult = service.update(createdId, {
        ...foundUser!,
        nombre: 'Updated Integration'
      });
      expect(updateResult).toBe(true);

      foundUser = service.getById(createdId);
      expect(foundUser?.nombre).toBe('Updated Integration');

      // Delete
      const deleteResult = service.delete(createdId);
      expect(deleteResult).toBe(true);

      foundUser = service.getById(createdId);
      expect(foundUser).toBeUndefined();
    });
  });
});
