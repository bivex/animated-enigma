// BAD: Non-standalone components in @defer blocks anti-patterns
import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// BAD: Non-standalone component in module
@Component({
  selector: 'app-heavy-chart',
  template: `
    <div class="chart-container">
      <h3>Heavy Chart Component</h3>
      <div class="chart-placeholder">
        <!-- Complex chart implementation -->
        <canvas id="chart"></canvas>
      </div>
    </div>
  `,
  // BAD: Not standalone - requires module
  standalone: false
})
export class HeavyChartComponent {
  constructor() {
    // BAD: Heavy initialization in constructor
    this.initializeChart();
  }

  private initializeChart() {
    // Simulate heavy chart library initialization
    console.log('Initializing heavy chart...');
  }
}

// BAD: Another non-standalone component
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
  // BAD: Not standalone
  standalone: false
})
export class ComplexTableComponent {
  data = [
    { name: 'Item 1', value: 100, status: 'Active' },
    { name: 'Item 2', value: 200, status: 'Inactive' },
    // Lots of data...
  ];
}

// BAD: Component using @defer with non-standalone components
@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard">
      <h1>Dashboard</h1>

      <!-- BAD: @defer with non-standalone component - defeats lazy loading -->
      @defer {
        <app-heavy-chart></app-heavy-chart>
      } @placeholder {
        <div class="placeholder">Loading chart...</div>
      }

      <!-- BAD: Another @defer with non-standalone component -->
      @defer (on viewport) {
        <app-complex-table></app-complex-table>
      } @placeholder {
        <div class="placeholder">Loading table...</div>
      }

      <!-- BAD: Multiple non-standalone components in one defer block -->
      @defer (on interaction) {
        <app-heavy-chart></app-heavy-chart>
        <app-complex-table></app-complex-table>
        <div class="additional-content">
          <p>More content that won't be lazy loaded</p>
        </div>
      }
    </div>
  `,
  standalone: false
})
export class DashboardComponent {}

// BAD: Module that includes the components
@NgModule({
  declarations: [
    HeavyChartComponent,
    ComplexTableComponent,
    DashboardComponent
  ],
  imports: [CommonModule],
  exports: [DashboardComponent]
})
export class DashboardModule { }

// BAD: Lazy loaded module with @defer usage
@NgModule({
  declarations: [HeavyChartComponent, ComplexTableComponent],
  imports: [CommonModule]
})
export class LazyModule { }

// BAD: Parent component trying to use @defer with module-based components
@Component({
  selector: 'app-parent',
  template: `
    <div class="parent">
      <h2>Parent Component</h2>

      <!-- BAD: @defer importing from module - still eagerly loaded -->
      @defer {
        <app-heavy-chart></app-heavy-chart>
      }

      <!-- BAD: Conditional defer with non-standalone components -->
      @defer (when showTable()) {
        <app-complex-table></app-complex-table>
      }
    </div>
  `,
  standalone: false
})
export class ParentComponent {
  showTable = () => true;
}

// BAD: Complex component hierarchy with @defer
@Component({
  selector: 'app-complex-parent',
  template: `
    <div class="complex-parent">
      <!-- BAD: Deferring module-based component tree -->
      @defer (on viewport) {
        <app-parent></app-parent>
      }

      <!-- BAD: Nested defer blocks with non-standalone content -->
      @defer {
        <div class="nested-content">
          @defer (on interaction) {
            <app-heavy-chart></app-heavy-chart>
          }
        </div>
      }
    </div>
  `,
  standalone: false
})
export class ComplexParentComponent {}

// BAD: Component with @defer and module dependencies
@Component({
  selector: 'app-module-dependent',
  template: `
    <!-- BAD: @defer with components that have module dependencies -->
    @defer {
      <app-heavy-chart></app-heavy-chart>
      <app-complex-table></app-complex-table>
    } @loading (minimum 1s) {
      <div>Loading module-dependent components...</div>
    }
  `,
  standalone: false
})
export class ModuleDependentComponent {}

// BAD: Attempting to make component "standalone" but still using modules
@Component({
  selector: 'app-pseudo-standalone',
  template: `
    <div>
      <!-- BAD: Marked as standalone but still needs module imports -->
      <app-heavy-chart></app-heavy-chart>
    </div>
  `,
  standalone: true,  // BAD: False advertising
  imports: []  // BAD: Missing required imports
})
export class PseudoStandaloneComponent {}