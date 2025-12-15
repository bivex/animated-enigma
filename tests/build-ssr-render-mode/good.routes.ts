// GOOD: Proper SSR render mode configuration
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// GOOD: Routes with appropriate render mode configurations
export const goodRoutes: Routes = [
  // GOOD: Static marketing pages using appropriate components
  {
    path: '',
    component: HomeComponent,
    // GOOD: Will be configured for prerendering in server routes
  },
  {
    path: 'about',
    component: AboutComponent,
    // GOOD: Static content suitable for prerendering
  },
  {
    path: 'pricing',
    component: PricingComponent,
    // GOOD: Static pricing suitable for prerendering
  },

  // GOOD: Dynamic user-specific pages
  {
    path: 'dashboard',
    component: DashboardComponent,
    // GOOD: Will use SSR for user-specific content
  },
  {
    path: 'profile',
    component: ProfileComponent,
    // GOOD: Dynamic user data needs SSR
  },

  // GOOD: API-dependent pages
  {
    path: 'products',
    component: ProductListComponent,
    // GOOD: API data requires SSR
  },
  {
    path: 'product/:id',
    component: ProductDetailComponent,
    // GOOD: Dynamic product data needs SSR
  },

  // GOOD: Search results
  {
    path: 'search',
    component: SearchResultsComponent,
    // GOOD: Query-dependent content requires SSR
  },

  // GOOD: Real-time data pages
  {
    path: 'live-stats',
    component: LiveStatsComponent,
    // GOOD: Real-time data needs SSR
  },

  // GOOD: Form-heavy pages
  {
    path: 'contact',
    component: ContactFormComponent,
    // GOOD: Forms need SSR for proper initialization
  },

  // GOOD: Checkout process
  {
    path: 'checkout',
    component: CheckoutComponent,
    // GOOD: Critical commerce flow needs SSR
  },

  // GOOD: Admin pages
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    // GOOD: Admin functionality requires SSR
  },

  // GOOD: Error pages
  {
    path: 'error',
    component: ErrorComponent,
    // GOOD: Error handling needs SSR
  },

  // GOOD: Login pages
  {
    path: 'login',
    component: LoginComponent,
    // GOOD: Authentication needs SSR
  },

  // GOOD: Cart/checkout
  {
    path: 'cart',
    component: CartComponent,
    // GOOD: Shopping cart needs SSR
  },

  // GOOD: User preferences
  {
    path: 'settings',
    component: SettingsComponent,
    // GOOD: User settings need SSR
  },

  // GOOD: Notification pages
  {
    path: 'notifications',
    component: NotificationsComponent,
    // GOOD: User notifications need SSR
  }
];

// GOOD: Server routes configuration with correct render modes
export const goodServerRoutes = [
  // GOOD: Static pages using Prerender mode
  {
    path: '',
    renderMode: RenderMode.Prerender  // GOOD: Static home page prerendered
  },
  {
    path: 'about',
    renderMode: RenderMode.Prerender  // GOOD: Static about page prerendered
  },
  {
    path: 'pricing',
    renderMode: RenderMode.Prerender  // GOOD: Static pricing prerendered
  },

  // GOOD: Dynamic pages using Server mode
  {
    path: 'dashboard',
    renderMode: RenderMode.Server  // GOOD: User dashboard uses SSR
  },
  {
    path: 'profile',
    renderMode: RenderMode.Server  // GOOD: User profile uses SSR
  },

  // GOOD: API-dependent routes using Server mode
  {
    path: 'products',
    renderMode: RenderMode.Server  // GOOD: Product list uses SSR for API data
  },
  {
    path: 'product/:id',
    renderMode: RenderMode.Server  // GOOD: Product details use SSR
  },

  // GOOD: Search using Server mode
  {
    path: 'search',
    renderMode: RenderMode.Server  // GOOD: Search results use SSR
  },

  // GOOD: Real-time features using Server mode
  {
    path: 'live-stats',
    renderMode: RenderMode.Server  // GOOD: Live stats use SSR
  },

  // GOOD: Forms using Server mode
  {
    path: 'contact',
    renderMode: RenderMode.Server  // GOOD: Contact form uses SSR
  },

  // GOOD: Commerce using Server mode
  {
    path: 'checkout',
    renderMode: RenderMode.Server  // GOOD: Checkout process uses SSR
  },
  {
    path: 'cart',
    renderMode: RenderMode.Server  // GOOD: Shopping cart uses SSR
  },

  // GOOD: User-specific pages using Server mode
  {
    path: 'settings',
    renderMode: RenderMode.Server  // GOOD: User settings use SSR
  },
  {
    path: 'notifications',
    renderMode: RenderMode.Server  // GOOD: Notifications use SSR
  },

  // GOOD: Auth pages using Server mode
  {
    path: 'login',
    renderMode: RenderMode.Server  // GOOD: Login page uses SSR
  },

  // GOOD: Admin using Server mode
  {
    path: 'admin',
    renderMode: RenderMode.Server  // GOOD: Admin pages use SSR
  },

  // GOOD: Error handling using Server mode
  {
    path: 'error',
    renderMode: RenderMode.Server  // GOOD: Error pages use SSR
  }
];

