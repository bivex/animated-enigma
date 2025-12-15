// BAD: SSR render mode misconfiguration anti-patterns
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// BAD: Routes with incorrect render mode configurations
export const badRoutes: Routes = [
  // BAD: Static marketing pages using SSR instead of prerendering
  {
    path: '',
    component: HomeComponent,
    // BAD: Using SSR for static content that could be prerendered
  },
  {
    path: 'about',
    component: AboutComponent,
    // BAD: Static about page using default SSR
  },
  {
    path: 'pricing',
    component: PricingComponent,
    // BAD: Static pricing page not optimized for prerendering
  },

  // BAD: Dynamic user-specific pages using prerendering
  {
    path: 'dashboard',
    component: DashboardComponent,
    // BAD: User dashboard prerendered - won't have user data
  },
  {
    path: 'profile',
    component: ProfileComponent,
    // BAD: User profile using prerendering instead of SSR
  },

  // BAD: API-dependent pages using prerendering
  {
    path: 'products',
    component: ProductListComponent,
    // BAD: Product list with API data using prerendering
  },
  {
    path: 'product/:id',
    component: ProductDetailComponent,
    // BAD: Dynamic product pages using prerendering
  },

  // BAD: Search results using prerendering
  {
    path: 'search',
    component: SearchResultsComponent,
    // BAD: Search results can't be prerendered meaningfully
  },

  // BAD: Real-time data pages using prerendering
  {
    path: 'live-stats',
    component: LiveStatsComponent,
    // BAD: Live statistics using prerendering
  },

  // BAD: Form-heavy pages using prerendering
  {
    path: 'contact',
    component: ContactFormComponent,
    // BAD: Contact form using prerendering - form state won't persist
  },

  // BAD: Checkout process using prerendering
  {
    path: 'checkout',
    component: CheckoutComponent,
    // BAD: Critical commerce flow using prerendering
  },

  // BAD: Admin pages using prerendering
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    // BAD: Admin functionality using prerendering
  },

  // BAD: Error pages using prerendering
  {
    path: 'error',
    component: ErrorComponent,
    // BAD: Error pages using prerendering
  },

  // BAD: Login pages using prerendering
  {
    path: 'login',
    component: LoginComponent,
    // BAD: Authentication pages using prerendering
  },

  // BAD: Cart/checkout using prerendering
  {
    path: 'cart',
    component: CartComponent,
    // BAD: Shopping cart using prerendering
  },

  // BAD: User preferences using prerendering
  {
    path: 'settings',
    component: SettingsComponent,
    // BAD: User settings using prerendering
  },

  // BAD: Notification pages using prerendering
  {
    path: 'notifications',
    component: NotificationsComponent,
    // BAD: User notifications using prerendering
  }
];

// BAD: Server routes configuration with wrong render modes
export const badServerRoutes = [
  // BAD: Static pages using Server mode instead of Prerender
  {
    path: '',
    renderMode: RenderMode.Server  // BAD: Should be Prerender for static content
  },
  {
    path: 'about',
    renderMode: RenderMode.Server  // BAD: Static content doesn't need SSR
  },

  // BAD: Dynamic pages using Prerender instead of Server
  {
    path: 'dashboard',
    renderMode: RenderMode.Prerender  // BAD: User-specific content needs SSR
  },
  {
    path: 'profile',
    renderMode: RenderMode.Prerender  // BAD: Dynamic user data needs SSR
  },

  // BAD: API-dependent routes using Prerender
  {
    path: 'products',
    renderMode: RenderMode.Prerender  // BAD: API data needs SSR
  },

  // BAD: Search using Prerender
  {
    path: 'search',
    renderMode: RenderMode.Prerender  // BAD: Query-dependent content needs SSR
  },

  // BAD: Real-time features using Prerender
  {
    path: 'live-stats',
    renderMode: RenderMode.Prerender  // BAD: Real-time data needs SSR
  }
];

// BAD: App module with incorrect SSR configuration
@NgModule({
  imports: [
    RouterModule.forRoot(badRoutes)
    // BAD: No server routes configuration
  ],
  exports: [RouterModule]
})
export class BadAppRoutingModule { }

// BAD: Components that assume prerendering behavior
@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard">
      <!-- BAD: Component assumes static prerendered content -->
      <h1>Welcome User</h1>  <!-- BAD: Won't have actual user name -->
      <div class="stats">
        <!-- BAD: Static placeholders instead of real data -->
        <div>Loading stats...</div>
      </div>
    </div>
  `,
  standalone: false
})
export class DashboardComponent implements OnInit {
  ngOnInit() {
    // BAD: OnInit runs on client but data might be stale
    this.loadUserData();
  }

  private loadUserData() {
    // BAD: Client-side data loading after prerendering
  }
}

// BAD: Search component assuming prerendered results
@Component({
  selector: 'app-search-results',
  template: `
    <div class="search-results">
      <!-- BAD: Static prerendered search results -->
      <div>No search query provided</div>  <!-- BAD: No dynamic search -->
    </div>
  `,
  standalone: false
})
export class SearchResultsComponent { }

// BAD: Form component that loses state due to prerendering
@Component({
  selector: 'app-contact-form',
  template: `
    <form>
      <!-- BAD: Form state lost due to prerendering -->
      <input type="text" placeholder="Name" />  <!-- BAD: User input lost -->
      <textarea placeholder="Message"></textarea>  <!-- BAD: User input lost -->
      <button type="submit">Send</button>
    </form>
  `,
  standalone: false
})
export class ContactFormComponent { }

// BAD: Real-time component using prerendering
@Component({
  selector: 'app-live-stats',
  template: `
    <div class="live-stats">
      <!-- BAD: Static prerendered stats -->
      <div>Last updated: Build time</div>  <!-- BAD: Stale data -->
      <div>Active users: 0</div>  <!-- BAD: No real data -->
    </div>
  `,
  standalone: false
})
export class LiveStatsComponent { }

// BAD: Product list assuming prerendered static data
@Component({
  selector: 'app-product-list',
  template: `
    <div class="product-list">
      <!-- BAD: Static product list -->
      <div>No products loaded</div>  <!-- BAD: No dynamic loading -->
    </div>
  `,
  standalone: false
})
export class ProductListComponent { }

// BAD: User profile with placeholder content
@Component({
  selector: 'app-profile',
  template: `
    <div class="profile">
      <!-- BAD: Placeholder content instead of real user data -->
      <div class="avatar">?</div>
      <h1>Loading...</h1>
      <p>Please wait...</p>
    </div>
  `,
  standalone: false
})
export class ProfileComponent { }

// BAD: Checkout component with static content
@Component({
  selector: 'app-checkout',
  template: `
    <div class="checkout">
      <!-- BAD: Static checkout without user cart data -->
      <h1>Checkout</h1>
      <div>Your cart is empty</div>  <!-- BAD: No real cart data -->
    </div>
  `,
  standalone: false
})
export class CheckoutComponent { }

// Import statements for missing types
import { Component, OnInit } from '@angular/core';
import { RenderMode } from '@angular/ssr';

// Mock components
class HomeComponent {}
class AboutComponent {}
class PricingComponent {}
class ProductDetailComponent {}
class LiveStatsComponent {}
class ContactFormComponent {}
class ErrorComponent {}
class LoginComponent {}
class CartComponent {}
class SettingsComponent {}
class NotificationsComponent {}