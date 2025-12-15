// BAD: Lazy loading mistakes anti-patterns
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// BAD: Module with lazy loading issues
@NgModule({
  imports: [RouterModule.forChild([])],
  exports: [RouterModule]
})
export class LazyFeatureModule { }

// BAD: Routes with lazy loading mistakes
export const badRoutes: Routes = [
  // BAD: Not using lazy loading for feature modules
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard.module').then(m => m.DashboardModule)
  },

  // BAD: Incorrect lazy loading syntax
  {
    path: 'users',
    loadChildren: './users.module#UsersModule' // OLD syntax, deprecated
  },

  // BAD: Lazy loading without error handling
  {
    path: 'reports',
    loadChildren: () => import('./reports.module').then(m => m.ReportsModule)
  },

  // BAD: Dynamic imports with incorrect paths
  {
    path: 'analytics',
    loadChildren: () => import('../features/analytics.module').then(m => m.AnalyticsModule)
  },

  // BAD: Lazy loading large modules that should be eager
  {
    path: 'critical',
    loadChildren: () => import('./critical-functionality.module').then(m => m.CriticalModule)
  },

  // BAD: Nested lazy loading creating waterfalls
  {
    path: 'nested',
    loadChildren: () => import('./parent.module').then(m => m.ParentModule),
    children: [
      {
        path: 'child',
        loadChildren: () => import('./child.module').then(m => m.ChildModule)
      }
    ]
  },

  // BAD: Lazy loading with preloading strategy issues
  {
    path: 'admin',
    loadChildren: () => import('./admin.module').then(m => m.AdminModule),
    data: { preload: false } // Non-standard data
  },

  // BAD: Mixing eager and lazy loading inconsistently
  {
    path: 'profile',
    component: () => import('./profile.component').then(m => m.ProfileComponent) // Wrong syntax
  },

  // BAD: Lazy loading without considering bundle size
  {
    path: 'heavy-chart',
    loadChildren: () => import('./heavy-chart.module').then(m => m.HeavyChartModule)
  },

  // BAD: No route guards on lazy loaded routes
  {
    path: 'secure',
    loadChildren: () => import('./secure.module').then(m => m.SecureModule)
    // BAD: No canLoad or canActivate guards
  }
];

// BAD: App routing module with lazy loading issues
@NgModule({
  imports: [
    RouterModule.forRoot(badRoutes, {
      // BAD: No preloading strategy configured
    })
  ],
  exports: [RouterModule]
})
export class BadAppRoutingModule { }

// BAD: Preloading strategy that defeats lazy loading
export class AggressivePreloadAllStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // BAD: Preloads everything, defeating lazy loading purpose
    return load();
  }
}

// BAD: Incorrect lazy loading in feature modules
@NgModule({
  imports: [
    RouterModule.forChild([
      // BAD: Feature module with its own lazy loading (creates nested chunks)
      {
        path: 'sub-feature',
        loadChildren: () => import('./sub-feature.module').then(m => m.SubFeatureModule)
      }
    ])
  ]
})
export class BadFeatureRoutingModule { }

// BAD: Lazy loading with memory leaks
export class LeakyLazyService {
  private subscriptions: Subscription[] = [];

  loadData() {
    // BAD: Creating subscriptions in lazy loaded service without cleanup
    const sub = this.http.get('/api/data').subscribe(data => {
      // Handle data
    });
    this.subscriptions.push(sub);
  }

  // BAD: No ngOnDestroy to clean up subscriptions
}

// BAD: Bundle splitting that creates too many small chunks
export const microRoutes: Routes = [
  // BAD: Too many small lazy chunks
  { path: 'button', loadChildren: () => import('./button.module').then(m => m.ButtonModule) },
  { path: 'input', loadChildren: () => import('./input.module').then(m => m.InputModule) },
  { path: 'modal', loadChildren: () => import('./modal.module').then(m => m.ModalModule) },
  { path: 'dropdown', loadChildren: () => import('./dropdown.module').then(m => m.DropdownModule) },
  // ... many more small components
];

// BAD: Lazy loading with circular dependencies
export const circularRoutes: Routes = [
  {
    path: 'module-a',
    loadChildren: () => import('./module-a').then(m => m.ModuleAModule)
  },
  {
    path: 'module-b',
    loadChildren: () => import('./module-b').then(m => m.ModuleBModule)
  }
];

// Inside module-a.ts - BAD: Importing from module-b creates circular dependency
// import { ModuleBService } from '../module-b/module-b.service';

// Inside module-b.ts - BAD: Importing from module-a creates circular dependency
// import { ModuleAService } from '../module-a/module-a.service';

// Import statements for missing types
import { PreloadingStrategy, Route, Observable, Subscription } from '@angular/router';
import { HttpClient } from '@angular/common/http';