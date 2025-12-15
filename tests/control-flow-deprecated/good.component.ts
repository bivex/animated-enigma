// GOOD: Modern control flow syntax patterns
import { Component } from '@angular/core';

// GOOD: Component using modern @if syntax
@Component({
  selector: 'app-modern-if',
  template: `
    <div>
      <!-- GOOD: Using modern @if instead of *ngIf -->
      @if (isVisible) {
        <div>
          This content is conditionally shown
        </div>
      }

      <!-- GOOD: @if with @else -->
      @if (user) {
        <div>
          Welcome, {{ user.name }}!
        </div>
      } @else {
        <div>
          Please log in
        </div>
      }

      <!-- GOOD: Complex conditional logic -->
      @if (isAdmin) {
        <div>
          <h2>Admin Panel</h2>
          <p>You have admin privileges</p>
        </div>
      } @else if (isModerator) {
        <div>
          <h2>Moderator Panel</h2>
          <p>You have moderator privileges</p>
        </div>
      } @else {
        <div>
          <h2>User Dashboard</h2>
          <p>Welcome to your dashboard</p>
        </div>
      }
    </div>
  `,
  standalone: false
})
export class ModernIfComponent {
  isVisible = true;
  user: { name: string } | null = { name: 'John' };
  isAdmin = false;
  isModerator = true;
}

// GOOD: Component using modern @for syntax
@Component({
  selector: 'app-modern-for',
  template: `
    <div>
      <!-- GOOD: Using modern @for instead of *ngFor -->
      <ul>
        @for (item of items; track item.id) {
          <li>{{ $index + 1 }}. {{ item.name }}</li>
        }
      </ul>

      <!-- GOOD: @for with conditional content -->
      @for (item of items; track item.id) {
        @if (item.visible) {
          <div>{{ item.name }}</div>
        }
      }

      <!-- GOOD: Nested @for loops -->
      <div>
        @for (category of categories; track category.name) {
          <h3>{{ category.name }}</h3>
          <ul>
            @for (item of category.items; track item) {
              <li>{{ item }}</li>
            }
          </ul>
        }
      </div>

      <!-- GOOD: @for with @empty -->
      @for (item of items; track item.id) {
        <div>{{ item.name }}</div>
      } @empty {
        <div>No items found</div>
      }
    </div>
  `,
  standalone: false
})
export class ModernForComponent {
  items = [
    { id: 1, name: 'Item 1', visible: true },
    { id: 2, name: 'Item 2', visible: false },
    { id: 3, name: 'Item 3', visible: true }
  ];

  categories = [
    { name: 'Fruits', items: ['Apple', 'Banana', 'Orange'] },
    { name: 'Vegetables', items: ['Carrot', 'Broccoli', 'Spinach'] }
  ];
}

// GOOD: Component using modern @switch syntax
@Component({
  selector: 'app-modern-switch',
  template: `
    <div>
      <!-- GOOD: Using modern @switch instead of *ngSwitch -->
      @switch (status) {
        @case ('loading') {
          <div>Loading...</div>
        }
        @case ('success') {
          <div>Success! Data loaded.</div>
        }
        @case ('error') {
          <div>Error: Something went wrong</div>
        }
        @default {
          <div>Unknown status</div>
        }
      }

      <!-- GOOD: Complex @switch with component rendering -->
      @switch (userType) {
        @case ('admin') {
          <admin-panel></admin-panel>
        }
        @case ('moderator') {
          <moderator-panel></moderator-panel>
        }
        @case ('user') {
          <user-panel></user-panel>
        }
        @default {
          <guest-panel></guest-panel>
        }
      }

      <!-- GOOD: @switch with expressions -->
      @switch (score) {
        @case (100) {
          <div>Perfect score!</div>
        }
        @case (90) {
          <div>Excellent!</div>
        }
        @case (80) {
          <div>Good job!</div>
        }
        @default {
          <div>Keep practicing!</div>
        }
      }
    </div>
  `,
  standalone: false
})
export class ModernSwitchComponent {
  status: 'loading' | 'success' | 'error' = 'loading';
  userType: 'admin' | 'moderator' | 'user' | 'guest' = 'user';
  score = 85;
}

// GOOD: Component using consistent modern syntax
@Component({
  selector: 'app-consistent-modern',
  template: `
    <div>
      <!-- GOOD: Consistent use of modern control flow -->
      @if (showList) {
        <ul>
          @for (item of items; track item.id) {
            <li>{{ item.name }}</li>
          }
        </ul>
      }

      <!-- GOOD: Modern syntax with proper nesting -->
      @for (item of items; track item.id) {
        @if (item.visible) {
          <div>{{ item.name }}</div>
        }
      }

      <!-- GOOD: Modern @switch with @if inside -->
      @switch (mode) {
        @case ('edit') {
          @if (canEdit) {
            <div>Edit mode</div>
          }
        }
        @case ('view') {
          @if (canView) {
            <div>View mode</div>
          }
        }
      }
    </div>
  `,
  standalone: false
})
export class ConsistentModernComponent {
  showList = true;
  items = [
    { id: 1, name: 'Item 1', visible: true },
    { id: 2, name: 'Item 2', visible: false },
    { id: 3, name: 'Item 3', visible: true }
  ];
  mode: 'edit' | 'view' = 'view';
  canEdit = true;
  canView = true;
}

