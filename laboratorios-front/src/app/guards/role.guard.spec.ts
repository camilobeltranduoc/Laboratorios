import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { roleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('roleGuard', () => {
  let authService: AuthService;
  let router: Router;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate')
          }
        }
      ]
    });

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/admin/dashboard' } as RouterStateSnapshot;
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should allow access when user has required role', () => {
    authService.login('admin@laboratorios.cl', 'Admin123!');

    const guard = roleGuard(['ADMINISTRADOR']);
    const result = TestBed.runInInjectionContext(() =>
      guard(mockRoute, mockState)
    );

    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should deny access when user does not have required role', () => {
    authService.login('paciente@laboratorios.cl', 'Paciente123!');

    const guard = roleGuard(['ADMINISTRADOR']);
    const result = TestBed.runInInjectionContext(() =>
      guard(mockRoute, mockState)
    );

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/unauthorized']);
  });

  it('should deny access when user is not logged in', () => {
    const guard = roleGuard(['ADMINISTRADOR']);
    const result = TestBed.runInInjectionContext(() =>
      guard(mockRoute, mockState)
    );

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/unauthorized']);
  });

  it('should allow access when user role is in allowed roles list', () => {
    authService.login('medico@laboratorios.cl', 'Medico123!');

    const guard = roleGuard(['ADMINISTRADOR', 'MEDICO', 'LABORATORISTA']);
    const result = TestBed.runInInjectionContext(() =>
      guard(mockRoute, mockState)
    );

    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should work with single role in allowed list', () => {
    authService.login('medico@laboratorios.cl', 'Medico123!');

    const guard = roleGuard(['MEDICO']);
    const result = TestBed.runInInjectionContext(() =>
      guard(mockRoute, mockState)
    );

    expect(result).toBe(true);
  });

  it('should handle ADMINISTRADOR role correctly', () => {
    authService.login('admin@laboratorios.cl', 'Admin123!');

    const adminGuard = roleGuard(['ADMINISTRADOR']);
    const medicoGuard = roleGuard(['MEDICO']);

    const adminResult = TestBed.runInInjectionContext(() =>
      adminGuard(mockRoute, mockState)
    );
    const medicoResult = TestBed.runInInjectionContext(() =>
      medicoGuard(mockRoute, mockState)
    );

    expect(adminResult).toBe(true);
    expect(medicoResult).toBe(false);
  });

  it('should handle MEDICO role correctly', () => {
    authService.login('medico@laboratorios.cl', 'Medico123!');

    const medicoGuard = roleGuard(['MEDICO']);
    const adminGuard = roleGuard(['ADMINISTRADOR']);

    const medicoResult = TestBed.runInInjectionContext(() =>
      medicoGuard(mockRoute, mockState)
    );
    const adminResult = TestBed.runInInjectionContext(() =>
      adminGuard(mockRoute, mockState)
    );

    expect(medicoResult).toBe(true);
    expect(adminResult).toBe(false);
  });

  it('should handle PACIENTE role correctly', () => {
    authService.login('paciente@laboratorios.cl', 'Paciente123!');

    const pacienteGuard = roleGuard(['PACIENTE']);
    const medicoGuard = roleGuard(['MEDICO']);

    const pacienteResult = TestBed.runInInjectionContext(() =>
      pacienteGuard(mockRoute, mockState)
    );
    const medicoResult = TestBed.runInInjectionContext(() =>
      medicoGuard(mockRoute, mockState)
    );

    expect(pacienteResult).toBe(true);
    expect(medicoResult).toBe(false);
  });

  it('should handle LABORATORISTA role correctly', () => {
    authService.login('laboratorista@laboratorios.cl', 'Laboratorista123!');

    const labGuard = roleGuard(['LABORATORISTA']);
    const adminGuard = roleGuard(['ADMINISTRADOR']);

    const labResult = TestBed.runInInjectionContext(() =>
      labGuard(mockRoute, mockState)
    );
    const adminResult = TestBed.runInInjectionContext(() =>
      adminGuard(mockRoute, mockState)
    );

    expect(labResult).toBe(true);
    expect(adminResult).toBe(false);
  });

  it('should redirect to unauthorized page when access is denied', () => {
    authService.login('paciente@laboratorios.cl', 'Paciente123!');

    const guard = roleGuard(['ADMINISTRADOR']);
    TestBed.runInInjectionContext(() => guard(mockRoute, mockState));

    expect(router.navigate).toHaveBeenCalledWith(['/unauthorized']);
    expect(router.navigate).toHaveBeenCalledTimes(1);
  });

  it('should work with multiple allowed roles', () => {
    authService.login('medico@laboratorios.cl', 'Medico123!');

    const guard = roleGuard(['ADMINISTRADOR', 'MEDICO', 'LABORATORISTA']);
    const result = TestBed.runInInjectionContext(() =>
      guard(mockRoute, mockState)
    );

    expect(result).toBe(true);
  });

  it('should handle role changes after login', () => {
    authService.login('admin@laboratorios.cl', 'Admin123!');

    const adminGuard = roleGuard(['ADMINISTRADOR']);
    const result1 = TestBed.runInInjectionContext(() =>
      adminGuard(mockRoute, mockState)
    );
    expect(result1).toBe(true);

    authService.logout();
    authService.login('paciente@laboratorios.cl', 'Paciente123!');

    const result2 = TestBed.runInInjectionContext(() =>
      adminGuard(mockRoute, mockState)
    );
    expect(result2).toBe(false);
  });

  it('should deny access to all roles when user is logged out', () => {
    authService.login('admin@laboratorios.cl', 'Admin123!');
    authService.logout();

    const guard = roleGuard(['ADMINISTRADOR']);
    const result = TestBed.runInInjectionContext(() =>
      guard(mockRoute, mockState)
    );

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/unauthorized']);
  });
});
