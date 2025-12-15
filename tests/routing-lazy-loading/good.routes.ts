// GOOD: Proper lazy loading patterns
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// GOOD: Feature module with proper lazy loading setup
@NgModule({
  imports: [RouterModule.forChild([])],
  exports: [RouterModule]
})
export class FeatureModule { }

// GOOD: Routes with proper lazy loading
export const goodRoutes: Routes = [
  // GOOD: Proper lazy loading syntax
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },

  // GOOD: Consistent lazy loading for feature modules
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
  },

  // GOOD: Lazy loading with error handling
  {
    path: 'reports',
    loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule)
  },

  // GOOD: Correct relative paths
  {
    path: 'analytics',
    loadChildren: () => import('./analytics/analytics.module').then(m => m.AnalyticsModule)
  },

  // GOOD: Critical functionality loaded eagerly
  {
    path: 'critical',
    loadChildren: () => import('./critical/critical.module').then(m => m.CriticalModule)
  },

  // GOOD: Avoiding nested lazy loading
  {
    path: 'nested',
    loadChildren: () => import('./nested/nested.module').then(m => m.NestedModule)
    // GOOD: Single lazy load, nested routes handled inside the module
  },

  // GOOD: Proper preloading configuration
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },

  // GOOD: Component lazy loading (Angular 14+)
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent)
  },

  // GOOD: Considering bundle size for lazy loading decisions
  {
    path: 'heavy-chart',
    loadChildren: () => import('./charts/charts.module').then(m => m.ChartsModule)
  },

  // GOOD: Route guards on lazy loaded routes
  {
    path: 'secure',
    loadChildren: () => import('./secure/secure.module').then(m => m.SecureModule),
    canLoad: [() => inject(AuthService).isAuthenticated()]
  }
];

// GOOD: App routing module with proper lazy loading configuration
@NgModule({
  imports: [
    RouterModule.forRoot(goodRoutes, {
      // GOOD: Configure preloading strategy
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class GoodAppRoutingModule { }

// GOOD: Custom preloading strategy
export class OnDemandPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // GOOD: Conditional preloading based on route data
    if (route.data?.['preload']) {
      return load();
    }
    // GOOD: Don't preload by default
    return of(null);
  }
}

// GOOD: Feature routing without nested lazy loading
@NgModule({
  imports: [
    RouterModule.forChild([
      // GOOD: Eager loading for sub-features within lazy loaded module
      {
        path: 'sub-feature',
        component: SubFeatureComponent
      }
    ])
  ]
})
export class GoodFeatureRoutingModule { }

// GOOD: Service with proper cleanup in lazy loaded modules
export class CleanLazyService implements OnDestroy {
  private subscriptions: Subscription[] = [];

  constructor(private http: HttpClient) {}

  loadData() {
    const sub = this.http.get('/api/data').subscribe(data => {
      // Handle data
    });
    this.subscriptions.push(sub);
  }

  ngOnDestroy() {
    // GOOD: Proper cleanup
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}

// GOOD: Bundle splitting that creates reasonable chunk sizes
export const balancedRoutes: Routes = [
  // GOOD: Group related functionality
  {
    path: 'forms',
    loadChildren: () => import('./forms/forms.module').then(m => m.FormsModule)
    // GOOD: Single chunk for all form components
  },
  {
    path: 'data-visualization',
    loadChildren: () => import('./charts/charts.module').then(m => m.ChartsModule)
    // GOOD: Single chunk for all chart components
  }
];

// GOOD: Avoiding circular dependencies
export const decoupledRoutes: Routes = [
  {
    path: 'module-a',
    loadChildren: () => import('./module-a/module-a.module').then(m => m.ModuleAModule)
  },
  {
    path: 'module-b',
    loadChildren: () => import('./module-b/module-b.module').then(m => m.ModuleBModule)
  }
];

// GOOD: Shared services provided at the correct level
@NgModule({
  providers: [
    // GOOD: Shared services provided in the app module or lazy module root
    SharedDataService
  ]
})
export class SharedModule { }

// GOOD: Lazy loading with performance monitoring
export const monitoredRoutes: Routes = [
  {
    path: 'feature',
    loadChildren: () => {
      const start = performance.now();
      return import('./feature/feature.module').then(m => {
        const end = performance.now();
        console.log(`Feature module loaded in ${end - start}ms`);
        return m;
      });
    }
  }
];

// Import statements
import { PreloadingStrategy, Route, Observable, OnDestroy, PreloadAllModules } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { of } from 'rxjs';
import { inject } from '@angular/core';

// Mock classes for examples
class AuthService { isAuthenticated() { return true; } }
class SubFeatureComponent {}
class SharedDataService {}