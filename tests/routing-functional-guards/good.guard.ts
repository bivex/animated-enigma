// GOOD: Functional guards instead of class-based guards
import {
  CanActivateFn, CanActivateChildFn, CanDeactivateFn, CanLoadFn,
  ActivatedRouteSnapshot, RouterStateSnapshot, Route,
  Router, UrlTree
} from '@angular/router';
import { Observable, of, map, switchMap } from 'rxjs';
import { inject } from '@angular/core';

// GOOD: Functional CanActivate guard
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  // GOOD: Inject dependencies at the function level
  const router = inject(Router);
  const authService = inject(AuthService);

  // GOOD: Return UrlTree for redirects instead of side effects
  return authService.isAuthenticated().pipe(
    map(isAuthenticated => {
      if (!isAuthenticated) {
        // GOOD: Return UrlTree instead of calling router.navigate()
        return router.createUrlTree(['/login'], {
          queryParams: { returnUrl: state.url }
        });
      }
      return true;
    })
  );
};

// GOOD: Functional CanActivateChild guard
export const childAuthGuard: CanActivateChildFn = (
  childRoute: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  // GOOD: Reuse logic from parent guard
  return authGuard(childRoute, state);
};

// GOOD: Functional CanDeactivate guard
export const unsavedChangesGuard: CanDeactivateFn<CanDeactivateComponent> = (
  component: CanDeactivateComponent,
  currentRoute: ActivatedRouteSnapshot,
  currentState: RouterStateSnapshot,
  nextState?: RouterStateSnapshot
): Observable<boolean> => {
  // GOOD: Pure function, no side effects
  if (component.hasUnsavedChanges()) {
    // GOOD: Let component handle user interaction
    return component.confirmLeave();
  }
  return of(true);
};

// GOOD: Functional CanLoad guard
export const moduleGuard: CanLoadFn = (
  route: Route
): Observable<boolean | UrlTree> => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // GOOD: Check authentication before loading module
  return authService.isAuthenticated().pipe(
    switchMap(isAuthenticated => {
      if (!isAuthenticated) {
        return of(router.createUrlTree(['/login']));
      }

      // GOOD: Additional role checking
      return authService.getCurrentUser().pipe(
        map(user => {
          const requiredRole = route.data?.['requiredRole'];
          if (requiredRole && user.role !== requiredRole) {
            return router.createUrlTree(['/unauthorized']);
          }
          return true;
        })
      );
    })
  );
};

// GOOD: Multiple related guards as separate functions
export const adminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.getCurrentUser().pipe(
    map(user => {
      if (user.role !== 'admin') {
        return router.createUrlTree(['/unauthorized']);
      }
      return true;
    })
  );
};

export const premiumGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  const router = inject(Router);
  const userService = inject(UserService);

  return userService.getCurrentUser().pipe(
    map(user => {
      if (!user.hasPremium) {
        return router.createUrlTree(['/upgrade']);
      }
      return true;
    })
  );
};

// GOOD: Combined guard function
export const combinedGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  // GOOD: Combine multiple checks in a single function
  return authGuard(route, state).pipe(
    switchMap(authResult => {
      if (authResult !== true) return of(authResult);

      return adminGuard(route, state);
    })
  );
};

// GOOD: Guard with minimal dependencies
export const simpleAuthGuard: CanActivateFn = (): boolean => {
  // GOOD: Simple synchronous check
  const token = localStorage.getItem('token');
  return !!token && token.length > 10;
};

// GOOD: Async guard with proper error handling
export const asyncAuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.validateToken().pipe(
    map(isValid => {
      if (!isValid) {
        return router.createUrlTree(['/login']);
      }
      return true;
    }),
    // GOOD: Error handling in guard
    catchError(error => {
      console.error('Auth validation failed:', error);
      return of(router.createUrlTree(['/error']));
    })
  );
};

// GOOD: Component interface for CanDeactivate
export interface CanDeactivateComponent {
  hasUnsavedChanges(): boolean;
  confirmLeave(): Observable<boolean>;
}

// GOOD: Component implementing the interface
@Component({
  selector: 'app-edit-form',
  template: '<form>...</form>',
  standalone: false
})
export class EditFormComponent implements CanDeactivateComponent {
  private hasChanges = false;

  hasUnsavedChanges(): boolean {
    // GOOD: Component manages its own state
    return this.hasChanges;
  }

  confirmLeave(): Observable<boolean> {
    // GOOD: Component handles user interaction
    return of(confirm('You have unsaved changes. Leave anyway?'));
  }

  onFormChange() {
    this.hasChanges = true;
  }
}

// GOOD: Routes using functional guards
export const goodRoutes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canLoad: [moduleGuard]
  },
  {
    path: 'edit',
    component: EditFormComponent,
    canDeactivate: [unsavedChangesGuard]
  },
  {
    path: 'premium',
    loadChildren: () => import('./premium/premium.module').then(m => m.PremiumModule),
    canActivate: [authGuard, premiumGuard]
  }
];

// GOOD: Testing-friendly guard functions
export const testableGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  authService = inject(AuthService),
  router = inject(Router)
): boolean | UrlTree => {
  // GOOD: Injectable dependencies for testing
  const isAuthenticated = authService.isAuthenticatedSync();

  if (!isAuthenticated) {
    return router.createUrlTree(['/login']);
  }

  return true;
};

// Import statements
import { Routes, Component } from '@angular/router';
import { catchError } from 'rxjs/operators';

// Mock services
class AuthService {
  isAuthenticated() { return of(true); }
  isAuthenticatedSync() { return true; }
  validateToken() { return of(true); }
  getCurrentUser() { return of({ id: 1, name: 'User', role: 'admin', hasPremium: true }); }
}

class UserService {
  getCurrentUser() { return of({ id: 1, name: 'User', hasPremium: true }); }
}