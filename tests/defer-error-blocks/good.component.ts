// GOOD: Proper @error blocks for @defer patterns
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// GOOD: @defer with proper @error block
@Component({
  selector: 'app-defer-with-error',
  template: `
    <div class="content">
      <!-- GOOD: @defer with complete error handling -->
      @defer {
        <app-heavy-component></app-heavy-component>
      } @placeholder {
        <div>Loading...</div>
      } @error {
        <div class="error-state">
          <h3>Failed to load component</h3>
          <p>Sorry, we couldn't load this content. Please try again.</p>
          <button (click)="retryLoad()">Retry</button>
        </div>
      }
    </div>
  `,
  standalone: true
})
export class DeferWithErrorComponent {
  retryLoad() {
    // GOOD: Error recovery mechanism
    window.location.reload();
  }
}

// GOOD: Multiple @defer blocks with comprehensive error handling
@Component({
  selector: 'app-multiple-defer-with-errors',
  template: `
    <div class="multiple-content">
      <!-- GOOD: First @defer with error handling -->
      @defer (on viewport) {
        <app-image-gallery></app-image-gallery>
      } @placeholder {
        <div>Loading gallery...</div>
      } @error {
        <div class="error-message">
          <p>Gallery failed to load</p>
          <small>Check your internet connection</small>
        </div>
      }

      <!-- GOOD: Second @defer with error handling -->
      @defer (on interaction) {
        <app-interactive-chart></app-interactive-chart>
      } @loading (minimum 1s) {
        <div>Preparing interactive content...</div>
      } @error {
        <div class="chart-error">
          <h4>Chart Error</h4>
          <p>Unable to load interactive chart</p>
          <button class="retry-btn" (click)="retryChart()">Try Again</button>
        </div>
      }

      <!-- GOOD: Third @defer with minimal error handling -->
      @defer {
        <app-third-party-widget></app-third-party-widget>
      } @error {
        <div class="widget-error">Widget unavailable</div>
      }
    </div>
  `,
  standalone: true
})
export class MultipleDeferWithErrorsComponent {
  retryChart() {
    // GOOD: Component-specific retry logic
    console.log('Retrying chart load...');
  }
}

// GOOD: Network-dependent content with proper error handling
@Component({
  selector: 'app-network-dependent',
  template: `
    <!-- GOOD: Network requests with error handling -->
    @defer (on viewport) {
      <app-api-data-component></app-api-data-component>
    } @placeholder {
      <div>Fetching data...</div>
    } @error {
      <div class="network-error">
        <h3>Connection Error</h3>
        <p>Unable to load data. Please check your internet connection.</p>
        <div class="error-actions">
          <button (click)="retry()">Retry</button>
          <button (click)="goOffline()">Work Offline</button>
        </div>
      </div>
    }
  `,
  standalone: true
})
export class NetworkDependentComponent {
  retry() {
    // GOOD: Retry mechanism
    window.location.reload();
  }

  goOffline() {
    // GOOD: Graceful degradation
    console.log('Switching to offline mode...');
  }
}

// GOOD: Complex @defer scenarios with comprehensive error handling
@Component({
  selector: 'app-complex-defer-with-errors',
  template: `
    <div class="complex-scenarios">
      <!-- GOOD: Nested @defer with error handling -->
      @defer {
        <div class="nested-container">
          @defer (on interaction) {
            <app-nested-component></app-nested-component>
          } @placeholder {
            <div>Click to load nested content</div>
          } @error {
            <div class="nested-error">
              <small>Nested content failed to load</small>
            </div>
          }
        </div>
      } @placeholder {
        <div>Loading container...</div>
      } @error {
        <div class="container-error">
          <p>Container failed to load</p>
          <button (click)="reloadContainer()">Reload Container</button>
        </div>
      }
    </div>
  `,
  standalone: true
})
export class ComplexDeferWithErrorsComponent {
  reloadContainer() {
    // GOOD: Container-specific reload
    console.log('Reloading container...');
  }
}

// GOOD: External dependencies with proper error handling
@Component({
  selector: 'app-external-deps',
  template: `
    <!-- GOOD: External scripts/libraries with error handling -->
    @defer {
      <app-google-maps></app-google-maps>
    } @loading (minimum 2s) {
      <div>Initializing maps...</div>
    } @error {
      <div class="maps-error">
        <h3>Maps Unavailable</h3>
        <p>Google Maps failed to load. This might be due to:</p>
        <ul>
          <li>Network connectivity issues</li>
          <li>Ad blocker interference</li>
          <li>Browser compatibility</li>
        </ul>
        <button (click)="openAlternative()">Use Alternative Map</button>
      </div>
    }
  `,
  standalone: true
})
export class ExternalDepsComponent {
  openAlternative() {
    // GOOD: Fallback solution
    window.open('https://www.openstreetmap.org', '_blank');
  }
}

