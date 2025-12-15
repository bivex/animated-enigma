// BAD: Missing withComponentInputBinding anti-patterns
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// BAD: Component expecting route params as inputs without configuration
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
  // BAD: Signal inputs expecting route parameters
  userId = input.required<string>();
  userName = input<string>('');

  constructor() {
    // BAD: Component assumes route params will be bound to inputs
    effect(() => {
      console.log('User ID changed:', this.userId());
    });
  }
}

// BAD: Routes without withComponentInputBinding
export const badRoutes: Routes = [
  // BAD: Route to component with input bindings but no configuration
  {
    path: 'user/:id',
    component: UserDetailComponent
    // BAD: Missing withComponentInputBinding() in router config
  },

  // BAD: Route with query parameters expected as inputs
  {
    path: 'search',
    component: SearchComponent
    // BAD: No input binding configuration
  },

  // BAD: Child routes expecting input binding
  {
    path: 'parent/:parentId',
    component: ParentComponent,
    children: [
      {
        path: 'child/:childId',
        component: ChildComponent
        // BAD: Child component expects input binding but not configured
      }
    ]
  },

  // BAD: Lazy loaded component expecting input binding
  {
    path: 'lazy/:param',
    loadComponent: () => import('./lazy.component').then(m => m.LazyComponent)
    // BAD: No input binding for lazy loaded components
  }
];

// BAD: App module without input binding configuration
@NgModule({
  imports: [
    RouterModule.forRoot(badRoutes)
    // BAD: No withComponentInputBinding() provider
  ],
  declarations: [UserDetailComponent, SearchComponent, ParentComponent, ChildComponent]
})
export class BadAppModule { }

// BAD: Component with complex input binding expectations
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
  // BAD: Multiple signal inputs from route params
  query = input<string>('');
  filter = input<string>('all');
  page = input<number>(1);

  constructor() {
    effect(() => {
      // BAD: Component logic depends on route params as inputs
      this.performSearch(this.query(), this.filter(), this.page());
    });
  }

  private performSearch(query: string, filter: string, page: number) {
    // Search logic
  }
}

// BAD: Parent component expecting route params
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

// BAD: Child component expecting inherited route params
@Component({
  selector: 'app-child',
  template: `
    <div>
      <h2>Child: {{ childId() }}</h2>
      <p>Parent: {{ parentId() }}</p>
    </div>
  `,
  standalone: false
})
export class ChildComponent {
  childId = input.required<string>();
  parentId = input.required<string>(); // BAD: Trying to access parent route param
}

// BAD: Resolver that could be replaced by input binding
@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<User> {
  constructor(private userService: UserService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    const id = route.params['id'];
    // BAD: Resolver doing what input binding could handle
    return this.userService.getUser(id);
  }
}

// BAD: Route using resolver instead of input binding
export const resolverRoutes: Routes = [
  {
    path: 'user/:id',
    component: UserDetailResolverComponent,
    resolve: {
      user: UserResolver
    }
    // BAD: Using resolver when input binding would be simpler
  }
];

// BAD: Component using resolved data
@Component({
  selector: 'app-user-detail-resolver',
  template: `
    <div *ngIf="user">
      <h1>{{ user.name }}</h1>
    </div>
  `,
  standalone: false
})
export class UserDetailResolverComponent {
  // BAD: Component depends on resolved data instead of inputs
  @Input() user?: User;
}

// BAD: Guards trying to set component inputs manually
@Injectable({
  providedIn: 'root'
})
export class InputGuard implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // BAD: Guard trying to manually set component inputs
    // This won't work without withComponentInputBinding
    return true;
  }
}

// Import statements
import { Component, Injectable, Input } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { input, effect } from '@angular/core';

// Mock classes
class UserService { getUser(id: string) { return null as any; } }
interface User { name: string; }