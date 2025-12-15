// BAD: Incremental hydration trigger misconfiguration anti-patterns
import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideClientHydration, withIncrementalHydration } from '@angular/platform-browser';

// BAD: Component with @defer above the fold
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

// BAD: Dashboard with above-fold @defer
@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard">
      <!-- BAD: Hero content deferred with hydrate on immediate -->
      @defer (hydrate on immediate) {
        <app-hero-section></app-hero-section>
      } @placeholder {
        <div class="hero-placeholder">Loading hero...</div>
      }

      <!-- BAD: Navigation deferred inappropriately -->
      @defer (hydrate on viewport) {
        <nav class="main-nav">
          <a href="/home">Home</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>
      }

      <!-- BAD: Search bar deferred -->
      @defer (hydrate on interaction) {
        <div class="search-container">
          <input type="text" placeholder="Search..." />
          <button>Search</button>
        </div>
      }

      <main>
        <!-- BAD: Main content deferred -->
        @defer {
          <div class="main-content">
            <h2>Main Content</h2>
            <p>This should load immediately</p>
          </div>
        }
      </main>
    </div>
  `,
  standalone: false
})
export class DashboardComponent {}

// BAD: E-commerce product list with poor hydration triggers
@Component({
  selector: 'app-product-list',
  template: `
    <div class="product-list">
      <!-- BAD: Product grid deferred with viewport trigger -->
      @defer (hydrate on viewport) {
        <div class="products-grid">
          <app-product-card *ngFor="let product of products"></app-product-card>
        </div>
      } @placeholder {
        <div class="skeleton-grid">
          <div *ngFor="let i of [1,2,3,4]" class="skeleton-card"></div>
        </div>
      }

      <!-- BAD: Filters deferred with interaction -->
      @defer (hydrate on interaction) {
        <div class="filters">
          <select>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
          <input type="checkbox" id="in-stock" />
          <label for="in-stock">In Stock Only</label>
        </div>
      }

      <!-- BAD: Pagination controls deferred -->
      @defer (hydrate never) {
        <div class="pagination">
          <button>Previous</button>
          <span>Page 1 of 10</span>
          <button>Next</button>
        </div>
      }
    </div>
  `,
  standalone: false
})
export class ProductListComponent {
  products = Array.from({ length: 20 }, (_, i) => ({ id: i + 1, name: `Product ${i + 1}` }));
}

// BAD: Form with poor hydration triggers
@Component({
  selector: 'app-contact-form',
  template: `
    <div class="contact-form">
      <!-- BAD: Contact form deferred inappropriately -->
      @defer (hydrate on viewport) {
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
      } @placeholder {
        <div class="form-placeholder">Loading contact form...</div>
      }
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

// BAD: Interactive components with hydrate never
@Component({
  selector: 'app-interactive-widget',
  template: `
    <div class="widget">
      <!-- BAD: Interactive widget with hydrate never -->
      @defer (hydrate never) {
        <div class="interactive-content">
          <h3>Interactive Widget</h3>
          <button (click)="increment()">Click me: {{ count }}</button>
          <input type="range" [(ngModel)]="value" (input)="onValueChange()" />
          <p>Value: {{ value }}</p>
        </div>
      } @placeholder {
        <div class="widget-placeholder">Widget loading...</div>
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

// BAD: Bootstrap with incremental hydration but poor trigger usage
bootstrapApplication(AppComponent, {
  providers: [
    // BAD: withIncrementalHydration enabled but triggers misused
    provideClientHydration(withIncrementalHydration())
  ]
});

// BAD: App component with multiple hydration issues
@Component({
  selector: 'app-root',
  template: `
    <div class="app">
      <!-- BAD: Header content deferred -->
      @defer (hydrate on viewport) {
        <header>
          <h1>My App</h1>
          <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
          </nav>
        </header>
      }

      <!-- BAD: Main content with mixed triggers -->
      <main>
        @defer (hydrate on immediate) {
          <app-dashboard></app-dashboard>
        }
        @defer (hydrate never) {
          <app-product-list></app-product-list>
        }
      </main>
    </div>
  `,
  standalone: false
})
export class AppComponent {}

// BAD: Modal component with hydration issues
@Component({
  selector: 'app-modal',
  template: `
    <!-- BAD: Modal content with hydrate on viewport -->
    @defer (hydrate on viewport) {
      <div class="modal-overlay" (click)="close()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h2>Important Modal</h2>
          <p>This modal should be immediately interactive</p>
          <button (click)="close()">Close</button>
          <button (click)="confirm()">Confirm</button>
        </div>
      </div>
    }
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

// BAD: Critical user journey steps deferred
@Component({
  selector: 'app-checkout',
  template: `
    <div class="checkout">
      <!-- BAD: Checkout steps deferred -->
      @defer (hydrate on interaction) {
        <div class="checkout-steps">
          <div class="step active">Shipping</div>
          <div class="step">Payment</div>
          <div class="step">Review</div>
        </div>
      }

      <!-- BAD: Payment form deferred inappropriately -->
      @defer (hydrate on viewport) {
        <form class="payment-form">
          <div class="form-group">
            <label>Card Number:</label>
            <input type="text" placeholder="1234 5678 9012 3456" />
          </div>
          <button type="submit">Complete Purchase</button>
        </form>
      }
    </div>
  `,
  standalone: false
})
export class CheckoutComponent {}

// BAD: Search functionality deferred
@Component({
  selector: 'app-search-page',
  template: `
    <div class="search-page">
      <!-- BAD: Search input deferred -->
      @defer (hydrate on viewport) {
        <div class="search-input-container">
          <input
            type="text"
            [(ngModel)]="query"
            (input)="onSearchInput()"
            placeholder="Search for products..."
          />
          <button (click)="search()">Search</button>
        </div>
      }

      <!-- BAD: Search results with hydrate never -->
      @defer (hydrate never) {
        <div class="search-results">
          <div *ngFor="let result of results" class="result-item">
            {{ result }}
          </div>
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

// Import statements
import { bootstrapApplication } from '@angular/platform-browser';
import { provideClientHydration, withIncrementalHydration } from '@angular/platform-browser';