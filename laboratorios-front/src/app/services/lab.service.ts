import { Injectable } from '@angular/core';
import { Lab } from '../models/lab.model';

@Injectable({
  providedIn: 'root'
})
export class LabService {
  private labs: Lab[] = [
    { id: 1, name: 'Laboratorio Central Santiago' },
    { id: 2, name: 'Laboratorio Clínico Viña del Mar' },
    { id: 3, name: 'Laboratorio de Análisis Concepción' },
    { id: 4, name: 'Laboratorio Especializado La Serena' }
  ];

  getAll(): Lab[] {
    return [...this.labs];
  }

  getById(id: number): Lab | undefined {
    return this.labs.find(l => l.id === id);
  }

  create(lab: Omit<Lab, 'id'>): Lab {
    const newLab: Lab = {
      ...lab,
      id: Math.max(...this.labs.map(l => l.id)) + 1
    };
    this.labs.push(newLab);
    return newLab;
  }

  update(id: number, lab: Lab): boolean {
    const index = this.labs.findIndex(l => l.id === id);
    if (index !== -1) {
      this.labs[index] = { ...lab, id };
      return true;
    }
    return false;
  }

  delete(id: number): boolean {
    const index = this.labs.findIndex(l => l.id === id);
    if (index !== -1) {
      this.labs.splice(index, 1);
      return true;
    }
    return false;
  }
}
