// BAD: Using effects for synchronous state derivation instead of computed
import { Component, signal, effect, computed } from '@angular/core';

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

  // BAD: Using effects for derivation - runs asynchronously, less efficient
  subtotal = signal(0);
  tax = signal(0);
  shipping = signal(0);
  total = signal(0);

  constructor() {
    // BAD: Effect for synchronous state derivation
    effect(() => {
      const items = this.items();
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      this.subtotal.set(subtotal);

      // BAD: More effects for derived calculations
      const tax = subtotal * 0.085;
      this.tax.set(tax);

      // BAD: Shipping calculation in effect
      const shipping = subtotal > 50 ? 0 : 9.99;
      this.shipping.set(shipping);

      // BAD: Total calculation in effect
      this.total.set(subtotal + tax + shipping);
    });
  }
}

// BAD: More complex derivation using effects
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

  // BAD: Multiple effects for different derived values
  displayName = signal('');
  userStatus = signal('');
  avatarUrl = signal('');
  lastSeenFormatted = signal('');

  constructor() {
    // BAD: Effect for display name derivation
    effect(() => {
      const user = this.user();
      this.displayName.set(`${user.firstName} ${user.lastName}`);
    });

    // BAD: Effect for status derivation
    effect(() => {
      const user = this.user();
      this.userStatus.set(user.status === 'online' ? '🟢 Online' : '⚪ Offline');
    });

    // BAD: Effect for avatar URL derivation
    effect(() => {
      const user = this.user();
      this.avatarUrl.set(`/assets/avatars/${user.avatar}`);
    });

    // BAD: Effect for date formatting
    effect(() => {
      const user = this.user();
      this.lastSeenFormatted.set(user.lastSeen.toLocaleString());
    });
  }
}

// BAD: Complex business logic in effects
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

  // BAD: Complex business logic in effects
  totalValue = signal(0);
  inStockCount = signal(0);
  lowStockAlerts = signal('');
  categorySummary = signal('');

  constructor() {
    // BAD: Complex calculation in effect
    effect(() => {
      const products = this.products();
      const totalValue = products.reduce((sum, p) => sum + p.stock * p.price, 0);
      this.totalValue.set(totalValue);

      const inStockCount = products.filter(p => p.stock > 0).length;
      this.inStockCount.set(inStockCount);

      // BAD: String manipulation in effect
      const lowStock = products.filter(p => p.stock < 3).map(p => p.name);
      this.lowStockAlerts.set(lowStock.length > 0 ? lowStock.join(', ') : 'None');

      // BAD: Complex object manipulation in effect
      const categories = products.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      this.categorySummary.set(JSON.stringify(categories));
    });
  }
}