import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ResultService } from './result.service';
import { Result } from '../models/result.model';
import { API_CONFIG } from '../config/api.config';

describe('ResultService', () => {
  let service: ResultService;
  let httpMock: HttpTestingController;

  const mockResults: Result[] = [
    {
      id: 1,
      patientId: 1,
      patientName: 'María González',
      labId: 1,
      labName: 'Laboratorio Central Santiago',
      testType: 'Hemograma Completo',
      result: 'Normal',
      date: '2025-01-15'
    },
    {
      id: 2,
      patientId: 2,
      patientName: 'Carlos Pérez',
      labId: 2,
      labName: 'Laboratorio Clínico Providencia',
      testType: 'Glicemia',
      result: '95 mg/dL',
      date: '2025-01-16'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ResultService]
    });
    service = TestBed.inject(ResultService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return all results', (done) => {
      service.getAll().subscribe(results => {
        expect(results.length).toBe(2);
        expect(results).toEqual(mockResults);
        done();
      });

      const req = httpMock.expectOne(API_CONFIG.resultsService);
      expect(req.request.method).toBe('GET');
      req.flush(mockResults);
    });

    it('should return empty array on error', (done) => {
      service.getAll().subscribe(results => {
        expect(results).toEqual([]);
        done();
      });

      const req = httpMock.expectOne(API_CONFIG.resultsService);
      req.flush({ message: 'Error' }, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getById', () => {
    it('should return result when found', (done) => {
      service.getById(1).subscribe(result => {
        expect(result).toEqual(mockResults[0]);
        done();
      });

      const req = httpMock.expectOne(`${API_CONFIG.resultsService}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResults[0]);
    });

    it('should return undefined when result not found', (done) => {
      service.getById(999).subscribe(result => {
        expect(result).toBeUndefined();
        done();
      });

      const req = httpMock.expectOne(`${API_CONFIG.resultsService}/999`);
      req.flush({ message: 'Result not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getByPatientId', () => {
    it('should return results for patient', (done) => {
      const patientResults = [mockResults[0]];

      service.getByPatientId(1).subscribe(results => {
        expect(results).toEqual(patientResults);
        done();
      });

      const req = httpMock.expectOne(`${API_CONFIG.resultsService}/patient/1`);
      expect(req.request.method).toBe('GET');
      req.flush(patientResults);
    });

    it('should return empty array when patient has no results', (done) => {
      service.getByPatientId(999).subscribe(results => {
        expect(results).toEqual([]);
        done();
      });

      const req = httpMock.expectOne(`${API_CONFIG.resultsService}/patient/999`);
      req.flush([]);
    });

    it('should return empty array on error', (done) => {
      service.getByPatientId(1).subscribe(results => {
        expect(results).toEqual([]);
        done();
      });

      const req = httpMock.expectOne(`${API_CONFIG.resultsService}/patient/1`);
      req.flush({ message: 'Error' }, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('create', () => {
    it('should create a new result successfully', (done) => {
      const newResultData: Omit<Result, 'id'> = {
        patientId: 3,
        patientName: 'Juan López',
        labId: 1,
        labName: 'Laboratorio Central Santiago',
        testType: 'Perfil Lipídico',
        result: 'Pendiente',
        date: '2025-01-20'
      };

      const createdResult = { ...newResultData, id: 3 };

      service.create(newResultData).subscribe(result => {
        expect(result).toEqual(createdResult);
        done();
      });

      const req = httpMock.expectOne(API_CONFIG.resultsService);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newResultData);
      req.flush(createdResult);
    });

    it('should throw error on creation failure', (done) => {
      const newResultData: Omit<Result, 'id'> = {
        patientId: 999,
        patientName: 'Invalid',
        labId: 1,
        labName: 'Lab',
        testType: 'Test',
        result: 'Result',
        date: '2025-01-20'
      };

      service.create(newResultData).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        }
      });

      const req = httpMock.expectOne(API_CONFIG.resultsService);
      req.flush({ message: 'Patient not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('update', () => {
    it('should update existing result successfully', (done) => {
      const updatedResult: Result = {
        ...mockResults[0],
        result: 'Anemia leve',
        notes: 'Requiere seguimiento'
      };

      service.update(1, updatedResult).subscribe(result => {
        expect(result.result).toBe('Anemia leve');
        done();
      });

      const req = httpMock.expectOne(`${API_CONFIG.resultsService}/1`);
      expect(req.request.method).toBe('PUT');
      req.flush(updatedResult);
    });

    it('should throw error when updating non-existent result', (done) => {
      const updatedResult: Result = {
        ...mockResults[0],
        id: 999
      };

      service.update(999, updatedResult).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        }
      });

      const req = httpMock.expectOne(`${API_CONFIG.resultsService}/999`);
      req.flush({ message: 'Result not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('delete', () => {
    it('should delete existing result successfully', (done) => {
      service.delete(1).subscribe(() => {
        expect().nothing();
        done();
      });

      const req = httpMock.expectOne(`${API_CONFIG.resultsService}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should throw error when deleting non-existent result', (done) => {
      service.delete(999).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        }
      });

      const req = httpMock.expectOne(`${API_CONFIG.resultsService}/999`);
      req.flush({ message: 'Result not found' }, { status: 404, statusText: 'Not Found' });
    });
  });
});