// GOOD: Conditional @defer with error handling
@Component({
  selector: 'app-conditional-defer-with-error',
  template: `
    <!-- GOOD: Conditional defer with error handling -->
    @defer (when shouldLoad()) {
      <app-conditional-component></app-conditional-component>
    } @placeholder {
      <div>Condition not met yet...</div>
    } @error {
      <div class="conditional-error">
        <p>Conditional content failed to load</p>
        <p>Condition met: {{ shouldLoad() }}</p>
        <button (click)="forceLoad()">Force Load</button>
      </div>
    }
  `,
  standalone: true
})
export class ConditionalDeferWithErrorComponent {
  shouldLoad = () => Math.random() > 0.5;

  forceLoad() {
    // GOOD: Force load mechanism
    console.log('Forcing conditional load...');
  }
}

// GOOD: @defer with @loading and @error
@Component({
  selector: 'app-loading-with-error',
  template: `
    <!-- GOOD: Complete @defer with loading and error -->
    @defer {
      <app-slow-component></app-slow-component>
    } @loading (after 500ms; minimum 1s) {
      <div class="loading-spinner">
        <div>Loading with minimum time...</div>
        <div class="progress-bar"></div>
      </div>
    } @error {
      <div class="loading-error">
        <h4>Loading Error</h4>
        <p>The component failed to load after the minimum loading time.</p>
        <p>This could indicate a more serious issue.</p>
        <button (click)="reportError()">Report Error</button>
      </div>
    }
  `,
  standalone: true
})
export class LoadingWithErrorComponent {
  reportError() {
    // GOOD: Error reporting mechanism
    console.error('Component loading failed after minimum time');
  }
}

// GOOD: @defer with @placeholder and @error
@Component({
  selector: 'app-placeholder-with-error',
  template: `
    <!-- GOOD: @placeholder and @error for scroll-triggered content -->
    @defer (on viewport) {
      <app-scroll-component></app-scroll-component>
    } @placeholder {
      <div class="placeholder-content">
        <p>This content loads when scrolled into view</p>
        <div class="skeleton">Loading skeleton...</div>
      </div>
    } @error {
      <div class="scroll-error">
        <div class="error-icon">⚠️</div>
        <p>Content failed to load when scrolled into view</p>
        <p>This might be due to a network issue or component error.</p>
        <button (click)="scrollToTop()">Scroll to Top</button>
      </div>
    }
  `,
  standalone: true
})
export class PlaceholderWithErrorComponent {
  scrollToTop() {
    // GOOD: Error recovery with UX improvement
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// GOOD: Large application with comprehensive error handling
@Component({
  selector: 'app-large-app-with-errors',
  template: `
    <div class="large-app">
      <header>Header Content</header>

      <!-- GOOD: Analytics dashboard with error handling -->
      <section>
        @defer (on viewport) {
          <app-analytics-dashboard></app-analytics-dashboard>
        } @placeholder {
          <div>Analytics loading...</div>
        } @error {
          <div class="section-error">
            <h4>Analytics Unavailable</h4>
            <p>Unable to load analytics dashboard</p>
            <button (click)="retrySection('analytics')">Retry</button>
          </div>
        }
      </section>

      <!-- GOOD: User management with error handling -->
      <section>
        @defer (on interaction) {
          <app-user-management></app-user-management>
        } @loading (minimum 500ms) {
          <div>User management loading...</div>
        } @error {
          <div class="section-error">
            <h4>User Management Error</h4>
            <p>Failed to load user management interface</p>
            <button (click)="retrySection('users')">Retry</button>
          </div>
        }
      </section>

      <!-- GOOD: Reports section with error handling -->
      <section>
        @defer {
          <app-reports-section></app-reports-section>
        } @error {
          <div class="section-error">
            <h4>Reports Unavailable</h4>
            <p>Unable to load reports section</p>
            <button (click)="retrySection('reports')">Retry</button>
          </div>
        }
      </section>
    </div>
  `,
  standalone: true
})
export class LargeAppWithErrorsComponent {
  retrySection(section: string) {
    // GOOD: Section-specific retry logic
    console.log(`Retrying ${section} section...`);
  }
}

// GOOD: @defer in loops with error handling
@Component({
  selector: 'app-loop-defer-with-errors',
  template: `
    <div class="loop-container">
      <!-- GOOD: @defer in *ngFor with error handling -->
      <div *ngFor="let item of items; trackBy: trackById">
        @defer (on viewport) {
          <app-item-component [item]="item"></app-item-component>
        } @placeholder {
          <div>Item {{ item.id }} loading...</div>
        } @error {
          <div class="item-error">
            <small>Failed to load item {{ item.id }}</small>
            <button (click)="retryItem(item.id)" class="mini-retry">↻</button>
          </div>
        }
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class LoopDeferWithErrorsComponent {
  items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ];

  trackById(index: number, item: any) {
    return item.id;
  }

  retryItem(itemId: number) {
    // GOOD: Item-specific retry logic
    console.log(`Retrying item ${itemId}...`);
  }
}