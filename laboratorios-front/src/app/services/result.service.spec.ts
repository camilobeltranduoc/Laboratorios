import { TestBed } from '@angular/core/testing';
import { ResultService } from './result.service';
import { Result } from '../models/result.model';

describe('ResultService', () => {
  let service: ResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return all results', () => {
      const results = service.getAll();
      expect(results.length).toBe(3);
    });

    it('should return a copy of the results array', () => {
      const results1 = service.getAll();
      const results2 = service.getAll();
      expect(results1).not.toBe(results2);
      expect(results1).toEqual(results2);
    });

    it('should contain initial sample data', () => {
      const results = service.getAll();
      expect(results[0].patientName).toBe('María González');
      expect(results[0].testType).toBe('Hemograma Completo');
    });
  });

  describe('getById', () => {
    it('should return result when found', () => {
      const result = service.getById(1);
      expect(result).toBeTruthy();
      expect(result?.testType).toBe('Hemograma Completo');
      expect(result?.patientName).toBe('María González');
    });

    it('should return undefined when result not found', () => {
      const result = service.getById(999);
      expect(result).toBeUndefined();
    });

    it('should return correct result for each ID', () => {
      const result1 = service.getById(1);
      const result2 = service.getById(2);
      const result3 = service.getById(3);

      expect(result1?.testType).toBe('Hemograma Completo');
      expect(result2?.testType).toBe('Perfil Lipídico');
      expect(result3?.testType).toBe('Glucosa en Ayunas');
    });
  });

  describe('getByPatientId', () => {
    it('should return all results for a specific patient', () => {
      const results = service.getByPatientId(3);
      expect(results.length).toBe(3);
      results.forEach(result => {
        expect(result.patientId).toBe(3);
        expect(result.patientName).toBe('María González');
      });
    });

    it('should return empty array when patient has no results', () => {
      const results = service.getByPatientId(999);
      expect(results).toEqual([]);
      expect(results.length).toBe(0);
    });

    it('should filter results correctly by patient ID', () => {
      const newResult: Omit<Result, 'id'> = {
        patientId: 5,
        patientName: 'Test Patient',
        labId: 1,
        labName: 'Test Lab',
        testType: 'Test Type',
        result: 'Test Result',
        date: '2025-01-25',
        notes: 'Test notes'
      };
      service.create(newResult);

      const patient3Results = service.getByPatientId(3);
      const patient5Results = service.getByPatientId(5);

      expect(patient3Results.length).toBe(3);
      expect(patient5Results.length).toBe(1);
      expect(patient5Results[0].patientName).toBe('Test Patient');
    });
  });

  describe('create', () => {
    it('should create a new result successfully', () => {
      const newResult: Omit<Result, 'id'> = {
        patientId: 1,
        patientName: 'Test Patient',
        labId: 1,
        labName: 'Test Lab',
        testType: 'Test Completo',
        result: 'Normal',
        date: '2025-01-25',
        notes: 'Test notes'
      };

      const initialCount = service.getAll().length;
      const createdResult = service.create(newResult);

      expect(createdResult).toBeTruthy();
      expect(createdResult.id).toBeDefined();
      expect(createdResult.testType).toBe('Test Completo');
      expect(createdResult.patientName).toBe('Test Patient');
      expect(service.getAll().length).toBe(initialCount + 1);
    });

    it('should assign incremental ID to new result', () => {
      const results = service.getAll();
      const maxId = Math.max(...results.map(r => r.id));

      const newResult: Omit<Result, 'id'> = {
        patientId: 2,
        patientName: 'Another Patient',
        labId: 2,
        labName: 'Another Lab',
        testType: 'Another Test',
        result: 'Pending',
        date: '2025-01-26',
        notes: ''
      };

      const createdResult = service.create(newResult);
      expect(createdResult.id).toBe(maxId + 1);
    });

    it('should preserve all result properties when creating', () => {
      const newResult: Omit<Result, 'id'> = {
        patientId: 10,
        patientName: 'John Doe',
        labId: 3,
        labName: 'Lab Concepción',
        testType: 'Radiografía',
        result: 'Sin hallazgos',
        date: '2025-02-01',
        notes: 'Control de rutina'
      };

      const createdResult = service.create(newResult);
      expect(createdResult.patientId).toBe(10);
      expect(createdResult.patientName).toBe('John Doe');
      expect(createdResult.labId).toBe(3);
      expect(createdResult.labName).toBe('Lab Concepción');
      expect(createdResult.testType).toBe('Radiografía');
      expect(createdResult.result).toBe('Sin hallazgos');
      expect(createdResult.date).toBe('2025-02-01');
      expect(createdResult.notes).toBe('Control de rutina');
    });
  });

  describe('update', () => {
    it('should update existing result successfully', () => {
      const updatedResult: Result = {
        id: 1,
        patientId: 3,
        patientName: 'María González',
        labId: 1,
        labName: 'Laboratorio Central Santiago',
        testType: 'Hemograma Completo',
        result: 'Actualizado - Anemia leve',
        date: '2025-01-15',
        notes: 'Revisión de resultados'
      };

      const success = service.update(1, updatedResult);
      expect(success).toBe(true);

      const result = service.getById(1);
      expect(result?.result).toBe('Actualizado - Anemia leve');
      expect(result?.notes).toBe('Revisión de resultados');
    });

    it('should return false when updating non-existent result', () => {
      const updatedResult: Result = {
        id: 999,
        patientId: 1,
        patientName: 'Non Existent',
        labId: 1,
        labName: 'Test',
        testType: 'Test',
        result: 'Test',
        date: '2025-01-01',
        notes: ''
      };

      const success = service.update(999, updatedResult);
      expect(success).toBe(false);
    });

    it('should preserve the ID when updating', () => {
      const updatedResult: Result = {
        id: 999,
        patientId: 5,
        patientName: 'Different Patient',
        labId: 2,
        labName: 'Different Lab',
        testType: 'Different Test',
        result: 'Different Result',
        date: '2025-02-01',
        notes: 'Different notes'
      };

      service.update(2, updatedResult);
      const result = service.getById(2);

      expect(result?.id).toBe(2);
      expect(result?.patientName).toBe('Different Patient');
      expect(result?.testType).toBe('Different Test');
    });

    it('should allow updating patient association', () => {
      const updatedResult: Result = {
        id: 1,
        patientId: 10,
        patientName: 'New Patient Name',
        labId: 1,
        labName: 'Laboratorio Central Santiago',
        testType: 'Hemograma Completo',
        result: 'Normal',
        date: '2025-01-15',
        notes: 'Reassigned to different patient'
      };

      service.update(1, updatedResult);
      const result = service.getById(1);

      expect(result?.patientId).toBe(10);
      expect(result?.patientName).toBe('New Patient Name');
    });
  });

  describe('delete', () => {
    it('should delete existing result successfully', () => {
      const initialCount = service.getAll().length;
      const success = service.delete(1);

      expect(success).toBe(true);
      expect(service.getAll().length).toBe(initialCount - 1);
      expect(service.getById(1)).toBeUndefined();
    });

    it('should return false when deleting non-existent result', () => {
      const success = service.delete(999);
      expect(success).toBe(false);
    });

    it('should not affect result count when deleting non-existent result', () => {
      const initialCount = service.getAll().length;
      service.delete(999);
      expect(service.getAll().length).toBe(initialCount);
    });

    it('should remove result from patient results list', () => {
      const patientResultsBefore = service.getByPatientId(3);
      expect(patientResultsBefore.length).toBe(3);

      service.delete(1);

      const patientResultsAfter = service.getByPatientId(3);
      expect(patientResultsAfter.length).toBe(2);
      expect(patientResultsAfter.find(r => r.id === 1)).toBeUndefined();
    });

    it('should allow deleting multiple results sequentially', () => {
      const initialCount = service.getAll().length;

      service.delete(1);
      service.delete(2);

      expect(service.getAll().length).toBe(initialCount - 2);
      expect(service.getById(1)).toBeUndefined();
      expect(service.getById(2)).toBeUndefined();
      expect(service.getById(3)).toBeTruthy();
    });
  });

  describe('CRUD integration', () => {
    it('should handle complete result lifecycle', () => {
      const initialCount = service.getAll().length;

      const newResult: Omit<Result, 'id'> = {
        patientId: 7,
        patientName: 'Integration Test Patient',
        labId: 1,
        labName: 'Test Lab',
        testType: 'Integration Test',
        result: 'Pending',
        date: '2025-01-30',
        notes: 'Initial notes'
      };

      const created = service.create(newResult);
      expect(service.getAll().length).toBe(initialCount + 1);

      const found = service.getById(created.id);
      expect(found).toEqual(created);

      const patientResults = service.getByPatientId(7);
      expect(patientResults.length).toBe(1);
      expect(patientResults[0].id).toBe(created.id);

      const updatedResult: Result = {
        ...created,
        result: 'Completed',
        notes: 'Test completed successfully'
      };
      service.update(created.id, updatedResult);

      const updated = service.getById(created.id);
      expect(updated?.result).toBe('Completed');
      expect(updated?.notes).toBe('Test completed successfully');

      service.delete(created.id);
      expect(service.getAll().length).toBe(initialCount);
      expect(service.getById(created.id)).toBeUndefined();
      expect(service.getByPatientId(7).length).toBe(0);
    });
  });
});
