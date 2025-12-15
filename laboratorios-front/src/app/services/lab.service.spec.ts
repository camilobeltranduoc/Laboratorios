import { TestBed } from '@angular/core/testing';
import { LabService } from './lab.service';
import { Lab } from '../models/lab.model';

describe('LabService', () => {
  let service: LabService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return all labs', () => {
      const labs = service.getAll();
      expect(labs.length).toBe(4);
    });

    it('should return a copy of the labs array', () => {
      const labs1 = service.getAll();
      const labs2 = service.getAll();
      expect(labs1).not.toBe(labs2);
      expect(labs1).toEqual(labs2);
    });
  });

  describe('getById', () => {
    it('should return lab when found', () => {
      const lab = service.getById(1);
      expect(lab).toBeTruthy();
      expect(lab?.name).toBe('Laboratorio Central Santiago');
    });

    it('should return undefined when lab not found', () => {
      const lab = service.getById(999);
      expect(lab).toBeUndefined();
    });
  });

  describe('create', () => {
    it('should create a new lab successfully', () => {
      const newLab: Omit<Lab, 'id'> = {
        name: 'Nuevo Laboratorio Test'
      };

      const initialCount = service.getAll().length;
      const createdLab = service.create(newLab);

      expect(createdLab).toBeTruthy();
      expect(createdLab.id).toBeDefined();
      expect(createdLab.name).toBe('Nuevo Laboratorio Test');
      expect(service.getAll().length).toBe(initialCount + 1);
    });

    it('should assign incremental ID to new lab', () => {
      const labs = service.getAll();
      const maxId = Math.max(...labs.map(l => l.id));

      const newLab: Omit<Lab, 'id'> = {
        name: 'Test Lab'
      };

      const createdLab = service.create(newLab);
      expect(createdLab.id).toBe(maxId + 1);
    });
  });

  describe('update', () => {
    it('should update existing lab successfully', () => {
      const updatedLab: Lab = {
        id: 1,
        name: 'Laboratorio Actualizado'
      };

      const result = service.update(1, updatedLab);
      expect(result).toBe(true);

      const lab = service.getById(1);
      expect(lab?.name).toBe('Laboratorio Actualizado');
    });

    it('should return false when updating non-existent lab', () => {
      const updatedLab: Lab = {
        id: 999,
        name: 'Non Existent'
      };

      const result = service.update(999, updatedLab);
      expect(result).toBe(false);
    });

    it('should preserve the ID when updating', () => {
      const updatedLab: Lab = {
        id: 999,
        name: 'Test Lab'
      };

      service.update(2, updatedLab);
      const lab = service.getById(2);

      expect(lab?.id).toBe(2);
      expect(lab?.name).toBe('Test Lab');
    });
  });

  describe('delete', () => {
    it('should delete existing lab successfully', () => {
      const initialCount = service.getAll().length;
      const result = service.delete(1);

      expect(result).toBe(true);
      expect(service.getAll().length).toBe(initialCount - 1);
      expect(service.getById(1)).toBeUndefined();
    });

    it('should return false when deleting non-existent lab', () => {
      const result = service.delete(999);
      expect(result).toBe(false);
    });

    it('should not affect lab count when deleting non-existent lab', () => {
      const initialCount = service.getAll().length;
      service.delete(999);
      expect(service.getAll().length).toBe(initialCount);
    });
  });
});
