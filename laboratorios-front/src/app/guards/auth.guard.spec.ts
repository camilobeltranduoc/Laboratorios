import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('authGuard', () => {
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
    mockState = { url: '/dashboard' } as RouterStateSnapshot;
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should allow access when user is authenticated', () => {
    authService.login('admin@laboratorios.cl', 'Admin123!');

    const result = TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, mockState)
    );

    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should deny access when user is not authenticated', () => {
    const result = TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, mockState)
    );

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should deny access after logout', () => {
    authService.login('admin@laboratorios.cl', 'Admin123!');
    authService.logout();

    const result = TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, mockState)
    );

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should redirect to login page when access is denied', () => {
    TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(router.navigate).toHaveBeenCalledTimes(1);
  });

  it('should work with different user roles', () => {
    authService.login('medico@laboratorios.cl', 'Medico123!');

    const result = TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, mockState)
    );

    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should handle multiple guard checks', () => {
    const result1 = TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, mockState)
    );
    expect(result1).toBe(false);

    authService.login('admin@laboratorios.cl', 'Admin123!');

    const result2 = TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, mockState)
    );
    expect(result2).toBe(true);

    authService.logout();

    const result3 = TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, mockState)
    );
    expect(result3).toBe(false);
  });
});
