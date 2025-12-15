// GOOD: Proper incremental hydration trigger configuration
import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideClientHydration, withIncrementalHydration } from '@angular/platform-browser';

// GOOD: Hero section loads immediately
@Component({
  selector: 'app-hero-section',
  template: `
    <section class="hero">
      <h1>Welcome to our site!</h1>
      <p>This is the main hero content users see first</p>
      <button class="cta-button">Get Started</button>
    </section>
  `,
  standalone: false
})
export class HeroSectionComponent {}

// GOOD: Dashboard with appropriate hydration triggers
@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard">
      <!-- GOOD: Hero content loads immediately (no @defer) -->
      <app-hero-section></app-hero-section>

      <!-- GOOD: Navigation loads immediately -->
      <nav class="main-nav">
        <a href="/home">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </nav>

      <!-- GOOD: Search bar loads immediately -->
      <div class="search-container">
        <input type="text" placeholder="Search..." />
        <button>Search</button>
      </div>

      <main>
        <!-- GOOD: Main content loads immediately -->
        <div class="main-content">
          <h2>Main Content</h2>
          <p>This loads immediately for good UX</p>
        </div>

        <!-- GOOD: Below-fold content deferred appropriately -->
        @defer (hydrate on viewport) {
          <div class="below-fold-content">
            <h3>Additional Content</h3>
            <p>This content loads when scrolled into view</p>
          </div>
        } @placeholder {
          <div class="content-placeholder">Loading more content...</div>
        }
      </main>
    </div>
  `,
  standalone: false
})
export class DashboardComponent {}

// GOOD: E-commerce product list with proper hydration triggers
@Component({
  selector: 'app-product-list',
  template: `
    <div class="product-list">
      <!-- GOOD: Above-fold products load immediately -->
      <div class="products-grid">
        <app-product-card
          *ngFor="let product of visibleProducts"
          [product]="product">
        </app-product-card>
      </div>

      <!-- GOOD: Filters load immediately for usability -->
      <div class="filters">
        <select>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
        </select>
        <input type="checkbox" id="in-stock" />
        <label for="in-stock">In Stock Only</label>
      </div>

      <!-- GOOD: Remaining products deferred on viewport -->
      @defer (hydrate on viewport) {
        <div class="remaining-products">
          <app-product-card
            *ngFor="let product of remainingProducts"
            [product]="product">
          </app-product-card>
        </div>
      }

      <!-- GOOD: Pagination loads immediately -->
      <div class="pagination">
        <button>Previous</button>
        <span>Page 1 of 10</span>
        <button>Next</button>
      </div>
    </div>
  `,
  standalone: false
})
export class ProductListComponent {
  allProducts = Array.from({ length: 50 }, (_, i) => ({ id: i + 1, name: `Product ${i + 1}` }));
  visibleProducts = this.allProducts.slice(0, 12); // First 12 products
  remainingProducts = this.allProducts.slice(12); // Remaining products
}

// GOOD: Contact form loads immediately
@Component({
  selector: 'app-contact-form',
  template: `
    <div class="contact-form">
      <!-- GOOD: Contact form loads immediately for conversion -->
      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label>Name:</label>
          <input type="text" [(ngModel)]="name" required />
        </div>
        <div class="form-group">
          <label>Email:</label>
          <input type="email" [(ngModel)]="email" required />
        </div>
        <div class="form-group">
          <label>Message:</label>
          <textarea [(ngModel)]="message" required></textarea>
        </div>
        <button type="submit">Send Message</button>
      </form>
    </div>
  `,
  standalone: false
})
export class ContactFormComponent {
  name = '';
  email = '';
  message = '';

  onSubmit() {
    console.log('Form submitted:', { name: this.name, email: this.email, message: this.message });
  }
}

// GOOD: Interactive components hydrate on interaction
@Component({
  selector: 'app-interactive-widget',
  template: `
    <div class="widget">
      <!-- GOOD: Interactive widget hydrates on interaction -->
      @defer (hydrate on interaction) {
        <div class="interactive-content">
          <h3>Interactive Widget</h3>
          <button (click)="increment()">Click me: {{ count }}</button>
          <input type="range" [(ngModel)]="value" (input)="onValueChange()" />
          <p>Value: {{ value }}</p>
        </div>
      } @placeholder {
        <div class="widget-placeholder">
          <p>Interactive Widget</p>
          <button>Click to activate</button>
        </div>
      }
    </div>
  `,
  standalone: false
})
export class InteractiveWidgetComponent {
  count = 0;
  value = 50;

  increment() {
    this.count++;
  }

  onValueChange() {
    console.log('Value changed:', this.value);
  }
}

// GOOD: Bootstrap with incremental hydration and proper trigger usage
bootstrapApplication(AppComponent, {
  providers: [
    // GOOD: withIncrementalHydration enabled with proper trigger usage
    provideClientHydration(withIncrementalHydration())
  ]
});

// GOOD: App component with proper hydration strategy
@Component({
  selector: 'app-root',
  template: `
    <div class="app">
      <!-- GOOD: Header content loads immediately -->
      <header>
        <h1>My App</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
        </nav>
      </header>

      <!-- GOOD: Main content with appropriate deferral -->
      <main>
        <app-dashboard></app-dashboard>

        <!-- GOOD: Below-fold content deferred -->
        @defer (hydrate on viewport) {
          <app-product-list></app-product-list>
        } @placeholder {
          <div class="loading-products">Loading products...</div>
        }
      </main>
    </div>
  `,
  standalone: false
})
export class AppComponent {}

// GOOD: Modal component hydrates immediately when needed
@Component({
  selector: 'app-modal',
  template: `
    <!-- GOOD: Modal content loads immediately when shown -->
    <div class="modal-overlay" (click)="close()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <h2>Important Modal</h2>
        <p>This modal is immediately interactive</p>
        <button (click)="close()">Close</button>
        <button (click)="confirm()">Confirm</button>
      </div>
    </div>
  `,
  standalone: false
})
export class ModalComponent {
  close() {
    console.log('Modal closed');
  }

  confirm() {
    console.log('Modal confirmed');
  }
}

// GOOD: Critical user journey steps load immediately
@Component({
  selector: 'app-checkout',
  template: `
    <div class="checkout">
      <!-- GOOD: Checkout steps load immediately -->
      <div class="checkout-steps">
        <div class="step active">Shipping</div>
        <div class="step">Payment</div>
        <div class="step">Review</div>
      </div>

      <!-- GOOD: Payment form loads immediately for critical user journey -->
      <form class="payment-form">
        <div class="form-group">
          <label>Card Number:</label>
          <input type="text" placeholder="1234 5678 9012 3456" />
        </div>
        <button type="submit">Complete Purchase</button>
      </form>

      <!-- GOOD: Non-critical content can be deferred -->
      @defer (hydrate on viewport) {
        <div class="additional-info">
          <h4>Order Summary</h4>
          <p>Additional order details...</p>
        </div>
      }
    </div>
  `,
  standalone: false
})
export class CheckoutComponent {}

// GOOD: Search functionality loads immediately
@Component({
  selector: 'app-search-page',
  template: `
    <div class="search-page">
      <!-- GOOD: Search input loads immediately -->
      <div class="search-input-container">
        <input
          type="text"
          [(ngModel)]="query"
          (input)="onSearchInput()"
          placeholder="Search for products..."
        />
        <button (click)="search()">Search</button>
      </div>

      <!-- GOOD: Search results hydrate on interaction -->
      @defer (hydrate on interaction) {
        <div class="search-results">
          <div *ngFor="let result of results" class="result-item">
            {{ result }}
          </div>
        </div>
      } @placeholder {
        <div class="results-placeholder">
          Enter a search term and click "Search" to see results
        </div>
      }
    </div>
  `,
  standalone: false
})
export class SearchPageComponent {
  query = '';
  results: string[] = [];

  onSearchInput() {
    // Search logic would go here
    this.results = [`Result for "${this.query}"`];
  }

  search() {
    console.log('Searching for:', this.query);
  }
}

// GOOD: Performance monitoring for hydration triggers
@Component({
  selector: 'app-performance-aware-app',
  template: `
    <div class="performance-app">
      <!-- GOOD: Critical content loads immediately -->
      <div class="critical-content">
        <h1>Important Content</h1>
        <p>This must load immediately</p>
      </div>

      <!-- GOOD: Performance-based deferral -->
      @defer (hydrate on viewport) {
        <div class="heavy-content">
          <h2>Heavy Content</h2>
          <p>This content is deferred for performance</p>
          <app-heavy-component></app-heavy-component>
        </div>
      } @placeholder {
        <div class="heavy-placeholder">
          <p>Loading heavy content...</p>
          <div class="skeleton"></div>
        </div>
      }

      <!-- GOOD: User-initiated content -->
      @defer (hydrate on interaction) {
        <div class="user-initiated-content">
          <h2>On-Demand Content</h2>
          <p>This loads when user interacts</p>
        </div>
      } @placeholder {
        <div class="interaction-placeholder">
          <button>Load Additional Content</button>
        </div>
      }
    </div>
  `,
  standalone: false
})
export class PerformanceAwareAppComponent {}