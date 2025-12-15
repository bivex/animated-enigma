// GOOD: Proper routing guards with async handling and UrlTree returns
import { Injectable } from '@angular/core';
import {
  CanActivate, CanActivateChild, CanLoad,
  ActivatedRouteSnapshot, RouterStateSnapshot, Route,
  Router, UrlTree
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, switchMap, timeout } from 'rxjs/operators';

// GOOD: Functional auth guard with proper async handling
export const authGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  // GOOD: Return UrlTree for redirects instead of calling router.navigate()
  const router = inject(Router);

  return checkAuth().pipe(
    map(isAuthenticated => {
      if (!isAuthenticated) {
        // GOOD: Return UrlTree instead of side effect
        return router.createUrlTree(['/login'], {
          queryParams: { returnUrl: state.url }
        });
      }
      return true;
    }),
    catchError(error => {
      console.error('Auth check failed:', error);
      // GOOD: Handle errors gracefully
      return of(router.createUrlTree(['/error']));
    })
  );
};

// GOOD: Helper function for auth checking
function checkAuth(): Observable<boolean> {
  return new Observable(subscriber => {
    // GOOD: Proper async token validation
    const token = localStorage.getItem('token');

    if (!token) {
      subscriber.next(false);
      subscriber.complete();
      return;
    }

    // GOOD: Simulate token validation with timeout
    setTimeout(() => {
      try {
        // GOOD: Proper token validation logic
        const isValid = token.length > 10 && token.startsWith('valid_');
        subscriber.next(isValid);
        subscriber.complete();
      } catch (error) {
        subscriber.error(error);
      }
    }, 100);
  });
}

// GOOD: Role-based guard with proper error handling
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const requiredRole = route.data['role'];

    return this.checkUserRole(requiredRole).pipe(
      map(hasRole => {
        if (!hasRole) {
          // GOOD: Return UrlTree for unauthorized access
          return this.router.createUrlTree(['/unauthorized'], {
            queryParams: { required: requiredRole }
          });
        }
        return true;
      }),
      catchError(error => {
        console.error('Role check failed:', error);
        // GOOD: Error page redirect
        return of(this.router.createUrlTree(['/error'], {
          queryParams: { type: 'role-check-failed' }
        }));
      })
    );
  }

  // GOOD: Proper async role checking with error handling
  private checkUserRole(requiredRole: string): Observable<boolean> {
    return new Observable(subscriber => {
      setTimeout(() => {
        try {
          const userRole = localStorage.getItem('userRole');

          if (!userRole) {
            subscriber.next(false);
            subscriber.complete();
            return;
          }

          // GOOD: Proper role validation
          const hasAccess = userRole === requiredRole ||
                           (userRole === 'admin' && requiredRole !== 'super-admin');

          subscriber.next(hasAccess);
          subscriber.complete();
        } catch (error) {
          subscriber.error(new Error('Role validation failed'));
        }
      }, 150);
    });
  }
}

// GOOD: Complex guard with coordinated async operations
@Injectable({
  providedIn: 'root'
})
export class ComplexGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    // GOOD: Coordinated async operations
    return this.checkAuth().pipe(
      switchMap(authResult => {
        if (!authResult.authenticated) {
          return of(this.router.createUrlTree(['/login']));
        }

        // GOOD: Chain dependent checks
        return this.checkPermissions(route.data['permissions']).pipe(
          map(permissionsResult => {
            if (!permissionsResult.hasPermissions) {
              return this.router.createUrlTree(['/forbidden'], {
                queryParams: { missing: permissionsResult.missing.join(',') }
              });
            }
            return true;
          })
        );
      }),
      catchError(error => {
        console.error('Complex guard error:', error);
        return of(this.router.createUrlTree(['/error']));
      })
    );
  }

  // GOOD: Structured auth check result
  private checkAuth(): Observable<{ authenticated: boolean; userId?: string }> {
    return new Observable(subscriber => {
      setTimeout(() => {
        const token = localStorage.getItem('token');
        const authenticated = !!token && token.startsWith('valid_');

        subscriber.next({
          authenticated,
          userId: authenticated ? 'user123' : undefined
        });
        subscriber.complete();
      }, 100);
    });
  }

  // GOOD: Detailed permissions check
  private checkPermissions(requiredPermissions: string[]): Observable<{
    hasPermissions: boolean;
    missing: string[]
  }> {
    return new Observable(subscriber => {
      setTimeout(() => {
        try {
          const userPermissions = JSON.parse(localStorage.getItem('permissions') || '[]');
          const missing = requiredPermissions.filter(perm => !userPermissions.includes(perm));

          subscriber.next({
            hasPermissions: missing.length === 0,
            missing
          });
          subscriber.complete();
        } catch (error) {
          subscriber.error(new Error('Permissions check failed'));
        }
      }, 100);
    });
  }
}

