import { Component, OnInit } from '@angular/core';

// GOOD: No template method calls - all values computed once and cached
@Component({
  selector: 'app-user-dashboard',
  template: `
    <div class="dashboard">
      <!-- GOOD: Use pre-computed properties -->
      <h1>Welcome, {{ userDisplayName }}!</h1>

      <!-- GOOD: Use pre-computed values -->
      <p>Total: {{ total | currency }}</p>

      <!-- GOOD: Use transformed arrays with pre-computed values -->
      <div *ngFor="let item of processedItems; trackBy: trackById">
        <span>{{ item.displayLabel }}</span>
        <span>{{ item.status }}</span>
        <span>{{ item.formattedPrice }}</span>
      </div>

      <!-- GOOD: Use pre-computed nested values -->
      <div>{{ userCity }}</div>

      <!-- GOOD: Use pre-computed arrays -->
      <ul>
        <li *ngFor="let user of processedUsers">
          {{ user.status }}
        </li>
      </ul>
    </div>
  `,
  standalone: true
})
export class UserDashboardComponent implements OnInit {
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

  // GOOD: Pre-computed properties - calculated once, not on every CD cycle
  userDisplayName!: string;
  total!: number;
  userCity!: string;
  processedItems!: any[];
  processedUsers!: any[];

  ngOnInit() {
    // GOOD: Compute values once during initialization
    this.computeDisplayValues();
  }

  // GOOD: Computation happens once, not in template
  private computeDisplayValues() {
    this.userDisplayName = this.currentUser.name.toUpperCase();
    this.total = this.items.reduce((sum, item) => sum + item.price, 0);
    this.userCity = this.currentUser.address.city;

    // GOOD: Transform data once
    this.processedItems = this.items.map(item => ({
      ...item,
      displayLabel: `${item.name} - ${item.price}`,
      status: new Date() > item.expiry ? 'Expired' : 'Active',
      formattedPrice: `$${item.price.toFixed(2)}`
    }));

    // GOOD: Process users once
    this.processedUsers = this.users.map(user => ({
      ...user,
      status: this.getUserStatus(user)
    }));
  }

  // GOOD: Helper methods not called from template
  private getUserStatus(user: any): string {
    const hoursSinceLogin = (this.currentTime.getTime() - user.lastLogin.getTime()) / (1000 * 60 * 60);
    return hoursSinceLogin < 1 ? 'Online' : 'Offline';
  }

  trackById(index: number, item: any): any {
    return item.id;
  }
}