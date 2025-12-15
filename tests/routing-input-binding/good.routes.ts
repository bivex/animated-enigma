// GOOD: Proper withComponentInputBinding usage patterns
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// GOOD: Component with signal inputs for route parameters
@Component({
  selector: 'app-user-detail',
  template: `
    <div>
      <h1>User: {{ userId() }}</h1>
      <p>Name: {{ userName() }}</p>
    </div>
  `,
  standalone: false
})
export class UserDetailComponent {
  // GOOD: Signal inputs for route parameters
  userId = input.required<string>();
  userName = input<string>('');

  constructor() {
    effect(() => {
      console.log('User ID changed:', this.userId());
    });
  }
}

// GOOD: Routes with withComponentInputBinding configured
export const goodRoutes: Routes = [
  // GOOD: Route with input binding enabled
  {
    path: 'user/:id',
    component: UserDetailComponent
  },

  // GOOD: Route with query parameters as inputs
  {
    path: 'search',
    component: SearchComponent
  },

  // GOOD: Child routes with input binding
  {
    path: 'parent/:parentId',
    component: ParentComponent,
    children: [
      {
        path: 'child/:childId',
        component: ChildComponent
      }
    ]
  },

  // GOOD: Lazy loaded component with input binding
  {
    path: 'lazy/:param',
    loadComponent: () => import('./lazy.component').then(m => m.LazyComponent)
  }
];

// GOOD: App module with withComponentInputBinding configuration
@NgModule({
  imports: [
    RouterModule.forRoot(goodRoutes, {
      // GOOD: Enable component input binding
      bindToComponentInputs: true
    })
  ],
  declarations: [UserDetailComponent, SearchComponent, ParentComponent, ChildComponent]
})
export class GoodAppModule { }

// GOOD: Component with multiple input bindings
@Component({
  selector: 'app-search',
  template: `
    <div>
      <h2>Search: {{ query() }}</h2>
      <p>Filter: {{ filter() }}</p>
      <p>Page: {{ page() }}</p>
    </div>
  `,
  standalone: false
})
export class SearchComponent {
  // GOOD: Multiple signal inputs from route params and query params
  query = input<string>('');
  filter = input<string>('all');
  page = input<number>(1);

  constructor() {
    effect(() => {
      this.performSearch(this.query(), this.filter(), this.page());
    });
  }

  private performSearch(query: string, filter: string, page: number) {
    // Search logic
  }
}

// GOOD: Parent component with route param input
@Component({
  selector: 'app-parent',
  template: `
    <div>
      <h1>Parent: {{ parentId() }}</h1>
      <router-outlet></router-outlet>
    </div>
  `,
  standalone: false
})
export class ParentComponent {
  parentId = input.required<string>();
}

// GOOD: Child component with its own route param input
@Component({
  selector: 'app-child',
  template: `
    <div>
      <h2>Child: {{ childId() }}</h2>
      <p>In parent: {{ parentId() }}</p>
    </div>
  `,
  standalone: false
})
export class ChildComponent {
  childId = input.required<string>();
  // GOOD: Child gets its own route params, not parent params
}

// GOOD: When to use resolvers vs input binding
@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<User> {
  constructor(private userService: UserService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    const id = route.params['id'];
    // GOOD: Use resolver when you need data transformation or complex logic
    return this.userService.getUser(id);
  }
}

// GOOD: Route using both input binding and resolver appropriately
export const hybridRoutes: Routes = [
  {
    path: 'user/:id',
    component: UserDetailHybridComponent,
    resolve: {
      // GOOD: Resolver for complex data
      user: UserResolver
    }
    // GOOD: Input binding handles the ID parameter
  }
];

// GOOD: Component using both resolved data and input binding
@Component({
  selector: 'app-user-detail-hybrid',
  template: `
    <div *ngIf="user">
      <h1>{{ user.name }}</h1>
      <p>ID from input: {{ userId() }}</p>
    </div>
  `,
  standalone: false
})
export class UserDetailHybridComponent {
  // GOOD: Input binding for simple parameters
  userId = input.required<string>();

  // GOOD: Inject resolved data when needed
  private route = inject(ActivatedRoute);

  get user(): User | undefined {
    return this.route.snapshot.data['user'];
  }
}

// GOOD: Guards work normally with input binding
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // GOOD: Guards work independently of input binding
    return this.authService.isAuthenticated();
  }
}

// GOOD: Route with guard and input binding
export const guardedRoutes: Routes = [
  {
    path: 'protected/:id',
    component: ProtectedComponent,
    canActivate: [AuthGuard]
    // GOOD: Guard protects route, input binding passes params
  }
];

// GOOD: Component with optional route parameters
@Component({
  selector: 'app-optional-params',
  template: `
    <div>
      <h1>Item: {{ itemId() || 'No ID' }}</h1>
      <p>Mode: {{ mode() || 'default' }}</p>
    </div>
  `,
  standalone: false
})
export class OptionalParamsComponent {
  // GOOD: Optional route parameters
  itemId = input<string>();
  mode = input<string>('default');
}

// GOOD: Routes with optional parameters
export const optionalRoutes: Routes = [
  {
    path: 'item/:itemId',
    component: OptionalParamsComponent
  },
  {
    path: 'item/:itemId/mode/:mode',
    component: OptionalParamsComponent
  }
];

// Import statements
import { Component, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { input, effect, inject } from '@angular/core';

// Mock classes
class UserService { getUser(id: string) { return null as any; } }
interface User { name: string; }
class AuthService { isAuthenticated() { return of(true); } }
class ProtectedComponent {}