import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ResultService } from '../../../services/result.service';
import { LabService } from '../../../services/lab.service';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { Result } from '../../../models/result.model';
import { Lab } from '../../../models/lab.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-results',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './results.html',
  styleUrl: './results.css',
})
export class Results implements OnInit {
  results: Result[] = [];
  filteredResults: Result[] = [];
  currentUser: User | null = null;
  resultForm: FormGroup;
  showModal: boolean = false;
  editingResult: Result | null = null;
  searchTerm: string = '';
  labs: Lab[] = [];
  patients: User[] = [];

  constructor(
    private resultService: ResultService,
    private labService: LabService,
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.resultForm = this.fb.group({
      patientId: ['', [Validators.required]],
      labId: ['', [Validators.required]],
      testType: ['', [Validators.required, Validators.minLength(3)]],
      result: ['', [Validators.required]],
      date: ['', [Validators.required]],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadData();
  }

  loadData(): void {
    this.results = this.resultService.getAll();
    this.filteredResults = this.results;
    this.labs = this.labService.getAll();
    this.patients = this.userService.getAll().filter(u => u.rol === 'PACIENTE');
  }

  onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchTerm = term;
    this.filteredResults = this.results.filter(result =>
      result.patientName.toLowerCase().includes(term) ||
      result.labName.toLowerCase().includes(term) ||
      result.testType.toLowerCase().includes(term) ||
      result.result.toLowerCase().includes(term)
    );
  }

  openCreateModal(): void {
    this.editingResult = null;
    this.resultForm.reset();
    this.showModal = true;
  }

  openEditModal(result: Result): void {
    this.editingResult = result;
    this.resultForm.patchValue({
      patientId: result.patientId,
      labId: result.labId,
      testType: result.testType,
      result: result.result,
      date: result.date,
      notes: result.notes
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingResult = null;
    this.resultForm.reset();
  }

  onSubmit(): void {
    if (this.resultForm.valid) {
      const formData = this.resultForm.value;
      const patient = this.patients.find(p => p.id === parseInt(formData.patientId));
      const lab = this.labs.find(l => l.id === parseInt(formData.labId));

      const resultData: Result = {
        id: this.editingResult?.id || 0,
        patientId: parseInt(formData.patientId),
        patientName: patient ? `${patient.nombre} ${patient.apellido}` : '',
        labId: parseInt(formData.labId),
        labName: lab?.name || '',
        testType: formData.testType,
        result: formData.result,
        date: formData.date,
        notes: formData.notes
      };

      if (this.editingResult) {
        this.resultService.update(this.editingResult.id, resultData);
      } else {
        this.resultService.create(resultData);
      }

      this.loadData();
      this.closeModal();
    }
  }

  deleteResult(id: number): void {
    if (confirm('¿Está seguro de eliminar este resultado?')) {
      this.resultService.delete(id);
      this.loadData();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  get patientId() { return this.resultForm.get('patientId'); }
  get labId() { return this.resultForm.get('labId'); }
  get testType() { return this.resultForm.get('testType'); }
  get result() { return this.resultForm.get('result'); }
  get date() { return this.resultForm.get('date'); }
  get notes() { return this.resultForm.get('notes'); }
}