// GOOD: Complex component with modern control flow
@Component({
  selector: 'app-complex-modern',
  template: `
    <div class="complex-app">
      <!-- GOOD: Modern control flow for authentication -->
      @if (isLoggedIn) {
        @if (user) {
          <h1>Welcome, {{ user.name }}</h1>
        }

        @if (hasData) {
          <h2>Your Data</h2>
          <ul>
            @for (item of data; track item.id) {
              @if (item.visible) {
                <li>
                  {{ item.name }}
                  @switch (item.status) {
                    @case ('active') {
                      <span>(Active)</span>
                    }
                    @case ('inactive') {
                      <span>(Inactive)</span>
                    }
                  }
                </li>
              }
            }
          </ul>
        } @else {
          <div>No data available</div>
        }

        <!-- GOOD: Modern @switch for view routing -->
        @switch (currentView) {
          @case ('dashboard') {
            <dashboard></dashboard>
          }
          @case ('settings') {
            <settings></settings>
          }
          @default {
            <profile></profile>
          }
        }
      } @else {
        <login-form></login-form>
      }
    </div>
  `,
  standalone: false
})
export class ComplexModernComponent {
  isLoggedIn = true;
  user = { name: 'John Doe' };
  hasData = true;
  currentView: 'dashboard' | 'settings' | 'profile' = 'dashboard';

  data = [
    { id: 1, name: 'Item 1', visible: true, status: 'active' },
    { id: 2, name: 'Item 2', visible: false, status: 'inactive' },
    { id: 3, name: 'Item 3', visible: true, status: 'active' }
  ];
}

// GOOD: Performance-optimized modern control flow
@Component({
  selector: 'app-performance-modern',
  template: `
    <div>
      <!-- GOOD: @for with proper tracking for performance -->
      @for (item of largeList; track item.id) {
        @if (item.show) {
          <span>{{ item.value }}</span>
        }
      }

      <!-- GOOD: Efficient conditional rendering -->
      @for (item of largeList; track item.id) {
        @if (item.category === 'important' && item.visible) {
          <div>{{ item.value }}</div>
        }
      }

      <!-- GOOD: Modern @switch in loops -->
      @for (item of largeList; track item.id) {
        @switch (item.status) {
          @case ('active') {
            <span>Active</span>
          }
          @case ('inactive') {
            <span>Inactive</span>
          }
          @default {
            <span>Unknown</span>
          }
        }
      }
    </div>
  `,
  standalone: false
})
export class PerformanceModernComponent {
  largeList = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    value: `Item ${i}`,
    show: Math.random() > 0.5,
    category: Math.random() > 0.5 ? 'important' : 'normal',
    visible: Math.random() > 0.5,
    status: Math.random() > 0.5 ? 'active' : 'inactive'
  }));
}

// GOOD: Accessible component with modern control flow
@Component({
  selector: 'app-accessibility-modern',
  template: `
    <div>
      <!-- GOOD: Better accessibility with modern control flow -->
      @if (isLoading) {
        <div aria-live="polite">
          Loading content...
        </div>
      }

      <!-- GOOD: Proper focus management -->
      @if (canSave) {
        <button (click)="save()">Save</button>
      }

      <!-- GOOD: Semantic markup with proper ARIA -->
      <ul role="list">
        @for (item of items; track item.name) {
          <li role="listitem">
            {{ item.name }}
          </li>
        } @empty {
          <li role="listitem">No items available</li>
        }
      </ul>

      <!-- GOOD: Screen reader friendly empty states -->
      @if (items.length === 0) {
        <div aria-live="polite">
          No items to display
        </div>
      }
    </div>
  `,
  standalone: false
})
export class AccessibilityModernComponent {
  isLoading = false;
  canSave = true;
  items: { name: string }[] = [
    { name: 'Item 1' },
    { name: 'Item 2' },
    { name: 'Item 3' }
  ];

  save() {
    console.log('Saving...');
  }
}

// GOOD: Migration helper component showing old vs new
@Component({
  selector: 'app-migration-example',
  template: `
    <div class="migration-example">
      <h2>Migration from deprecated to modern syntax</h2>

      <h3>Before (deprecated):</h3>
      <div class="deprecated">
        <div *ngIf="condition">Content</div>
        <div *ngFor="let item of items">{{ item }}</div>
      </div>

      <h3>After (modern):</h3>
      <div class="modern">
        @if (condition) {
          <div>Content</div>
        }
        @for (item of items; track item) {
          <div>{{ item }}</div>
        }
      </h3>
    </div>
  `,
  standalone: false
})
export class MigrationExampleComponent {
  condition = true;
  items = ['Item 1', 'Item 2', 'Item 3'];
}