// GOOD: Consistent guard pattern
@Injectable({
  providedIn: 'root'
})
export class ConsistentGuard implements CanActivate {
  constructor(private router: Router) {}

  // GOOD: Always return Observable<boolean | UrlTree>
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    // GOOD: Single return pattern for all cases
    return this.performCheck(route, state).pipe(
      map(result => {
        if (result.allowed) {
          return true;
        }
        return this.router.createUrlTree(result.redirectTo, result.queryParams);
      }),
      catchError(error => {
        console.error('Guard check failed:', error);
        return of(this.router.createUrlTree(['/error']));
      })
    );
  }

  // GOOD: Structured check result
  private performCheck(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<{ allowed: boolean; redirectTo?: string[]; queryParams?: any }> {

    return new Observable(subscriber => {
      setTimeout(() => {
        const result = {
          allowed: Math.random() > 0.3, // Simulate check
          redirectTo: ['/login'],
          queryParams: { returnUrl: state.url }
        };
        subscriber.next(result);
        subscriber.complete();
      }, 100);
    });
  }
}

// GOOD: CanActivateChild with proper delegation
@Injectable({
  providedIn: 'root'
})
export class ChildGuard implements CanActivateChild {
  constructor(private roleGuard: RoleGuard) {}

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> {

    // GOOD: Reuse parent guard logic for child routes
    return this.roleGuard.canActivate(childRoute, state);
  }
}

// GOOD: CanLoad guard with proper timeout and error handling
@Injectable({
  providedIn: 'root'
})
export class LoadGuard implements CanLoad {
  constructor(private router: Router) {}

  canLoad(route: Route): Observable<boolean | UrlTree> {
    // GOOD: Loading check with timeout and proper error handling
    return this.checkModuleLoad(route).pipe(
      timeout(5000), // GOOD: Prevent infinite loading
      catchError(error => {
        console.error('Module loading failed:', error);
        return of(this.router.createUrlTree(['/load-error'], {
          queryParams: { module: route.path }
        }));
      })
    );
  }

  private checkModuleLoad(route: Route): Observable<boolean> {
    return new Observable(subscriber => {
      // GOOD: Proper loading simulation with success/failure
      setTimeout(() => {
        const loadSuccess = Math.random() > 0.2; // 80% success rate
        subscriber.next(loadSuccess);
        subscriber.complete();
      }, 500);
    });
  }
}

// GOOD: Guard composition for multiple requirements
export const adminGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  const router = inject(Router);

  // GOOD: Combine multiple guard requirements
  return authGuard(route, state).pipe(
    switchMap(authResult => {
      if (authResult !== true) return of(authResult);

      // GOOD: Chain additional checks
      return roleGuard(route, state);
    })
  );
};

// GOOD: Helper functional guards
const roleGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  const router = inject(Router);
  const requiredRole = route.data['role'] || 'user';

  return new Observable(subscriber => {
    setTimeout(() => {
      const userRole = localStorage.getItem('userRole') || 'guest';
      const hasAccess = userRole === requiredRole || userRole === 'admin';

      if (hasAccess) {
        subscriber.next(true);
      } else {
        subscriber.next(router.createUrlTree(['/access-denied']));
      }
      subscriber.complete();
    }, 100);
  });
};