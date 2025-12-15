// BAD: Deferring above-the-fold content causing layout shift and poor UX
import { Component } from '@angular/core';

@Component({
  selector: 'app-homepage-bad',
  template: `
    <!-- BAD: Hero section is above the fold but deferred -->
    @defer (on viewport) {
      <section class="hero">
        <h1>Welcome to Our Site</h1>
        <p>Discover amazing features</p>
        <button>Get Started</button>
      </section>
    } @placeholder {
      <div class="hero-placeholder" style="height: 400px;">
        Loading hero content...
      </div>
    }

    <!-- BAD: Navigation menu deferred -->
    @defer (on viewport) {
      <nav class="main-nav">
        <a href="/home">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </nav>
    } @placeholder {
      <div class="nav-placeholder">Loading navigation...</div>
    }

    <!-- BAD: Critical call-to-action deferred -->
    @defer (on timer 2s) {
      <div class="cta-banner">
        <h2>Sign up now!</h2>
        <form>
          <input type="email" placeholder="Enter your email" />
          <button type="submit">Subscribe</button>
        </form>
      </div>
    } @placeholder {
      <div class="cta-placeholder">Loading call-to-action...</div>
    }

    <!-- BAD: Content that appears immediately on load but deferred -->
    @defer (on interaction) {
      <article class="main-content">
        <h2>Our Services</h2>
        <p>We provide excellent services...</p>
      </article>
    } @placeholder {
      <div class="content-placeholder">Loading content...</div>
    }
  `,
  standalone: true
})
export class HomepageBadComponent {}

// BAD: Landing page with multiple above-fold deferrals
@Component({
  selector: 'app-landing-bad',
  template: `
    <div class="landing-page">
      <!-- BAD: Logo and branding deferred -->
      @defer (on viewport) {
        <header class="brand-header">
          <img src="logo.png" alt="Company Logo" />
          <h1>Our Company</h1>
        </header>
      } @placeholder {
        <div class="logo-placeholder">Loading logo...</div>
      }

      <!-- BAD: Main headline deferred with timer -->
      @defer (on timer 1s) {
        <section class="headline">
          <h1>Revolutionary Product</h1>
          <p>Change the way you work</p>
        </section>
      } @placeholder {
        <div class="headline-placeholder" style="height: 200px;"></div>
      }

      <!-- BAD: Feature highlights above fold -->
      @defer (on viewport) {
        <div class="features-grid">
          <div class="feature-card">
            <h3>Fast</h3>
            <p>Lightning quick performance</p>
          </div>
          <div class="feature-card">
            <h3>Reliable</h3>
            <p>Always available</p>
          </div>
          <div class="feature-card">
            <h3>Secure</h3>
            <p>Enterprise-grade security</p>
          </div>
        </div>
      } @placeholder {
        <div class="features-placeholder" style="height: 300px;">
          Loading features...
        </div>
      }

      <!-- BAD: Social proof deferred -->
      @defer (on idle) {
        <section class="testimonials">
          <blockquote>"Amazing product!" - Customer</blockquote>
        </section>
      } @placeholder {
        <div class="testimonials-placeholder">Loading testimonials...</div>
      }
    </div>
  `,
  standalone: true
})
export class LandingBadComponent {}

// BAD: E-commerce product page with deferred critical content
@Component({
  selector: 'app-product-bad',
  template: `
    <div class="product-page">
      <!-- BAD: Product image deferred -->
      @defer (on viewport) {
        <div class="product-image">
          <img src="product.jpg" alt="Product Image" />
        </div>
      } @placeholder {
        <div class="image-placeholder" style="height: 400px;">
          Loading product image...
        </div>
      }

      <!-- BAD: Product title and price deferred -->
      @defer (on timer 500ms) {
        <div class="product-info">
          <h1>Amazing Product</h1>
          <div class="price">$99.99</div>
          <button class="buy-now">Buy Now</button>
        </div>
      } @placeholder {
        <div class="info-placeholder">
          <div class="title-placeholder">Loading product info...</div>
        </div>
      }

      <!-- BAD: Add to cart button deferred -->
      @defer (on interaction) {
        <div class="purchase-section">
          <select>
            <option>Size: Small</option>
            <option>Size: Medium</option>
            <option>Size: Large</option>
          </select>
          <button class="add-to-cart">Add to Cart</button>
        </div>
      } @placeholder {
        <div class="purchase-placeholder">Loading purchase options...</div>
      }
    </div>
  `,
  standalone: true
})
export class ProductBadComponent {}

// BAD: Dashboard with deferred critical metrics
@Component({
  selector: 'app-dashboard-bad',
  template: `
    <div class="dashboard">
      <!-- BAD: Key metrics deferred -->
      @defer (on viewport) {
        <div class="metrics-grid">
          <div class="metric-card">
            <h3>Revenue</h3>
            <div class="value">$125,000</div>
          </div>
          <div class="metric-card">
            <h3>Users</h3>
            <div class="value">1,234</div>
          </div>
          <div class="metric-card">
            <h3>Orders</h3>
            <div class="value">89</div>
          </div>
        </div>
      } @placeholder {
        <div class="metrics-placeholder" style="height: 200px;">
          Loading metrics...
        </div>
      }

      <!-- BAD: Important alerts deferred -->
      @defer (on timer 3s) {
        <div class="alerts">
          <div class="alert alert-warning">
            Server load high - consider scaling
          </div>
          <div class="alert alert-info">
            New user registrations: +15%
          </div>
        </div>
      } @placeholder {
        <div class="alerts-placeholder">Loading alerts...</div>
      }
    </div>
  `,
  standalone: true
})
export class DashboardBadComponent {}