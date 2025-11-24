import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ResultService } from '../../../services/result.service';
import { LabService } from '../../../services/lab.service';
import { User } from '../../../models/user.model';
import { Result } from '../../../models/result.model';
import { Lab } from '../../../models/lab.model';

@Component({
  selector: 'app-medico-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './medico-dashboard.html',
  styleUrl: './medico-dashboard.css',
})
export class MedicoDashboard implements OnInit {
  currentUser: User | null = null;
  recentResults: Result[] = [];
  totalResults: number = 0;
  labs: Lab[] = [];

  constructor(
    private authService: AuthService,
    private resultService: ResultService,
    private labService: LabService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadData();
  }

  loadData(): void {
    this.labs = this.labService.getAll();
    const allResults = this.resultService.getAll();
    this.totalResults = allResults.length;
    this.recentResults = allResults.slice(0, 5);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
