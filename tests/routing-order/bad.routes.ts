// BAD: Route configuration order issues anti-patterns
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// BAD: Routes with order issues that cause incorrect matching
export const badRoutes: Routes = [
  // BAD: Specific routes after generic catch-all routes
  {
    path: 'user/:id',
    component: UserDetailComponent
  },
  {
    path: '**',  // BAD: Catch-all before specific routes
    component: NotFoundComponent
  },

  // BAD: Static routes after parameterized routes
  {
    path: 'product/:category/:id',
    component: ProductDetailComponent
  },
  {
    path: 'product/new',  // BAD: This will never match due to order
    component: NewProductComponent
  },

  // BAD: Child routes in wrong order
  {
    path: 'admin',
    children: [
      {
        path: ':id',
        component: AdminDetailComponent
      },
      {
        path: 'list',  // BAD: Parameterized route before specific
        component: AdminListComponent
      }
    ]
  },

  // BAD: Redirect routes in wrong position
  {
    path: 'old-path',
    redirectTo: '/new-path'
  },
  {
    path: 'old-path/settings',  // BAD: More specific after redirect
    component: SettingsComponent
  },

  // BAD: Wildcard routes mixed with other routes
  {
    path: 'api/:endpoint',
    component: ApiComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  },
  {
    path: 'api/help',  // BAD: This comes after wildcard
    component: HelpComponent
  },

  // BAD: Route guards affecting order
  {
    path: 'protected/:action',
    component: ProtectedComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'protected/login',  // BAD: Specific route after parameterized
    component: LoginComponent
  },

  // BAD: Lazy loaded routes with order issues
  {
    path: 'feature/:param',
    loadChildren: () => import('./feature.module').then(m => m.FeatureModule)
  },
  {
    path: 'feature/special',  // BAD: Specific after parameterized
    component: SpecialFeatureComponent
  },

  // BAD: Empty path routes in wrong order
  {
    path: 'dashboard/:tab',
    component: DashboardComponent
  },
  {
    path: '',  // BAD: Default route after parameterized
    component: HomeComponent
  },

  // BAD: Auxiliary routes with order issues
  {
    path: 'main',
    component: MainComponent,
    children: [
      {
        path: 'aux/:id',
        component: AuxDetailComponent,
        outlet: 'aux'
      },
      {
        path: 'aux/list',  // BAD: Specific after parameterized
        component: AuxListComponent,
        outlet: 'aux'
      }
    ]
  },

  // BAD: Routes with query parameters affecting order
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: 'search/:query',  // BAD: This should come first
    component: SearchResultsComponent
  },

  // BAD: Multiple redirects causing confusion
  {
    path: 'v1/api',
    redirectTo: '/api'
  },
  {
    path: 'v1/api/users',
    redirectTo: '/api/users'  // BAD: More specific redirect after general
  },
  {
    path: 'v1/api/users/:id',
    component: UserDetailComponent  // BAD: This will never match
  }
];

// BAD: Module with routing issues
@NgModule({
  imports: [
    RouterModule.forRoot(badRoutes)
  ],
  exports: [RouterModule]
})
export class BadRoutingModule { }

// BAD: Feature module with route order issues
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'item/:type/:id',
        component: ItemDetailComponent
      },
      {
        path: 'item/create',  // BAD: Specific route after parameterized
        component: CreateItemComponent
      },
      {
        path: 'item',  // BAD: Generic route after specific
        component: ItemListComponent
      }
    ])
  ]
})
export class BadFeatureRoutingModule { }

// BAD: Routes with conflicting path patterns
export const conflictingRoutes: Routes = [
  // BAD: These patterns can conflict
  {
    path: 'resource/:id',
    component: ResourceComponent
  },
  {
    path: 'resource/create',  // BAD: Can be mistaken for :id = 'create'
    component: CreateResourceComponent
  },
  {
    path: 'resource/:action',  // BAD: Conflicts with :id pattern
    component: ResourceActionComponent
  }
];

// BAD: Routes with optional parameters in wrong order
export const optionalParamRoutes: Routes = [
  {
    path: 'filter/:category/:subcategory',
    component: FilterComponent
  },
  {
    path: 'filter/:category',  // BAD: Should come after more specific routes
    component: CategoryFilterComponent
  },
  {
    path: 'filter',
    component: AllFilterComponent
  }
];

// Mock components for examples
class UserDetailComponent {}
class NotFoundComponent {}
class ProductDetailComponent {}
class NewProductComponent {}
class AdminDetailComponent {}
class AdminListComponent {}
class SettingsComponent {}
class ApiComponent {}
class HelpComponent {}
class ProtectedComponent {}
class LoginComponent {}
class SpecialFeatureComponent {}
class HomeComponent {}
class DashboardComponent {}
class MainComponent {}
class AuxDetailComponent {}
class AuxListComponent {}
class SearchComponent {}
class SearchResultsComponent {}
class ItemDetailComponent {}
class CreateItemComponent {}
class ItemListComponent {}
class ResourceComponent {}
class CreateResourceComponent {}
class ResourceActionComponent {}
class FilterComponent {}
class CategoryFilterComponent {}
class AllFilterComponent {}

// Mock guard
class AuthGuard {}