// BAD: Routing guards with improper async handling and router.navigate() misuse
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// BAD: Synchronous guard that should be async
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  // BAD: Synchronous method for async operation - blocks navigation
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log('Checking auth synchronously...');

    // BAD: Blocking synchronous check
    const token = localStorage.getItem('token');
    if (!token) {
      // BAD: Using router.navigate() in guard - wrong pattern
      this.router.navigate(['/login']);
      return false;
    }

    // BAD: No token validation - just checking existence
    return true;
  }
}

// BAD: Async guard without proper error handling
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  // BAD: Returns Observable<boolean> but doesn't handle errors properly
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const requiredRole = route.data['role'];

    // BAD: No error handling in the observable chain
    return this.checkUserRole(requiredRole);
  }

  // BAD: Method that can throw errors without proper handling
  private checkUserRole(requiredRole: string): Observable<boolean> {
    // Simulate API call that can fail
    return new Observable(subscriber => {
      setTimeout(() => {
        const userRole = localStorage.getItem('userRole');

        if (!userRole) {
          // BAD: Throwing error instead of proper navigation
          subscriber.error(new Error('No role found'));
          return;
        }

        const hasAccess = userRole === requiredRole;
        if (!hasAccess) {
          // BAD: Using router.navigate() instead of returning UrlTree
          this.router.navigate(['/unauthorized']);
        }

        subscriber.next(hasAccess);
        subscriber.complete();
      }, 100);
    });
  }
}

// BAD: Complex guard with multiple issues
@Injectable({
  providedIn: 'root'
})
export class ComplexGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // BAD: Multiple async operations without proper coordination
    return this.checkAuth().pipe(
      map(authResult => {
        if (!authResult) {
          // BAD: Side effect in map
          this.router.navigate(['/login']);
          return false;
        }

        // BAD: Nested async call in map
        return this.checkPermissions(route.data['permissions']);
      }),
      // BAD: Improper error handling
      catchError(error => {
        console.error('Guard error:', error);
        this.router.navigate(['/error']);
        return of(false);
      })
    );
  }

  // BAD: Methods that can fail without proper error boundaries
  private checkAuth(): Observable<boolean> {
    return new Observable(subscriber => {
      // Simulate network failure
      setTimeout(() => {
        const token = localStorage.getItem('token');
        subscriber.next(!!token);
        subscriber.complete();
      }, 200);
    });
  }

  // BAD: Another method with potential failures
  private checkPermissions(requiredPermissions: string[]): boolean {
    const userPermissions = JSON.parse(localStorage.getItem('permissions') || '[]');

    // BAD: Synchronous check that could fail
    return requiredPermissions.every(perm => userPermissions.includes(perm));
  }
}

// BAD: Guard that mixes sync and async operations incorrectly
@Injectable({
  providedIn: 'root'
})
export class MixedGuard implements CanActivate {
  constructor(private router: Router) {}

  // BAD: Declares as Observable<boolean> but sometimes returns boolean
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    // BAD: Conditional return types - breaks type safety
    if (route.data['skipAuth']) {
      return true; // Synchronous
    }

    // BAD: Async path
    return this.performAsyncCheck();
  }

  private performAsyncCheck(): Observable<boolean> {
    return new Observable(subscriber => {
      // BAD: Inconsistent error handling
      setTimeout(() => {
        try {
          const result = Math.random() > 0.5; // Random success/failure
          if (!result) {
            // BAD: Inconsistent navigation pattern
            this.router.navigate(['/access-denied']);
          }
          subscriber.next(result);
          subscriber.complete();
        } catch (error) {
          // BAD: Generic error handling
          subscriber.error(error);
        }
      }, 150);
    });
  }
}

// BAD: CanActivateChild guard with issues
@Injectable({
  providedIn: 'root'
})
export class ChildGuard implements CanActivateChild {
  constructor(private router: Router) {}

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // BAD: Duplicate logic from parent guard
    const token = localStorage.getItem('token');
    if (!token) {
      // BAD: Direct navigation instead of UrlTree
      this.router.navigate(['/login']);
      return of(false);
    }

    // BAD: No specific child route validation
    return of(true);
  }
}

// BAD: CanLoad guard with improper async handling
@Injectable({
  providedIn: 'root'
})
export class LoadGuard implements CanLoad {
  constructor(private router: Router) {}

  canLoad(route: Route): Observable<boolean> {
    // BAD: Loading check without proper error boundaries
    return new Observable(subscriber => {
      // BAD: No timeout handling
      const check = () => {
        const isModuleLoaded = Math.random() > 0.3; // Simulate loading

        if (isModuleLoaded) {
          subscriber.next(true);
          subscriber.complete();
        } else {
          // BAD: Infinite retry without proper error handling
          setTimeout(check, 100);
        }
      };

      check();
    });
  }
}

// BAD: Multiple guards with conflicting navigation patterns
@Injectable({
  providedIn: 'root'
})
export class ConflictingGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // BAD: Guard that navigates but also returns false
    const hasAccess = this.checkAccess();

    if (!hasAccess) {
      // BAD: Both navigating AND returning false - race condition
      this.router.navigate(['/forbidden']);
      return of(false);
    }

    return of(true);
  }

  // BAD: Method that could fail
  private checkAccess(): boolean {
    // Simulate complex access check
    return localStorage.getItem('accessLevel') === 'admin';
  }
}