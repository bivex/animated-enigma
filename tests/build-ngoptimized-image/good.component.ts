// GOOD: NgOptimizedImage with proper priority usage
import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

// GOOD: Hero image with priority
@Component({
  selector: 'app-hero-section',
  template: `
    <div class="hero">
      <!-- GOOD: LCP image with priority attribute -->
      <img
        ngSrc="/assets/hero-image.jpg"
        width="1200"
        height="800"
        alt="Hero image"
        class="hero-image"
        priority
      />
      <!-- GOOD: priority ensures fastest loading for LCP -->
      <h1>Welcome to our site</h1>
      <p>This hero image loads first</p>
    </div>
  `,
  standalone: false,
  imports: [NgOptimizedImage]
})
export class HeroSectionComponent {}

// GOOD: Product image with appropriate priority
@Component({
  selector: 'app-product-card',
  template: `
    <div class="product-card">
      <!-- GOOD: Product image with priority for e-commerce -->
      <img
        ngSrc="/assets/product-1.jpg"
        width="300"
        height="300"
        alt="Product image"
        class="product-image"
        priority
      />
      <!-- GOOD: Prioritized for conversion-critical images -->
      <h3>Product Name</h3>
      <p>$29.99</p>
    </div>
  `,
  standalone: false,
  imports: [NgOptimizedImage]
})
export class ProductCardComponent {}

// GOOD: Banner image with priority
@Component({
  selector: 'app-banner',
  template: `
    <div class="banner">
      <!-- GOOD: Banner image with priority for above-the-fold content -->
      <img
        ngSrc="/assets/banner.jpg"
        width="800"
        height="200"
        alt="Promotional banner"
        class="banner-image"
        priority
      />
      <!-- GOOD: Prioritized for visual impact -->
    </div>
  `,
  standalone: false,
  imports: [NgOptimizedImage]
})
export class BannerComponent {}

// GOOD: Logo image with priority
@Component({
  selector: 'app-header',
  template: `
    <header class="header">
      <!-- GOOD: Logo with priority for brand recognition -->
      <img
        ngSrc="/assets/logo.png"
        width="150"
        height="50"
        alt="Company logo"
        class="logo"
        priority
      />
      <!-- GOOD: Critical for user orientation -->
      <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
      </nav>
    </header>
  `,
  standalone: false,
  imports: [NgOptimizedImage]
})
export class HeaderComponent {}

// GOOD: Carousel first image with priority
@Component({
  selector: 'app-image-carousel',
  template: `
    <div class="carousel">
      <!-- GOOD: First carousel image with priority -->
      <img
        ngSrc="/assets/slide-1.jpg"
        width="800"
        height="400"
        alt="First slide"
        class="carousel-image active"
        priority
      />
      <!-- GOOD: First visible image prioritized -->
      <button class="prev">Previous</button>
      <button class="next">Next</button>
    </div>
  `,
  standalone: false,
  imports: [NgOptimizedImage]
})
export class ImageCarouselComponent {}

// GOOD: Article hero image with priority
@Component({
  selector: 'app-article-header',
  template: `
    <article>
      <!-- GOOD: Article hero image with priority -->
      <img
        ngSrc="/assets/article-hero.jpg"
        width="1000"
        height="500"
        alt="Article hero"
        class="article-hero"
        priority
      />
      <!-- GOOD: Critical for content engagement -->
      <h1>Article Title</h1>
      <p class="excerpt">Article excerpt...</p>
    </article>
  `,
  standalone: false,
  imports: [NgOptimizedImage]
})
export class ArticleHeaderComponent {}

// GOOD: Profile avatar with priority
@Component({
  selector: 'app-user-profile',
  template: `
    <div class="profile">
      <!-- GOOD: Profile avatar with priority -->
      <img
        ngSrc="/assets/avatar.jpg"
        width="100"
        height="100"
        alt="User avatar"
        class="avatar"
        priority
      />
      <!-- GOOD: Important for user identification -->
      <h2>John Doe</h2>
      <p>Software Developer</p>
    </div>
  `,
  standalone: false,
  imports: [NgOptimizedImage]
})
export class UserProfileComponent {}

