// GOOD: Using computed signals for synchronous state derivation
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-shopping-cart',
  template: `
    <div class="cart">
      <div>Subtotal: {{ subtotal() }}</div>
      <div>Tax (8.5%): {{ tax() }}</div>
      <div>Shipping: {{ shipping() }}</div>
      <div><strong>Total: {{ total() }}</strong></div>
    </div>
  `,
  standalone: true
})
export class ShoppingCartComponent {
  items = signal([
    { name: 'Item 1', price: 10, quantity: 2 },
    { name: 'Item 2', price: 25, quantity: 1 }
  ]);

  // GOOD: Computed signals for synchronous derivation - more efficient
  subtotal = computed(() => {
    return this.items().reduce((sum, item) => sum + item.price * item.quantity, 0);
  });

  tax = computed(() => {
    return this.subtotal() * 0.085;
  });

  shipping = computed(() => {
    return this.subtotal() > 50 ? 0 : 9.99;
  });

  total = computed(() => {
    return this.subtotal() + this.tax() + this.shipping();
  });

  // GOOD: No effects needed - all derivations are synchronous and memoized
}

// GOOD: Complex user profile with computed signals
@Component({
  selector: 'app-user-profile',
  template: `
    <div class="profile">
      <div>Name: {{ displayName() }}</div>
      <div>Status: {{ userStatus() }}</div>
      <div>Avatar: {{ avatarUrl() }}</div>
      <div>Last seen: {{ lastSeenFormatted() }}</div>
    </div>
  `,
  standalone: true
})
export class UserProfileComponent {
  user = signal({
    firstName: 'John',
    lastName: 'Doe',
    status: 'online',
    avatar: 'john.jpg',
    lastSeen: new Date()
  });

  // GOOD: All derived values use computed signals
  displayName = computed(() => {
    const user = this.user();
    return `${user.firstName} ${user.lastName}`;
  });

  userStatus = computed(() => {
    const user = this.user();
    return user.status === 'online' ? '🟢 Online' : '⚪ Offline';
  });

  avatarUrl = computed(() => {
    const user = this.user();
    return `/assets/avatars/${user.avatar}`;
  });

  lastSeenFormatted = computed(() => {
    const user = this.user();
    return user.lastSeen.toLocaleString();
  });

  // GOOD: Single source of truth, no effects
}

// GOOD: Complex inventory with proper computed signals
@Component({
  selector: 'app-inventory',
  template: `
    <div class="inventory">
      <div>Total value: {{ totalValue() }}</div>
      <div>Items in stock: {{ inStockCount() }}</div>
      <div>Low stock alerts: {{ lowStockAlerts() }}</div>
      <div>Categories: {{ categorySummary() }}</div>
    </div>
  `,
  standalone: true
})
export class InventoryComponent {
  products = signal([
    { id: 1, name: 'Product A', category: 'Electronics', stock: 5, price: 99.99 },
    { id: 2, name: 'Product B', category: 'Books', stock: 0, price: 19.99 },
    { id: 3, name: 'Product C', category: 'Electronics', stock: 2, price: 149.99 }
  ]);

  // GOOD: Complex business logic in computed signals
  totalValue = computed(() => {
    return this.products().reduce((sum, p) => sum + p.stock * p.price, 0);
  });

  inStockCount = computed(() => {
    return this.products().filter(p => p.stock > 0).length;
  });

  lowStockAlerts = computed(() => {
    const lowStock = this.products().filter(p => p.stock < 3).map(p => p.name);
    return lowStock.length > 0 ? lowStock.join(', ') : 'None';
  });

  categorySummary = computed(() => {
    const categories = this.products().reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(categories)
      .map(([category, count]) => `${category}: ${count}`)
      .join(', ');
  });

  // GOOD: All computations are synchronous and memoized
  // GOOD: No effects needed for pure derivations
}

// GOOD: Mixed signals and effects - effects only for side effects
@Component({
  selector: 'app-smart-cart',
  template: `
    <div class="cart">
      <div>Items: {{ itemCount() }}</div>
      <div>Total: {{ total() }}</div>
      <div>Last updated: {{ lastUpdate() }}</div>
    </div>
  `,
  standalone: true
})
export class SmartCartComponent {
  items = signal([
    { id: 1, name: 'Item 1', price: 10 },
    { id: 2, name: 'Item 2', price: 20 }
  ]);

  // GOOD: Computed for pure derivations
  itemCount = computed(() => this.items().length);
  total = computed(() =>
    this.items().reduce((sum, item) => sum + item.price, 0)
  );

  // GOOD: Signal for state that needs to be updated
  lastUpdate = signal(new Date().toLocaleTimeString());

  constructor() {
    // GOOD: Effect only for side effects (logging, external API calls)
    // Not for deriving state
    effect(() => {
      const total = this.total();
      console.log('Cart total changed:', total);

      // GOOD: Update timestamp when total changes (side effect)
      this.lastUpdate.set(new Date().toLocaleTimeString());
    });
  }
}