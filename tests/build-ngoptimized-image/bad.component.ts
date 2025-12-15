// BAD: NgOptimizedImage missing priority anti-patterns
import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

// BAD: Hero image without priority
@Component({
  selector: 'app-hero-section',
  template: `
    <div class="hero">
      <!-- BAD: LCP image without priority attribute -->
      <img
        ngSrc="/assets/hero-image.jpg"
        width="1200"
        height="800"
        alt="Hero image"
        class="hero-image"
      />
      <!-- BAD: Missing priority - hurts LCP -->
      <h1>Welcome to our site</h1>
      <p>This hero image should load first</p>
    </div>
  `,
  standalone: false,
  imports: [NgOptimizedImage]
})
export class HeroSectionComponent {}

// BAD: Product image without priority
@Component({
  selector: 'app-product-card',
  template: `
    <div class="product-card">
      <!-- BAD: Product image without priority -->
      <img
        ngSrc="/assets/product-1.jpg"
        width="300"
        height="300"
        alt="Product image"
        class="product-image"
      />
      <!-- BAD: No priority attribute -->
      <h3>Product Name</h3>
      <p>$29.99</p>
    </div>
  `,
  standalone: false,
  imports: [NgOptimizedImage]
})
export class ProductCardComponent {}

// BAD: Banner image without priority
@Component({
  selector: 'app-banner',
  template: `
    <div class="banner">
      <!-- BAD: Banner image missing priority -->
      <img
        ngSrc="/assets/banner.jpg"
        width="800"
        height="200"
        alt="Promotional banner"
        class="banner-image"
      />
      <!-- BAD: Should have priority for above-the-fold content -->
    </div>
  `,
  standalone: false,
  imports: [NgOptimizedImage]
})
export class BannerComponent {}

// BAD: Logo image without priority
@Component({
  selector: 'app-header',
  template: `
    <header class="header">
      <!-- BAD: Logo without priority -->
      <img
        ngSrc="/assets/logo.png"
        width="150"
        height="50"
        alt="Company logo"
        class="logo"
      />
      <!-- BAD: Header logo should be prioritized -->
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

// BAD: Carousel first image without priority
@Component({
  selector: 'app-image-carousel',
  template: `
    <div class="carousel">
      <!-- BAD: First carousel image without priority -->
      <img
        ngSrc="/assets/slide-1.jpg"
        width="800"
        height="400"
        alt="First slide"
        class="carousel-image active"
      />
      <!-- BAD: First visible image should be prioritized -->
      <button class="prev">Previous</button>
      <button class="next">Next</button>
    </div>
  `,
  standalone: false,
  imports: [NgOptimizedImage]
})
export class ImageCarouselComponent {}

// BAD: Article hero image without priority
@Component({
  selector: 'app-article-header',
  template: `
    <article>
      <!-- BAD: Article hero image missing priority -->
      <img
        ngSrc="/assets/article-hero.jpg"
        width="1000"
        height="500"
        alt="Article hero"
        class="article-hero"
      />
      <!-- BAD: Article hero should be prioritized -->
      <h1>Article Title</h1>
      <p class="excerpt">Article excerpt...</p>
    </article>
  `,
  standalone: false,
  imports: [NgOptimizedImage]
})
export class ArticleHeaderComponent {}

// BAD: Profile avatar without priority
@Component({
  selector: 'app-user-profile',
  template: `
    <div class="profile">
      <!-- BAD: Profile avatar without priority -->
      <img
        ngSrc="/assets/avatar.jpg"
        width="100"
        height="100"
        alt="User avatar"
        class="avatar"
      />
      <!-- BAD: Above-the-fold avatar should be prioritized -->
      <h2>John Doe</h2>
      <p>Software Developer</p>
    </div>
  `,
  standalone: false,
  imports: [NgOptimizedImage]
})
export class UserProfileComponent {}

// BAD: Dashboard key metric image without priority
@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard">
      <!-- BAD: Key metric visualization without priority -->
      <img
        ngSrc="/assets/metrics-chart.jpg"
        width="600"
        height="300"
        alt="Key metrics"
        class="metrics-chart"
      />
      <!-- BAD: Critical dashboard image should be prioritized -->
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

// BAD: Landing page CTA image without priority
@Component({
  selector: 'app-landing-cta',
  template: `
    <section class="cta-section">
      <!-- BAD: CTA image missing priority -->
      <img
        ngSrc="/assets/cta-image.jpg"
        width="400"
        height="300"
        alt="Call to action"
        class="cta-image"
      />
      <!-- BAD: Conversion-critical image should be prioritized -->
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

// BAD: Testimonial profile image without priority
@Component({
  selector: 'app-testimonial',
  template: `
    <div class="testimonial">
      <!-- BAD: Testimonial image without priority -->
      <img
        ngSrc="/assets/testimonial-avatar.jpg"
        width="80"
        height="80"
        alt="Customer testimonial"
        class="testimonial-avatar"
      />
      <!-- BAD: Above-the-fold testimonial should be prioritized -->
      <blockquote>"Great product!"</blockquote>
      <cite>Jane Smith, CEO</cite>
    </div>
  `,
  standalone: false,
  imports: [NgOptimizedImage]
})
export class TestimonialComponent {}

// BAD: News article thumbnail without priority
@Component({
  selector: 'app-news-card',
  template: `
    <div class="news-card">
      <!-- BAD: News thumbnail without priority -->
      <img
        ngSrc="/assets/news-thumb.jpg"
        width="250"
        height="150"
        alt="News thumbnail"
        class="news-thumb"
      />
      <!-- BAD: News thumbnail should be prioritized for content discovery -->
      <h3>Breaking News</h3>
      <p>Important news story...</p>
    </div>
  `,
  standalone: false,
  imports: [NgOptimizedImage]
})
export class NewsCardComponent {}

// BAD: E-commerce category image without priority
@Component({
  selector: 'app-category-card',
  template: `
    <div class="category-card">
      <!-- BAD: Category image missing priority -->
      <img
        ngSrc="/assets/category-electronics.jpg"
        width="350"
        height="200"
        alt="Electronics category"
        class="category-image"
      />
      <!-- BAD: Category navigation image should be prioritized -->
      <h3>Electronics</h3>
      <p>Latest gadgets and devices</p>
    </div>
  `,
  standalone: false,
  imports: [NgOptimizedImage]
})
export class CategoryCardComponent {}

// BAD: Search results first item image without priority
@Component({
  selector: 'app-search-results',
  template: `
    <div class="search-results">
      <!-- BAD: First search result image without priority -->
      <div class="result-item">
        <img
          ngSrc="/assets/result-1.jpg"
          width="200"
          height="150"
          alt="Search result 1"
          class="result-image"
        />
        <!-- BAD: First search result should be prioritized -->
        <h4>Result Title 1</h4>
        <p>Description...</p>
      </div>
    </div>
  `,
  standalone: false,
  imports: [NgOptimizedImage]
})
export class SearchResultsComponent {}

// BAD: Modal dialog image without priority
@Component({
  selector: 'app-modal',
  template: `
    <div class="modal">
      <div class="modal-content">
        <!-- BAD: Modal image without priority -->
        <img
          ngSrc="/assets/modal-image.jpg"
          width="500"
          height="300"
          alt="Modal content"
          class="modal-image"
        />
        <!-- BAD: Modal images can be prioritized if critical -->
        <h3>Modal Title</h3>
        <p>Modal content...</p>
      </div>
    </div>
  `,
  standalone: false,
  imports: [NgOptimizedImage]
})
export class ModalComponent {}