// GOOD: Dashboard key metric image with priority
@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard">
      <!-- GOOD: Key metric visualization with priority -->
      <img
        ngSrc="/assets/metrics-chart.jpg"
        width="600"
        height="300"
        alt="Key metrics"
        class="metrics-chart"
        priority
      />
      <!-- GOOD: Critical business data prioritized -->
      <div class="metrics">
        <div class="metric">Revenue: $1.2M</div>
        <div class="metric">Users: 10K</div>
      </div>
    </div>
  `,
  standalone: false,
  imports: [NgOptimizedImage]
})
export class DashboardComponent {}

// GOOD: Landing page CTA image with priority
@Component({
  selector: 'app-landing-cta',
  template: `
    <section class="cta-section">
      <!-- GOOD: CTA image with priority for conversions -->
      <img
        ngSrc="/assets/cta-image.jpg"
        width="400"
        height="300"
        alt="Call to action"
        class="cta-image"
        priority
      />
      <!-- GOOD: Critical for conversion optimization -->
      <div class="cta-content">
        <h2>Start Your Free Trial</h2>
        <button>Sign Up Now</button>
      </div>
    </section>
  `,
  standalone: false,
  imports: [NgOptimizedImage]
})
export class LandingCtaComponent {}

// GOOD: Testimonial profile image with priority
@Component({
  selector: 'app-testimonial',
  template: `
    <div class="testimonial">
      <!-- GOOD: Testimonial image with priority -->
      <img
        ngSrc="/assets/testimonial-avatar.jpg"
        width="80"
        height="80"
        alt="Customer testimonial"
        class="testimonial-avatar"
        priority
      />
      <!-- GOOD: Important for social proof -->
      <blockquote>"Great product!"</blockquote>
      <cite>Jane Smith, CEO</cite>
    </div>
  `,
  standalone: false,
  imports: [NgOptimizedImage]
})
export class TestimonialComponent {}

// GOOD: News article thumbnail with priority
@Component({
  selector: 'app-news-card',
  template: `
    <div class="news-card">
      <!-- GOOD: News thumbnail with priority for content discovery -->
      <img
        ngSrc="/assets/news-thumb.jpg"
        width="250"
        height="150"
        alt="News thumbnail"
        class="news-thumb"
        priority
      />
      <!-- GOOD: Critical for news consumption -->
      <h3>Breaking News</h3>
      <p>Important news story...</p>
    </div>
  `,
  standalone: false,
  imports: [NgOptimizedImage]
})
export class NewsCardComponent {}

// GOOD: E-commerce category image with priority
@Component({
  selector: 'app-category-card',
  template: `
    <div class="category-card">
      <!-- GOOD: Category image with priority for navigation -->
      <img
        ngSrc="/assets/category-electronics.jpg"
        width="350"
        height="200"
        alt="Electronics category"
        class="category-image"
        priority
      />
      <!-- GOOD: Important for product discovery -->
      <h3>Electronics</h3>
      <p>Latest gadgets and devices</p>
    </div>
  `,
  standalone: false,
  imports: [NgOptimizedImage]
})
export class CategoryCardComponent {}

// GOOD: Search results first item image with priority
@Component({
  selector: 'app-search-results',
  template: `
    <div class="search-results">
      <!-- GOOD: First search result image with priority -->
      <div class="result-item">
        <img
          ngSrc="/assets/result-1.jpg"
          width="200"
          height="150"
          alt="Search result 1"
          class="result-image"
          priority
        />
        <!-- GOOD: Most relevant result prioritized -->
        <h4>Result Title 1</h4>
        <p>Description...</p>
      </div>
    </div>
  `,
  standalone: false,
  imports: [NgOptimizedImage]
})
export class SearchResultsComponent {}

// GOOD: Modal dialog image prioritization strategy
@Component({
  selector: 'app-modal',
  template: `
    <div class="modal">
      <div class="modal-content">
        <!-- GOOD: Modal images without priority (not critical for LCP) -->
        <img
          ngSrc="/assets/modal-image.jpg"
          width="500"
          height="300"
          alt="Modal content"
          class="modal-image"
        />
        <!-- GOOD: Modal images don't need priority unless critical -->
        <h3>Modal Title</h3>
        <p>Modal content...</p>
      </div>
    </div>
  `,
  standalone: false,
  imports: [NgOptimizedImage]
})
export class ModalComponent {}

// GOOD: Below-fold images without priority
@Component({
  selector: 'app-footer-gallery',
  template: `
    <div class="footer-gallery">
      <!-- GOOD: Footer images without priority (below fold) -->
      <img
        ngSrc="/assets/gallery-1.jpg"
        width="200"
        height="150"
        alt="Gallery image 1"
        class="gallery-image"
      />
      <img
        ngSrc="/assets/gallery-2.jpg"
        width="200"
        height="150"
        alt="Gallery image 2"
        class="gallery-image"
      />
      <!-- GOOD: Non-critical images don't need priority -->
    </div>
  `,
  standalone: false,
  imports: [NgOptimizedImage]
})
export class FooterGalleryComponent {}

// GOOD: Progressive loading strategy
@Component({
  selector: 'app-progressive-images',
  template: `
    <div class="progressive-images">
      <!-- GOOD: Critical images with priority -->
      <img
        ngSrc="/assets/critical-1.jpg"
        width="400"
        height="300"
        alt="Critical image 1"
        priority
      />
      <img
        ngSrc="/assets/critical-2.jpg"
        width="400"
        height="300"
        alt="Critical image 2"
        priority
      />

      <!-- GOOD: Non-critical images without priority -->
      <img
        ngSrc="/assets/optional-1.jpg"
        width="200"
        height="150"
        alt="Optional image 1"
      />
      <img
        ngSrc="/assets/optional-2.jpg"
        width="200"
        height="150"
        alt="Optional image 2"
      />
    </div>
  `,
  standalone: false,
  imports: [NgOptimizedImage]
})
export class ProgressiveImagesComponent {}

// GOOD: Conditional priority based on viewport
@Component({
  selector: 'app-adaptive-priority',
  template: `
    <div class="adaptive-priority">
      <!-- GOOD: Conditional priority based on screen size -->
      <img
        ngSrc="/assets/responsive-image.jpg"
        width="800"
        height="400"
        alt="Responsive image"
        [priority]="isAboveFold()"
        class="responsive-image"
      />
      <!-- GOOD: Priority only for larger screens where image is above fold -->
    </div>
  `,
  standalone: false,
  imports: [NgOptimizedImage]
})
export class AdaptivePriorityComponent {
  // GOOD: Logic to determine if image is above fold
  isAboveFold(): boolean {
    // Implementation would check viewport and image position
    return window.innerWidth > 768; // Example: priority on desktop only
  }
}