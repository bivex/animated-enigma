import { Component } from '@angular/core';

// BAD: Template method calls that execute on every change detection cycle
@Component({
  selector: 'app-user-dashboard',
  template: `
    <div class="dashboard">
      <!-- BAD: Method calls in template - executes on every CD cycle -->
      <h1>Welcome, {{ getUserDisplayName() }}!</h1>

      <!-- BAD: Complex calculations in template -->
      <p>Total: {{ calculateTotal(items) | currency }}</p>

      <!-- BAD: Method calls in *ngFor - multiplies performance cost -->
      <div *ngFor="let item of items; trackBy: trackById">
        <span>{{ getItemLabel(item) }}</span>
        <span>{{ isItemExpired(item) ? 'Expired' : 'Active' }}</span>
        <span>{{ formatPrice(item.price) }}</span>
      </div>

      <!-- BAD: Nested method calls -->
      <div>{{ getNestedValue(getCurrentUser(), 'address.city') }}</div>

      <!-- BAD: Method calls with parameters in loops -->
      <ul>
        <li *ngFor="let user of users">
          {{ getUserStatus(user, currentTime) }}
        </li>
      </ul>
    </div>
  `,
  standalone: true
})
export class UserDashboardComponent {
  items = [
    { id: 1, name: 'Item 1', price: 10.99, expiry: new Date() },
    { id: 2, name: 'Item 2', price: 25.50, expiry: new Date() }
  ];

  users = [
    { id: 1, name: 'John', lastLogin: new Date() },
    { id: 2, name: 'Jane', lastLogin: new Date() }
  ];

  currentTime = new Date();
  currentUser = { name: 'John Doe', address: { city: 'New York' } };

  // BAD: Methods called from template - execute on every change detection
  getUserDisplayName(): string {
    console.log('getUserDisplayName called');
    return this.currentUser.name.toUpperCase();
  }

  // BAD: Expensive calculations in template methods
  calculateTotal(items: any[]): number {
    console.log('calculateTotal called');
    return items.reduce((sum, item) => sum + item.price, 0);
  }

  // BAD: Method calls in *ngFor loops - called for each item on every CD cycle
  getItemLabel(item: any): string {
    console.log('getItemLabel called for', item.id);
    return `${item.name} - ${item.price}`;
  }

  // BAD: Boolean methods in templates
  isItemExpired(item: any): boolean {
    console.log('isItemExpired called for', item.id);
    return new Date() > item.expiry;
  }

  // BAD: Formatting methods called from template
  formatPrice(price: number): string {
    console.log('formatPrice called for', price);
    return `$${price.toFixed(2)}`;
  }

  // BAD: Nested method calls from template
  getNestedValue(obj: any, path: string): any {
    console.log('getNestedValue called');
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // BAD: Methods with multiple parameters called from template
  getUserStatus(user: any, currentTime: Date): string {
    console.log('getUserStatus called for', user.name);
    const hoursSinceLogin = (currentTime.getTime() - user.lastLogin.getTime()) / (1000 * 60 * 60);
    return hoursSinceLogin < 1 ? 'Online' : 'Offline';
  }

  trackById(index: number, item: any): any {
    return item.id;
  }
}