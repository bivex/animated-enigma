// GOOD: Proper deferring strategy - load above-fold content first, defer below-fold
import { Component } from '@angular/core';

@Component({
  selector: 'app-homepage-good',
  template: `
    <!-- GOOD: Critical above-fold content loads immediately -->
    <section class="hero">
      <h1>Welcome to Our Site</h1>
      <p>Discover amazing features</p>
      <button>Get Started</button>
    </section>

    <!-- GOOD: Navigation loads immediately -->
    <nav class="main-nav">
      <a href="/home">Home</a>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
    </nav>

    <!-- GOOD: Main content loads immediately -->
    <article class="main-content">
      <h2>Our Services</h2>
      <p>We provide excellent services...</p>
    </article>

    <!-- GOOD: Call-to-action loads immediately -->
    <div class="cta-banner">
      <h2>Sign up now!</h2>
      <form>
        <input type="email" placeholder="Enter your email" />
        <button type="submit">Subscribe</button>
      </form>
    </div>

    <!-- GOOD: Below-fold content deferred -->
    @defer (on viewport) {
      <section class="additional-content">
        <h2>More Information</h2>
        <p>Additional details that users will see when scrolling...</p>
      </section>
    } @placeholder {
      <div class="content-placeholder">Loading more content...</div>
    }

    <!-- GOOD: Non-critical widgets deferred -->
    @defer (on idle) {
      <aside class="sidebar-widgets">
        <div class="widget">Recent Posts</div>
        <div class="widget">Newsletter Signup</div>
      </aside>
    }
  `,
  standalone: true
})
export class HomepageGoodComponent {}

// GOOD: Landing page with proper loading priorities
@Component({
  selector: 'app-landing-good',
  template: `
    <div class="landing-page">
      <!-- GOOD: Brand and logo load immediately -->
      <header class="brand-header">
        <img src="logo.png" alt="Company Logo" />
        <h1>Our Company</h1>
      </header>

      <!-- GOOD: Main headline loads immediately -->
      <section class="headline">
        <h1>Revolutionary Product</h1>
        <p>Change the way you work</p>
      </section>

      <!-- GOOD: Feature highlights load immediately -->
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

      <!-- GOOD: Social proof deferred -->
      @defer (on viewport) {
        <section class="testimonials">
          <blockquote>"Amazing product!" - Customer</blockquote>
          <blockquote>"Changed my workflow completely" - User</blockquote>
        </section>
      } @placeholder {
        <div class="testimonials-placeholder">Loading testimonials...</div>
      }

      <!-- GOOD: Non-critical sections deferred -->
      @defer (on idle) {
        <section class="faq">
          <h2>Frequently Asked Questions</h2>
          <!-- FAQ content -->
        </section>
      }
    </div>
  `,
  standalone: true
})
export class LandingGoodComponent {}

// GOOD: E-commerce product page with proper loading priorities
@Component({
  selector: 'app-product-good',
  template: `
    <div class="product-page">
      <!-- GOOD: Product image loads immediately -->
      <div class="product-image">
        <img src="product.jpg" alt="Product Image" />
      </div>

      <!-- GOOD: Product title and price load immediately -->
      <div class="product-info">
        <h1>Amazing Product</h1>
        <div class="price">$99.99</div>
        <button class="buy-now">Buy Now</button>
      </div>

      <!-- GOOD: Purchase options load immediately -->
      <div class="purchase-section">
        <select>
          <option>Size: Small</option>
          <option>Size: Medium</option>
          <option>Size: Large</option>
        </select>
        <button class="add-to-cart">Add to Cart</button>
      </div>

      <!-- GOOD: Below-fold content deferred -->
      @defer (on viewport) {
        <section class="product-details">
          <h2>Product Details</h2>
          <div class="specs">Detailed specifications...</div>
          <div class="reviews">Customer reviews...</div>
        </section>
      } @placeholder {
        <div class="details-placeholder">Loading product details...</div>
      }

      <!-- GOOD: Related products deferred -->
      @defer (on idle) {
        <section class="related-products">
          <h2>Related Products</h2>
          <!-- Related product grid -->
        </section>
      }
    </div>
  `,
  standalone: true
})
export class ProductGoodComponent {}

// GOOD: Dashboard with proper metric loading
@Component({
  selector: 'app-dashboard-good',
  template: `
    <div class="dashboard">
      <!-- GOOD: Key metrics load immediately -->
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

      <!-- GOOD: Important alerts load immediately -->
      <div class="alerts">
        <div class="alert alert-warning">
          Server load high - consider scaling
        </div>
        <div class="alert alert-info">
          New user registrations: +15%
        </div>
      </div>

      <!-- GOOD: Charts and detailed analytics deferred -->
      @defer (on viewport) {
        <div class="analytics-charts">
          <div class="chart">Revenue Chart</div>
          <div class="chart">User Growth Chart</div>
        </div>
      } @placeholder {
        <div class="charts-placeholder" style="height: 400px;">
          Loading analytics...
        </div>
      }

      <!-- GOOD: Data tables deferred -->
      @defer (on idle) {
        <table class="detailed-table">
          <thead>
            <tr><th>Date</th><th>Revenue</th><th>Users</th></tr>
          </thead>
          <tbody>
            <!-- Detailed data rows -->
          </tbody>
        </table>
      }
    </div>
  `,
  standalone: true
})
export class DashboardGoodComponent {}

// GOOD: Progressive loading strategy component
@Component({
  selector: 'app-progressive-loading',
  template: `
    <div class="page">
      <!-- Phase 1: Critical content (immediate) -->
      <header class="site-header">
        <div class="logo">Site Logo</div>
        <nav class="main-nav">
          <a href="/">Home</a>
          <a href="/products">Products</a>
          <a href="/contact">Contact</a>
        </nav>
      </header>

      <main class="main-content">
        <section class="hero">
          <h1>Page Title</h1>
          <p>Essential description visible immediately</p>
          <button class="cta-primary">Primary Action</button>
        </section>

        <section class="key-features">
          <h2>Key Features</h2>
          <div class="feature-grid">
            <div class="feature">Feature 1</div>
            <div class="feature">Feature 2</div>
            <div class="feature">Feature 3</div>
          </div>
        </section>
      </main>

      <!-- Phase 2: Above-fold but secondary content (viewport) -->
      @defer (on viewport) {
        <section class="secondary-content">
          <h2>More Information</h2>
          <div class="content-blocks">
            <div class="block">Additional info 1</div>
            <div class="block">Additional info 2</div>
          </div>
        </section>
      } @placeholder {
        <div class="secondary-placeholder">Loading more content...</div>
      }

      <!-- Phase 3: Below-fold content (idle) -->
      @defer (on idle) {
        <section class="footer-content">
          <div class="newsletter">Newsletter signup</div>
          <div class="social-links">Social media links</div>
          <div class="legal-links">Terms, Privacy, etc.</div>
        </section>
      }

      <!-- Phase 4: Non-essential content (interaction) -->
      @defer (on interaction) {
        <aside class="side-widgets">
          <div class="widget">Recent posts</div>
          <div class="widget">Popular articles</div>
        </aside>
      }
    </div>
  `,
  standalone: true
})
export class ProgressiveLoadingComponent {}