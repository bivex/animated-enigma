// BAD: Continued use of deprecated structural directives anti-patterns
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// BAD: Component using deprecated *ngIf
@Component({
  selector: 'app-legacy-if',
  template: `
    <div>
      <!-- BAD: Using deprecated *ngIf instead of @if -->
      <div *ngIf="isVisible">
        This content is conditionally shown
      </div>

      <!-- BAD: *ngIf with else -->
      <div *ngIf="user; else noUser">
        Welcome, {{ user.name }}!
      </div>
      <ng-template #noUser>
        Please log in
      </ng-template>

      <!-- BAD: *ngIf with then and else -->
      <div *ngIf="isAdmin; then adminContent else userContent"></div>
      <ng-template #adminContent>
        <h2>Admin Panel</h2>
        <p>You have admin privileges</p>
      </ng-template>
      <ng-template #userContent>
        <h2>User Dashboard</h2>
        <p>Welcome to your dashboard</p>
      </ng-template>
    </div>
  `,
  standalone: false
})
export class LegacyIfComponent {
  isVisible = true;
  user: { name: string } | null = { name: 'John' };
  isAdmin = false;
}

// BAD: Component using deprecated *ngFor
@Component({
  selector: 'app-legacy-for',
  template: `
    <div>
      <!-- BAD: Using deprecated *ngFor instead of @for -->
      <ul>
        <li *ngFor="let item of items; let i = index; trackBy: trackByFn">
          {{ i + 1 }}. {{ item.name }}
        </li>
      </ul>

      <!-- BAD: *ngFor with complex expressions -->
      <div *ngFor="let item of items; let first = first; let last = last; let even = even">
        <span *ngIf="first">First: </span>
        <span *ngIf="last">Last: </span>
        <span *ngIf="even">Even: </span>
        {{ item.name }}
      </div>

      <!-- BAD: Nested *ngFor without proper tracking -->
      <div *ngFor="let category of categories">
        <h3>{{ category.name }}</h3>
        <ul>
          <li *ngFor="let item of category.items">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  `,
  standalone: false
})
export class LegacyForComponent {
  items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ];

  categories = [
    { name: 'Fruits', items: ['Apple', 'Banana', 'Orange'] },
    { name: 'Vegetables', items: ['Carrot', 'Broccoli', 'Spinach'] }
  ];

  trackByFn(index: number, item: any) {
    return item.id;
  }
}

// BAD: Component using deprecated *ngSwitch
@Component({
  selector: 'app-legacy-switch',
  template: `
    <div>
      <!-- BAD: Using deprecated *ngSwitch instead of @switch -->
      <div [ngSwitch]="status">
        <div *ngSwitchCase="'loading'">
          Loading...
        </div>
        <div *ngSwitchCase="'success'">
          Success! Data loaded.
        </div>
        <div *ngSwitchCase="'error'">
          Error: Something went wrong
        </div>
        <div *ngSwitchDefault>
          Unknown status
        </div>
      </div>

      <!-- BAD: Complex *ngSwitch with multiple cases -->
      <div [ngSwitch]="userType">
        <admin-panel *ngSwitchCase="'admin'"></admin-panel>
        <moderator-panel *ngSwitchCase="'moderator'"></moderator-panel>
        <user-panel *ngSwitchCase="'user'"></user-panel>
        <guest-panel *ngSwitchDefault></guest-panel>
      </div>
    </div>
  `,
  standalone: false
})
export class LegacySwitchComponent {
  status: 'loading' | 'success' | 'error' = 'loading';
  userType: 'admin' | 'moderator' | 'user' | 'guest' = 'user';
}

// BAD: Component mixing old and new syntax
@Component({
  selector: 'app-mixed-syntax',
  template: `
    <div>
      <!-- BAD: Mixing @if with *ngFor (inconsistent syntax) -->
      @if (showList) {
        <ul>
          <li *ngFor="let item of items">{{ item }}</li>
        </ul>
      }

      <!-- BAD: Using @for with *ngIf -->
      @for (item of items; track item) {
        <div *ngIf="item.visible">{{ item.name }}</div>
      }

      <!-- BAD: @switch with *ngIf cases -->
      @switch (mode) {
        @case ('edit') {
          <div *ngIf="canEdit">Edit mode</div>
        }
        @case ('view') {
          <div *ngIf="canView">View mode</div>
        }
      }
    </div>
  `,
  standalone: false
})
export class MixedSyntaxComponent {
  showList = true;
  items = [
    { name: 'Item 1', visible: true },
    { name: 'Item 2', visible: false },
    { name: 'Item 3', visible: true }
  ];
  mode: 'edit' | 'view' = 'view';
  canEdit = true;
  canView = true;
}

