// GOOD: Proper route configuration order patterns
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// GOOD: Routes with correct order - specific before generic
export const goodRoutes: Routes = [
  // GOOD: Specific routes before catch-all
  {
    path: 'user/:id',
    component: UserDetailComponent
  },
  {
    path: '**',  // GOOD: Catch-all at the end
    component: NotFoundComponent
  },

  // GOOD: Static routes before parameterized routes
  {
    path: 'product/new',  // GOOD: Specific route first
    component: NewProductComponent
  },
  {
    path: 'product/:category/:id',  // GOOD: Parameterized after specific
    component: ProductDetailComponent
  },

  // GOOD: Child routes in correct order
  {
    path: 'admin',
    children: [
      {
        path: 'list',  // GOOD: Specific routes first
        component: AdminListComponent
      },
      {
        path: ':id',  // GOOD: Parameterized route after specific
        component: AdminDetailComponent
      }
    ]
  },

  // GOOD: Redirect routes in correct position
  {
    path: 'old-path/settings',  // GOOD: More specific first
    component: SettingsComponent
  },
  {
    path: 'old-path',  // GOOD: General redirect after specific
    redirectTo: '/new-path'
  },

  // GOOD: All routes before wildcard
  {
    path: 'api/help',  // GOOD: Specific API route
    component: HelpComponent
  },
  {
    path: 'api/:endpoint',  // GOOD: Parameterized API route
    component: ApiComponent
  },
  {
    path: '**',  // GOOD: Wildcard at the end
    component: NotFoundComponent
  },

  // GOOD: Route guards with proper order
  {
    path: 'protected/login',  // GOOD: Specific route first
    component: LoginComponent
  },
  {
    path: 'protected/:action',  // GOOD: Parameterized after specific
    component: ProtectedComponent,
    canActivate: [AuthGuard]
  },

  // GOOD: Lazy loaded routes with correct order
  {
    path: 'feature/special',  // GOOD: Specific route first
    component: SpecialFeatureComponent
  },
  {
    path: 'feature/:param',  // GOOD: Parameterized after specific
    loadChildren: () => import('./feature.module').then(m => m.FeatureModule)
  },

  // GOOD: Empty path routes in correct order
  {
    path: '',  // GOOD: Default route first
    component: HomeComponent
  },
  {
    path: 'dashboard/:tab',  // GOOD: Parameterized after default
    component: DashboardComponent
  },

  // GOOD: Auxiliary routes with proper order
  {
    path: 'main',
    component: MainComponent,
    children: [
      {
        path: 'aux/list',  // GOOD: Specific auxiliary route first
        component: AuxListComponent,
        outlet: 'aux'
      },
      {
        path: 'aux/:id',  // GOOD: Parameterized auxiliary route after
        component: AuxDetailComponent,
        outlet: 'aux'
      }
    ]
  },

  // GOOD: Routes with query parameters in correct order
  {
    path: 'search/:query',  // GOOD: Parameterized route first
    component: SearchResultsComponent
  },
  {
    path: 'search',  // GOOD: Base route after parameterized
    component: SearchComponent
  },

  // GOOD: Multiple redirects in correct order
  {
    path: 'v1/api/users/:id',  // GOOD: Most specific first
    component: UserDetailComponent
  },
  {
    path: 'v1/api/users',  // GOOD: Medium specificity
    redirectTo: '/api/users'
  },
  {
    path: 'v1/api',  // GOOD: General redirect last
    redirectTo: '/api'
  }
];

// GOOD: Module with proper routing order
@NgModule({
  imports: [
    RouterModule.forRoot(goodRoutes)
  ],
  exports: [RouterModule]
})
export class GoodRoutingModule { }

// GOOD: Feature module with correct route order
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'item',  // GOOD: Base route first
        component: ItemListComponent
      },
      {
        path: 'item/create',  // GOOD: Specific route after base
        component: CreateItemComponent
      },
      {
        path: 'item/:type/:id',  // GOOD: Most parameterized last
        component: ItemDetailComponent
      }
    ])
  ]
})
export class GoodFeatureRoutingModule { }

// GOOD: Routes avoiding conflicting path patterns
export const nonConflictingRoutes: Routes = [
  // GOOD: Clear separation of concerns
  {
    path: 'resource/create',  // GOOD: Action-based route first
    component: CreateResourceComponent
  },
  {
    path: 'resource/:id/action/:actionName',  // GOOD: Complex parameterized route
    component: ResourceActionComponent
  },
  {
    path: 'resource/:id',  // GOOD: Simple parameterized route last
    component: ResourceComponent
  }
];

// GOOD: Routes with optional parameters in correct order
export const optionalParamRoutes: Routes = [
  {
    path: 'filter/:category/:subcategory',  // GOOD: Most specific first
    component: FilterComponent
  },
  {
    path: 'filter/:category',  // GOOD: Medium specificity
    component: CategoryFilterComponent
  },
  {
    path: 'filter',  // GOOD: Least specific last
    component: AllFilterComponent
  }
];

// GOOD: Routes organized by feature priority
export const priorityRoutes: Routes = [
  // GOOD: Critical user-facing routes first
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },

  // GOOD: Feature routes in order of importance
  {
    path: 'products',
    loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule)
  },

  // GOOD: Admin routes last
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },

  // GOOD: Wildcard route at the very end
  {
    path: '**',
    component: NotFoundComponent
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