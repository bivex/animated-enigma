// BAD: Missing @error blocks for @defer anti-patterns
import { Component } from '@angular/core';

// BAD: @defer without @error block
@Component({
  selector: 'app-defer-no-error',
  template: `
    <div class="content">
      <!-- BAD: @defer without @error handling -->
      @defer {
        <app-heavy-component></app-heavy-component>
      } @placeholder {
        <div>Loading...</div>
      }
      <!-- BAD: No @error block - failures are silent -->
    </div>
  `,
  standalone: true
})
export class DeferNoErrorComponent {}

// BAD: Multiple @defer blocks without error handling
@Component({
  selector: 'app-multiple-defer-no-error',
  template: `
    <div class="multiple-content">
      <!-- BAD: First @defer without @error -->
      @defer (on viewport) {
        <app-image-gallery></app-image-gallery>
      } @placeholder {
        <div>Loading gallery...</div>
      }

      <!-- BAD: Second @defer without @error -->
      @defer (on interaction) {
        <app-interactive-chart></app-interactive-chart>
      } @loading (minimum 1s) {
        <div>Preparing interactive content...</div>
      }

      <!-- BAD: Third @defer without @error -->
      @defer {
        <app-third-party-widget></app-third-party-widget>
      }
    </div>
  `,
  standalone: true
})
export class MultipleDeferNoErrorComponent {}

// BAD: @defer with network-dependent content without error handling
@Component({
  selector: 'app-network-dependent',
  template: `
    <!-- BAD: Network requests without error handling -->
    @defer (on viewport) {
      <app-api-data-component></app-api-data-component>
    } @placeholder {
      <div>Fetching data...</div>
    }
    <!-- BAD: No @error block for network failures -->
  `,
  standalone: true
})
export class NetworkDependentComponent {}

// BAD: Complex @defer scenarios without error handling
@Component({
  selector: 'app-complex-defer-no-error',
  template: `
    <div class="complex-scenarios">
      <!-- BAD: Nested @defer without error handling -->
      @defer {
        <div class="nested-container">
          @defer (on interaction) {
            <app-nested-component></app-nested-component>
          } @placeholder {
            <div>Click to load nested content</div>
          }
          <!-- BAD: No @error for nested defer -->
        </div>
      } @placeholder {
        <div>Loading container...</div>
      }
      <!-- BAD: No @error for outer defer -->
    </div>
  `,
  standalone: true
})
export class ComplexDeferNoErrorComponent {}

// BAD: @defer with external dependencies without error handling
@Component({
  selector: 'app-external-deps',
  template: `
    <!-- BAD: External scripts/libraries without error handling -->
    @defer {
      <app-google-maps></app-google-maps>
    } @loading (minimum 2s) {
      <div>Initializing maps...</div>
    }
    <!-- BAD: No @error for script loading failures -->
  `,
  standalone: true
})
export class ExternalDepsComponent {}

// BAD: Conditional @defer without error handling
@Component({
  selector: 'app-conditional-defer-no-error',
  template: `
    <!-- BAD: Conditional defer without error handling -->
    @defer (when shouldLoad()) {
      <app-conditional-component></app-conditional-component>
    } @placeholder {
      <div>Condition not met yet...</div>
    }
    <!-- BAD: No @error block for conditional loading failures -->
  `,
  standalone: true
})
export class ConditionalDeferNoErrorComponent {
  shouldLoad = () => Math.random() > 0.5;
}

// BAD: @defer with @loading but no @error
@Component({
  selector: 'app-loading-no-error',
  template: `
    <!-- BAD: @loading specified but no @error -->
    @defer {
      <app-slow-component></app-slow-component>
    } @loading (after 500ms; minimum 1s) {
      <div class="loading-spinner">
        <div>Loading with minimum time...</div>
      </div>
    }
    <!-- BAD: No @error block - failures during minimum loading time are not handled -->
  `,
  standalone: true
})
export class LoadingNoErrorComponent {}

// BAD: @defer with only @placeholder
@Component({
  selector: 'app-placeholder-only',
  template: `
    <!-- BAD: Only @placeholder, no @error -->
    @defer (on viewport) {
      <app-scroll-component></app-scroll-component>
    } @placeholder {
      <div class="placeholder-content">
        <p>This content loads when scrolled into view</p>
        <div class="skeleton">Loading skeleton...</div>
      </div>
    }
    <!-- BAD: No @error handling for scroll-triggered loading failures -->
  `,
  standalone: true
})
export class PlaceholderOnlyComponent {}

// BAD: Large application with many @defer blocks missing error handling
@Component({
  selector: 'app-large-app-no-errors',
  template: `
    <div class="large-app">
      <header>Header Content</header>

      <!-- BAD: Multiple feature sections without error handling -->
      <section>
        @defer (on viewport) {
          <app-analytics-dashboard></app-analytics-dashboard>
        } @placeholder {
          <div>Analytics loading...</div>
        }
      </section>

      <section>
        @defer (on interaction) {
          <app-user-management></app-user-management>
        } @loading (minimum 500ms) {
          <div>User management loading...</div>
        }
      </section>

      <section>
        @defer {
          <app-reports-section></app-reports-section>
        }
      </section>

      <!-- BAD: All sections lack @error blocks -->
    </div>
  `,
  standalone: true
})
export class LargeAppNoErrorsComponent {}

// BAD: @defer in loops without error handling
@Component({
  selector: 'app-loop-defer-no-error',
  template: `
    <div class="loop-container">
      <!-- BAD: @defer in *ngFor without error handling -->
      <div *ngFor="let item of items; trackBy: trackById">
        @defer (on viewport) {
          <app-item-component [item]="item"></app-item-component>
        } @placeholder {
          <div>Item {{ item.id }} loading...</div>
        }
        <!-- BAD: No @error for each item -->
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class LoopDeferNoErrorComponent {
  items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ];

  trackById(index: number, item: any) {
    return item.id;
  }
}

// Import for CommonModule
import { CommonModule } from '@angular/common';