// GOOD: App module with proper SSR configuration
@NgModule({
  imports: [
    RouterModule.forRoot(goodRoutes)
    // GOOD: Server routes configured separately
  ],
  exports: [RouterModule]
})
export class GoodAppRoutingModule { }

// GOOD: Components designed for SSR
@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard">
      <!-- GOOD: Server-side rendered user content -->
      @if (user) {
        <h1>Welcome {{ user.name }}</h1>
      } @else {
        <div>Loading user data...</div>
      }
      <div class="stats">
        <!-- GOOD: Dynamic content rendered on server -->
        <div>Stats will load here</div>
      </div>
    </div>
  `,
  standalone: false
})
export class DashboardComponent implements OnInit {
  user: any = null;

  ngOnInit() {
    // GOOD: OnInit runs on server for SSR, client for hydration
    this.loadUserData();
  }

  private loadUserData() {
    // GOOD: Data loading works on both server and client
    // On server: renders with data
    // On client: hydrates with same data
  }
}

// GOOD: Search component designed for SSR
@Component({
  selector: 'app-search-results',
  template: `
    <div class="search-results">
      <!-- GOOD: Dynamic search results rendered on server -->
      @if (results.length > 0) {
        <div *ngFor="let result of results">
          {{ result.title }}
        </div>
      } @else if (query) {
        <div>No results for "{{ query }}"</div>
      } @else {
        <div>Enter a search query</div>
      }
    </div>
  `,
  standalone: false
})
export class SearchResultsComponent implements OnInit {
  query = '';
  results: any[] = [];

  ngOnInit() {
    // GOOD: Search logic runs on server with query params
    this.performSearch();
  }

  private performSearch() {
    // GOOD: Search works on both server and client
  }
}

// GOOD: Form component that preserves state
@Component({
  selector: 'app-contact-form',
  template: `
    <form (ngSubmit)="onSubmit()">
      <!-- GOOD: Form state preserved during SSR/hydration -->
      <input
        type="text"
        [(ngModel)]="formData.name"
        placeholder="Name"
        name="name"
      />
      <textarea
        [(ngModel)]="formData.message"
        placeholder="Message"
        name="message">
      </textarea>
      <button type="submit">Send</button>
    </form>
  `,
  standalone: false
})
export class ContactFormComponent {
  formData = {
    name: '',
    message: ''
  };

  onSubmit() {
    // GOOD: Form submission works after hydration
  }
}

// GOOD: Real-time component with SSR-friendly design
@Component({
  selector: 'app-live-stats',
  template: `
    <div class="live-stats">
      <!-- GOOD: Server-rendered initial state -->
      <div>Last updated: {{ lastUpdated }}</div>
      <div>Active users: {{ activeUsers }}</div>

      <!-- GOOD: Client-only real-time updates -->
      @if (isClient) {
        <div>Real-time updates active</div>
      }
    </div>
  `,
  standalone: false
})
export class LiveStatsComponent implements OnInit {
  lastUpdated = new Date().toISOString();
  activeUsers = 0;
  isClient = false;

  ngOnInit() {
    // GOOD: Initial data loaded on server
    // Client-side updates happen after hydration
    this.isClient = typeof window !== 'undefined';
  }
}

// GOOD: Product list with proper SSR data loading
@Component({
  selector: 'app-product-list',
  template: `
    <div class="product-list">
      <!-- GOOD: Server-side rendered product list -->
      @if (products.length > 0) {
        <div *ngFor="let product of products">
          {{ product.name }}
        </div>
      } @else {
        <div>Loading products...</div>
      }
    </div>
  `,
  standalone: false
})
export class ProductListComponent implements OnInit {
  products: any[] = [];

  ngOnInit() {
    // GOOD: Products loaded on server for initial render
    this.loadProducts();
  }

  private loadProducts() {
    // GOOD: API calls work on both server and client
  }
}

// GOOD: User profile with proper SSR data
@Component({
  selector: 'app-profile',
  template: `
    <div class="profile">
      <!-- GOOD: Server-rendered user data -->
      @if (user) {
        <div class="avatar">{{ user.avatar }}</div>
        <h1>{{ user.name }}</h1>
        <p>{{ user.bio }}</p>
      } @else {
        <div>Loading profile...</div>
      }
    </div>
  `,
  standalone: false
})
export class ProfileComponent implements OnInit {
  user: any = null;

  ngOnInit() {
    // GOOD: User data loaded on server
    this.loadUserProfile();
  }

  private loadUserProfile() {
    // GOOD: Profile loading works on server and client
  }
}

// GOOD: Checkout component with SSR-friendly design
@Component({
  selector: 'app-checkout',
  template: `
    <div class="checkout">
      <h1>Checkout</h1>
      <!-- GOOD: Cart data rendered on server -->
      @if (cart.items.length > 0) {
        <div *ngFor="let item of cart.items">
          {{ item.name }} - {{ item.price }}
        </div>
        <div>Total: {{ cart.total }}</div>
      } @else {
        <div>Your cart is empty</div>
      }
    </div>
  `,
  standalone: false
})
export class CheckoutComponent implements OnInit {
  cart = { items: [], total: 0 };

  ngOnInit() {
    // GOOD: Cart data loaded on server
    this.loadCart();
  }

  private loadCart() {
    // GOOD: Cart loading works on server and client
  }
}

// Import statements
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