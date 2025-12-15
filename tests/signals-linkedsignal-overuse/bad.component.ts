// BAD: LinkedSignal overuse - using linkedSignal when never manually written
import { Component, signal, linkedSignal, computed } from '@angular/core';

@Component({
  selector: 'app-calculator',
  template: `
    <div class="calculator">
      <input type="number" [value]="baseValue()" (input)="updateBase($any($event.target).value)" />
      <div>Double: {{ doubledValue() }}</div>
      <div>Squared: {{ squaredValue() }}</div>
      <div>Description: {{ description() }}</div>
    </div>
  `,
  standalone: true
})
export class CalculatorComponent {
  baseValue = signal(5);

  // BAD: linkedSignal when never calling .set() - should use computed
  doubledValue = linkedSignal(() => this.baseValue() * 2);

  // BAD: linkedSignal for pure computation - should use computed
  squaredValue = linkedSignal(() => this.baseValue() ** 2);

  // BAD: linkedSignal for string manipulation - should use computed
  description = linkedSignal(() => `The value is ${this.baseValue()}`);

  updateBase(value: string) {
    this.baseValue.set(Number(value));
  }

  // BAD: Never calls .set() on these linkedSignals
}

// BAD: More complex overuse examples
@Component({
  selector: 'app-user-list',
  template: `
    <div class="user-list">
      <div>Users: {{ userCount() }}</div>
      <div>Active users: {{ activeUserCount() }}</div>
      <div>Admin users: {{ adminUserCount() }}</div>
      <div>Online users: {{ onlineUserCount() }}</div>
    </div>
  `,
  standalone: true
})
export class UserListComponent {
  users = signal([
    { id: 1, name: 'John', role: 'admin', status: 'online' },
    { id: 2, name: 'Jane', role: 'user', status: 'offline' },
    { id: 3, name: 'Bob', role: 'user', status: 'online' }
  ]);

  // BAD: All these should be computed signals
  userCount = linkedSignal(() => this.users().length);

  activeUserCount = linkedSignal(() =>
    this.users().filter(u => u.status === 'online').length
  );

  adminUserCount = linkedSignal(() =>
    this.users().filter(u => u.role === 'admin').length
  );

  onlineUserCount = linkedSignal(() =>
    this.users().filter(u => u.status === 'online').length
  );

  // BAD: No .set() calls anywhere in the component
}

// BAD: linkedSignal for complex derived data that never gets manually updated
@Component({
  selector: 'app-shopping-cart',
  template: `
    <div class="cart">
      <div>Total items: {{ totalItems() }}</div>
      <div>Total price: {{ totalPrice() }}</div>
      <div>Tax amount: {{ taxAmount() }}</div>
      <div>Final total: {{ finalTotal() }}</div>
      <div>Has expensive items: {{ hasExpensiveItems() }}</div>
    </div>
  `,
  standalone: true
})
export class ShoppingCartComponent {
  items = signal([
    { id: 1, name: 'Cheap item', price: 10 },
    { id: 2, name: 'Expensive item', price: 100 }
  ]);

  // BAD: All pure computations - should use computed
  totalItems = linkedSignal(() => this.items().length);

  totalPrice = linkedSignal(() =>
    this.items().reduce((sum, item) => sum + item.price, 0)
  );

  taxAmount = linkedSignal(() => this.totalPrice() * 0.08);

  finalTotal = linkedSignal(() => this.totalPrice() + this.taxAmount());

  hasExpensiveItems = linkedSignal(() =>
    this.items().some(item => item.price > 50)
  );

  // BAD: Component never calls .set() on any of these linkedSignals
}

// BAD: linkedSignal used for formatting and display logic
@Component({
  selector: 'app-product-display',
  template: `
    <div class="product">
      <h2>{{ productTitle() }}</h2>
      <p>{{ productDescription() }}</p>
      <div>Price: {{ formattedPrice() }}</div>
      <div>Rating: {{ starRating() }}</div>
      <div>Availability: {{ availabilityStatus() }}</div>
    </div>
  `,
  standalone: true
})
export class ProductDisplayComponent {
  product = signal({
    name: 'Test Product',
    description: 'A great product',
    price: 99.99,
    rating: 4.5,
    inStock: true
  });

  // BAD: All display formatting - should use computed
  productTitle = linkedSignal(() => this.product().name.toUpperCase());

  productDescription = linkedSignal(() =>
    this.product().description.length > 50
      ? this.product().description.substring(0, 50) + '...'
      : this.product().description
  );

  formattedPrice = linkedSignal(() => `$${this.product().price.toFixed(2)}`);

  starRating = linkedSignal(() => '⭐'.repeat(Math.floor(this.product().rating)));

  availabilityStatus = linkedSignal(() =>
    this.product().inStock ? 'In Stock' : 'Out of Stock'
  );

  // BAD: No manual .set() calls - pure computed values
}