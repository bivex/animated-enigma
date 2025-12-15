// GOOD: Standalone components in @defer blocks patterns
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// GOOD: Standalone heavy chart component
@Component({
  selector: 'app-heavy-chart',
  template: `
    <div class="chart-container">
      <h3>Heavy Chart Component</h3>
      <div class="chart-placeholder">
        <!-- Complex chart implementation -->
        <canvas #chart></canvas>
      </div>
    </div>
  `,
  // GOOD: Standalone component
  standalone: true,
  imports: [CommonModule]
})
export class HeavyChartComponent {
  constructor() {
    // GOOD: Heavy initialization in constructor (but component is lazy loaded)
    this.initializeChart();
  }

  private initializeChart() {
    // Simulate heavy chart library initialization
    console.log('Initializing heavy chart...');
  }
}

// GOOD: Standalone complex table component
@Component({
  selector: 'app-complex-table',
  template: `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Value</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of data">
            <td>{{ item.name }}</td>
            <td>{{ item.value }}</td>
            <td>{{ item.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  // GOOD: Standalone with required imports
  standalone: true,
  imports: [CommonModule]
})
export class ComplexTableComponent {
  data = [
    { name: 'Item 1', value: 100, status: 'Active' },
    { name: 'Item 2', value: 200, status: 'Inactive' },
    // Lots of data...
  ];
}

// GOOD: Dashboard using @defer with standalone components
@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard">
      <h1>Dashboard</h1>

      <!-- GOOD: @defer with standalone component - proper lazy loading -->
      @defer {
        <app-heavy-chart></app-heavy-chart>
      } @placeholder {
        <div class="placeholder">Loading chart...</div>
      }

      <!-- GOOD: @defer with standalone component -->
      @defer (on viewport) {
        <app-complex-table></app-complex-table>
      } @placeholder {
        <div class="placeholder">Loading table...</div>
      }

      <!-- GOOD: Multiple standalone components in one defer block -->
      @defer (on interaction) {
        <app-heavy-chart></app-heavy-chart>
        <app-complex-table></app-complex-table>
        <app-additional-content></app-additional-content>
      }
    </div>
  `,
  // GOOD: Standalone dashboard importing the deferred components
  standalone: true,
  imports: [CommonModule, HeavyChartComponent, ComplexTableComponent, AdditionalContentComponent]
})
export class DashboardComponent {}

// GOOD: Additional standalone component for defer block
@Component({
  selector: 'app-additional-content',
  template: `
    <div class="additional-content">
      <p>Additional lazy-loaded content</p>
      <button>Interactive element</button>
    </div>
  `,
  standalone: true
})
export class AdditionalContentComponent {}

// GOOD: Parent component with proper standalone structure
@Component({
  selector: 'app-parent',
  template: `
    <div class="parent">
      <h2>Parent Component</h2>

      <!-- GOOD: @defer with standalone components -->
      @defer {
        <app-heavy-chart></app-heavy-chart>
      }

      <!-- GOOD: Conditional defer with standalone components -->
      @defer (when showTable()) {
        <app-complex-table></app-complex-table>
      }
    </div>
  `,
  // GOOD: Standalone with imported components
  standalone: true,
  imports: [CommonModule, HeavyChartComponent, ComplexTableComponent]
})
export class ParentComponent {
  showTable = () => true;
}

// GOOD: Complex component hierarchy with proper standalone structure
@Component({
  selector: 'app-complex-parent',
  template: `
    <div class="complex-parent">
      <!-- GOOD: Deferring standalone component tree -->
      @defer (on viewport) {
        <app-parent></app-parent>
      }

      <!-- GOOD: Nested defer blocks with standalone content -->
      @defer {
        <div class="nested-content">
          @defer (on interaction) {
            <app-heavy-chart></app-heavy-chart>
          }
        </div>
      }
    </div>
  `,
  // GOOD: Standalone with proper imports
  standalone: true,
  imports: [CommonModule, ParentComponent, HeavyChartComponent]
})
export class ComplexParentComponent {}

// GOOD: Component with proper @defer and error handling
@Component({
  selector: 'app-robust-defer',
  template: `
    <!-- GOOD: @defer with proper error handling -->
    @defer {
      <app-heavy-chart></app-heavy-chart>
    } @loading (minimum 500ms) {
      <div class="loading">Loading chart...</div>
    } @error {
      <div class="error">Failed to load chart</div>
    }

    <!-- GOOD: Multiple defer blocks with different triggers -->
    @defer (on viewport) {
      <app-complex-table></app-complex-table>
    } @placeholder {
      <div class="placeholder">Scroll to load table</div>
    }
  `,
  standalone: true,
  imports: [CommonModule, HeavyChartComponent, ComplexTableComponent]
})
export class RobustDeferComponent {}

// GOOD: Feature module that exports standalone components
@Component({
  selector: 'app-feature-shell',
  template: `
    <div class="feature-shell">
      <h1>Feature Shell</h1>
      <!-- GOOD: Deferring standalone components exported from module -->
      @defer {
        <app-heavy-chart></app-heavy-chart>
      }
    </div>
  `,
  standalone: true,
  imports: [CommonModule, HeavyChartComponent]
})
export class FeatureShellComponent {}

// GOOD: Utility function for dynamic component loading
@Component({
  selector: 'app-dynamic-defer',
  template: `
    <div class="dynamic-defer">
      <!-- GOOD: @defer can be used with dynamically imported standalone components -->
      @defer (when loadComponent()) {
        <ng-container *ngComponentOutlet="componentType"></ng-container>
      }
    </div>
  `,
  standalone: true,
  imports: [CommonModule, NgComponentOutlet]
})
export class DynamicDeferComponent {
  componentType: any = null;
  loadComponent = () => false;

  async loadHeavyComponent() {
    // GOOD: Dynamic import of standalone component
    const { HeavyChartComponent } = await import('./heavy-chart.component');
    this.componentType = HeavyChartComponent;
  }
}

// Import for NgComponentOutlet
import { NgComponentOutlet } from '@angular/common';