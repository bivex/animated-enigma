// GOOD: Proper LinkedSignal usage - only when manual .set() is needed
import { Component, signal, linkedSignal, computed } from '@angular/core';

@Component({
  selector: 'app-calculator',
  template: `
    <div class="calculator">
      <input type="number" [value]="baseValue()" (input)="updateBase($any($event.target).value)" />
      <div>Double: {{ doubledValue() }}</div>
      <div>Squared: {{ squaredValue() }}</div>
      <div>Description: {{ description() }}</div>
      <button (click)="resetToDefault()">Reset to 10</button>
      <button (click)="setToMaximum()">Set to Max (50)</button>
    </div>
  `,
  standalone: true
})
export class CalculatorComponent {
  baseValue = signal(5);

  // GOOD: Use computed for pure derivations that never need manual setting
  doubledValue = computed(() => this.baseValue() * 2);
  squaredValue = computed(() => this.baseValue() ** 2);
  description = computed(() => `The value is ${this.baseValue()}`);

  // GOOD: linkedSignal only when we need manual .set() capability
  cappedValue = linkedSignal({
    source: this.baseValue,
    computation: (value) => Math.min(value, 50) // Cap at 50
  });

  updateBase(value: string) {
    this.baseValue.set(Number(value));
  }

  // GOOD: Manual .set() calls on linkedSignal
  resetToDefault() {
    this.cappedValue.set(10);
  }

  setToMaximum() {
    this.cappedValue.set(50);
  }
}

// GOOD: Shopping cart with proper signal usage
@Component({
  selector: 'app-shopping-cart',
  template: `
    <div class="cart">
      <div>Total items: {{ totalItems() }}</div>
      <div>Total price: {{ totalPrice() }}</div>
      <div>Tax amount: {{ taxAmount() }}</div>
      <div>Final total: {{ finalTotal() }}</div>
      <div>Discount applied: {{ discountAmount() }}</div>
      <button (click)="applyDiscount(10)">Apply $10 Discount</button>
      <button (click)="removeDiscount()">Remove Discount</button>
    </div>
  `,
  standalone: true
})
export class ShoppingCartComponent {
  items = signal([
    { id: 1, name: 'Cheap item', price: 10 },
    { id: 2, name: 'Expensive item', price: 100 }
  ]);

  // GOOD: computed for pure calculations
  totalItems = computed(() => this.items().length);
  totalPrice = computed(() =>
    this.items().reduce((sum, item) => sum + item.price, 0)
  );
  taxAmount = computed(() => this.totalPrice() * 0.08);

  // GOOD: linkedSignal for discount that can be manually set
  discountAmount = linkedSignal({
    source: this.totalPrice,
    computation: (price) => price > 100 ? 10 : 0 // Auto discount for orders > $100
  });

  finalTotal = computed(() =>
    this.totalPrice() + this.taxAmount() - this.discountAmount()
  );

  // GOOD: Manual control over discount
  applyDiscount(amount: number) {
    this.discountAmount.set(amount);
  }

  removeDiscount() {
    this.discountAmount.set(0);
  }
}

// GOOD: User selector with manual selection capability
@Component({
  selector: 'app-user-selector',
  template: `
    <div class="user-selector">
      <select [value]="selectedUser()?.id" (change)="selectUser($any($event.target).value)">
        <option *ngFor="let user of users()" [value]="user.id">{{ user.name }}</option>
      </select>
      <div>Selected: {{ selectedUser()?.name }}</div>
      <button (click)="selectFirstUser()">Select First</button>
      <button (click)="clearSelection()">Clear</button>
    </div>
  `,
  standalone: true
})
export class UserSelectorComponent {
  users = signal([
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
    { id: 3, name: 'Bob' }
  ]);

  // GOOD: linkedSignal for selectable derived state
  selectedUser = linkedSignal({
    source: this.users,
    computation: (users, previous) =>
      previous && users.find(u => u.id === previous.id) ? previous : users[0]
  });

  selectUser(userId: string) {
    const user = this.users().find(u => u.id === Number(userId));
    if (user) {
      this.selectedUser.set(user);
    }
  }

  // GOOD: Manual selection methods
  selectFirstUser() {
    this.selectedUser.set(this.users()[0]);
  }

  clearSelection() {
    this.selectedUser.set(null);
  }
}

// GOOD: Form validation with manual override capability
@Component({
  selector: 'app-form-validator',
  template: `
    <div class="form-validator">
      <input type="email" [value]="email()" (input)="updateEmail($any($event.target).value)" />
      <div>Is valid: {{ isValid() }}</div>
      <div>Validation message: {{ validationMessage() }}</div>
      <button (click)="forceValid()">Force Valid</button>
      <button (click)="resetValidation()">Reset</button>
    </div>
  `,
  standalone: true
})
export class FormValidatorComponent {
  email = signal('');

  // GOOD: linkedSignal for validation that can be manually overridden
  validationMessage = linkedSignal({
    source: this.email,
    computation: (email) => {
      if (!email) return 'Email is required';
      if (!email.includes('@')) return 'Invalid email format';
      return 'Valid';
    }
  });

  isValid = computed(() => this.validationMessage() === 'Valid');

  updateEmail(value: string) {
    this.email.set(value);
  }

  // GOOD: Manual override capability
  forceValid() {
    this.validationMessage.set('Valid');
  }

  resetValidation() {
    // Reset to computed value by setting email again
    const currentEmail = this.email();
    this.email.set('');
    this.email.set(currentEmail);
  }
}