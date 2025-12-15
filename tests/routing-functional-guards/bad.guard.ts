// BAD: Class-based guards instead of functional guards anti-patterns
import { Injectable } from '@angular/core';
import {
  CanActivate, CanActivateChild, CanDeactivate, CanLoad,
  ActivatedRouteSnapshot, RouterStateSnapshot, Route,
  Router, UrlTree
} from '@angular/router';
import { Observable, of } from 'rxjs';

// BAD: Class-based CanActivate guard (deprecated pattern)
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  // BAD: Class-based guard implementation
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // BAD: Complex logic in class guard
    const token = localStorage.getItem('token');

    if (!token) {
      // BAD: Direct navigation in guard
      this.router.navigate(['/login']);
      return false;
    }

    // BAD: Synchronous check for async operation
    return this.validateToken(token);
  }

  // BAD: Private method in guard class
  private validateToken(token: string): boolean {
    // Simulate token validation
    return token.length > 10;
  }
}

// BAD: Class-based CanActivateChild guard
@Injectable({
  providedIn: 'root'
})
export class ChildAuthGuard implements CanActivateChild {
  constructor(private router: Router) {}

  // BAD: Duplicate logic from parent guard
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // BAD: Code duplication
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}

// BAD: Class-based CanDeactivate guard with complex logic
@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesGuard implements CanDeactivate<unknown> {
  // BAD: Generic type, complex logic in class
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // BAD: Complex logic in guard class
    const hasUnsavedChanges = this.checkForUnsavedChanges(component);

    if (hasUnsavedChanges) {
      // BAD: Side effect in guard
      const shouldLeave = confirm('You have unsaved changes. Leave anyway?');
      return shouldLeave;
    }

    return true;
  }

  // BAD: Private method doing complex checks
  private checkForUnsavedChanges(component: unknown): boolean {
    // Complex logic to check component state
    return Math.random() > 0.5; // Simulate check
  }
}

// BAD: Class-based CanLoad guard
@Injectable({
  providedIn: 'root'
})
export class ModuleGuard implements CanLoad {
  constructor(private router: Router) {}

  // BAD: Class-based load guard
  canLoad(route: Route): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // BAD: Loading check logic in class
    const userRole = localStorage.getItem('userRole');

    if (!userRole) {
      this.router.navigate(['/login']);
      return false;
    }

    // BAD: Role checking in guard class
    return this.checkRoleAccess(userRole, route.data?.['requiredRole']);
  }

  // BAD: Private method for role checking
  private checkRoleAccess(userRole: string, requiredRole?: string): boolean {
    if (!requiredRole) return true;
    return userRole === requiredRole;
  }
}

// BAD: Multiple guards in one class
@Injectable({
  providedIn: 'root'
})
export class CombinedGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private router: Router) {}

  // BAD: Multiple guard interfaces in one class
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkAccess();
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkAccess();
  }

  canLoad(route: Route): boolean {
    return this.checkAccess();
  }

  // BAD: Shared logic in private method
  private checkAccess(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}

// BAD: Guard with dependencies that complicate testing
@Injectable({
  providedIn: 'root'
})
export class ComplexGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  // BAD: Many dependencies making testing hard
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // BAD: Complex async logic in class guard
    return this.authService.isAuthenticated().pipe(
      switchMap(isAuth => {
        if (!isAuth) {
          this.notificationService.showError('Not authenticated');
          this.router.navigate(['/login']);
          return of(false);
        }

        return this.userService.getCurrentUser().pipe(
          map(user => {
            if (!user) {
              this.router.navigate(['/login']);
              return false;
            }
            return true;
          })
        );
      })
    );
  }
}

// BAD: Guard with side effects
@Injectable({
  providedIn: 'root'
})
export class SideEffectGuard implements CanActivate {
  constructor(private analyticsService: AnalyticsService) {}

  // BAD: Side effects in guard
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // BAD: Analytics tracking in guard
    this.analyticsService.trackRouteAccess(route.routeConfig?.path || '');

    // BAD: State mutation in guard
    this.updateLastAccessTime();

    return true;
  }

  // BAD: Private methods doing side effects
  private updateLastAccessTime(): void {
    localStorage.setItem('lastAccess', new Date().toISOString());
  }
}

// Import statements for missing dependencies
import { switchMap, map } from 'rxjs/operators';

// Mock services
class AuthService {
  isAuthenticated() { return of(true); }
}

class UserService {
  getCurrentUser() { return of({ id: 1, name: 'User' }); }
}

class NotificationService {
  showError(message: string) {}
}

class AnalyticsService {
  trackRouteAccess(path: string) {}
}