// BAD: Complex component with multiple deprecated directives
@Component({
  selector: 'app-complex-legacy',
  template: `
    <div class="complex-app">
      <!-- BAD: Complex nesting with deprecated directives -->
      <div *ngIf="isLoggedIn">
        <h1 *ngIf="user">Welcome, {{ user.name }}</h1>

        <div *ngIf="hasData">
          <h2>Your Data</h2>
          <ul>
            <li *ngFor="let item of data; let i = index; trackBy: trackById"
                *ngIf="item.visible">
              {{ i + 1 }}. {{ item.name }}
              <span *ngIf="item.status === 'active'">(Active)</span>
              <span *ngIf="item.status === 'inactive'">(Inactive)</span>
            </li>
          </ul>
        </div>

        <div [ngSwitch]="currentView">
          <dashboard *ngSwitchCase="'dashboard'"></dashboard>
          <settings *ngSwitchCase="'settings'"></settings>
          <profile *ngSwitchDefault></profile>
        </div>
      </div>

      <div *ngIf="!isLoggedIn">
        <login-form></login-form>
      </div>
    </div>
  `,
  standalone: false
})
export class ComplexLegacyComponent {
  isLoggedIn = true;
  user = { name: 'John Doe' };
  hasData = true;
  currentView: 'dashboard' | 'settings' | 'profile' = 'dashboard';

  data = [
    { id: 1, name: 'Item 1', visible: true, status: 'active' },
    { id: 2, name: 'Item 2', visible: false, status: 'inactive' },
    { id: 3, name: 'Item 3', visible: true, status: 'active' }
  ];

  trackById(index: number, item: any) {
    return item.id;
  }
}

// BAD: Module importing deprecated CommonModule directives
// @NgModule({
//   declarations: [LegacyIfComponent, LegacyForComponent, LegacySwitchComponent],
//   imports: [CommonModule], // BAD: CommonModule includes deprecated directives
//   exports: [LegacyIfComponent, LegacyForComponent, LegacySwitchComponent]
// })
// export class LegacyDirectivesModule { }

// BAD: Template with performance issues due to deprecated directives
@Component({
  selector: 'app-performance-legacy',
  template: `
    <div>
      <!-- BAD: *ngFor without trackBy function -->
      <div *ngFor="let item of largeList">
        <span *ngIf="item.show">{{ item.value }}</span>
      </div>

      <!-- BAD: Nested *ngIf in *ngFor causing performance issues -->
      <div *ngFor="let item of largeList">
        <div *ngIf="item.category === 'important'">
          <span *ngIf="item.visible">{{ item.value }}</span>
        </div>
      </div>

      <!-- BAD: *ngSwitch in loop -->
      <div *ngFor="let item of largeList">
        <div [ngSwitch]="item.status">
          <span *ngSwitchCase="'active'">Active</span>
          <span *ngSwitchCase="'inactive'">Inactive</span>
          <span *ngSwitchDefault>Unknown</span>
        </div>
      </div>
    </div>
  `,
  standalone: false
})
export class PerformanceLegacyComponent {
  largeList = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    value: `Item ${i}`,
    show: Math.random() > 0.5,
    category: Math.random() > 0.5 ? 'important' : 'normal',
    visible: Math.random() > 0.5,
    status: Math.random() > 0.5 ? 'active' : 'inactive'
  }));
}

// BAD: Component with accessibility issues due to deprecated directives
@Component({
  selector: 'app-accessibility-legacy',
  template: `
    <div>
      <!-- BAD: Screen reader issues with *ngIf -->
      <div *ngIf="isLoading" aria-live="polite">
        Loading content...
      </div>

      <!-- BAD: Focus management issues with *ngIf -->
      <button *ngIf="canSave" (click)="save()">Save</button>

      <!-- BAD: *ngFor without proper ARIA attributes -->
      <ul role="list">
        <li *ngFor="let item of items" role="listitem">
          {{ item.name }}
        </li>
      </ul>
    </div>
  `,
  standalone: false
})
export class AccessibilityLegacyComponent {
  isLoading = false;
  canSave = true;
  items = [
    { name: 'Item 1' },
    { name: 'Item 2' },
    { name: 'Item 3' }
  ];

  save() {
    console.log('Saving...');
  }
}