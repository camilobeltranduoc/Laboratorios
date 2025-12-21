import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LabService } from './lab.service';
import { Lab } from '../models/lab.model';
import { API_CONFIG } from '../config/api.config';

describe('LabService', () => {
  let service: LabService;
  let httpMock: HttpTestingController;

  const mockLabs: Lab[] = [
    { id: 1, name: 'Laboratorio Central Santiago' },
    { id: 2, name: 'Laboratorio Clínico Providencia' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LabService]
    });
    service = TestBed.inject(LabService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return all labs', (done) => {
      service.getAll().subscribe(labs => {
        expect(labs.length).toBe(2);
        expect(labs).toEqual(mockLabs);
        done();
      });

      const req = httpMock.expectOne(API_CONFIG.labsService);
      expect(req.request.method).toBe('GET');
      req.flush(mockLabs);
    });

    it('should return empty array on error', (done) => {
      service.getAll().subscribe(labs => {
        expect(labs).toEqual([]);
        done();
      });

      const req = httpMock.expectOne(API_CONFIG.labsService);
      req.flush({ message: 'Error' }, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getById', () => {
    it('should return lab when found', (done) => {
      service.getById(1).subscribe(lab => {
        expect(lab).toEqual(mockLabs[0]);
        done();
      });

      const req = httpMock.expectOne(`${API_CONFIG.labsService}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockLabs[0]);
    });

    it('should return undefined when lab not found', (done) => {
      service.getById(999).subscribe(lab => {
        expect(lab).toBeUndefined();
        done();
      });

      const req = httpMock.expectOne(`${API_CONFIG.labsService}/999`);
      req.flush({ message: 'Lab not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('create', () => {
    it('should create a new lab successfully', (done) => {
      const newLabData: Omit<Lab, 'id'> = {
        name: 'Nuevo Laboratorio Test'
      };

      const createdLab = { ...newLabData, id: 3 };

      service.create(newLabData).subscribe(lab => {
        expect(lab).toEqual(createdLab);
        done();
      });

      const req = httpMock.expectOne(API_CONFIG.labsService);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newLabData);
      req.flush(createdLab);
    });

    it('should throw error on creation failure', (done) => {
      const newLabData: Omit<Lab, 'id'> = {
        name: 'Duplicate Lab'
      };

      service.create(newLabData).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        }
      });

      const req = httpMock.expectOne(API_CONFIG.labsService);
      req.flush({ message: 'Lab name already exists' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('update', () => {
    it('should update existing lab successfully', (done) => {
      const updatedLab: Lab = {
        id: 1,
        name: 'Laboratorio Central Actualizado'
      };

      service.update(1, updatedLab).subscribe(lab => {
        expect(lab.name).toBe('Laboratorio Central Actualizado');
        done();
      });

      const req = httpMock.expectOne(`${API_CONFIG.labsService}/1`);
      expect(req.request.method).toBe('PUT');
      req.flush(updatedLab);
    });

    it('should throw error when updating non-existent lab', (done) => {
      const updatedLab: Lab = {
        id: 999,
        name: 'Non-existent Lab'
      };

      service.update(999, updatedLab).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        }
      });

      const req = httpMock.expectOne(`${API_CONFIG.labsService}/999`);
      req.flush({ message: 'Lab not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('delete', () => {
    it('should delete existing lab successfully', (done) => {
      service.delete(1).subscribe(() => {
        expect().nothing();
        done();
      });

      const req = httpMock.expectOne(`${API_CONFIG.labsService}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should throw error when deleting non-existent lab', (done) => {
      service.delete(999).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        }
      });

      const req = httpMock.expectOne(`${API_CONFIG.labsService}/999`);
      req.flush({ message: 'Lab not found' }, { status: 404, statusText: 'Not Found' });
    });
  });
});
