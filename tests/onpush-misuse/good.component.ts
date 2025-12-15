import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';

// GOOD: Proper OnPush usage with immutable updates and markForCheck
@Component({
  selector: 'app-user-card',
  template: `
    <div class="user-card">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
      <button (click)="updateUserName()">Update Name</button>
      <button (click)="addTag()">Add Tag</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class UserCardComponent {
  @Input() user!: { name: string; email: string; tags: string[] };
  @Output() userChange = new EventEmitter<any>();

  constructor(private cdr: ChangeDetectorRef) {}

  // GOOD: Emits immutable update instead of mutating input
  updateUserName() {
    const updatedUser = {
      ...this.user,
      name: 'Updated Name'
    };
    this.userChange.emit(updatedUser);
  }

  // GOOD: Creates new array instead of mutating existing one
  addTag() {
    const updatedUser = {
      ...this.user,
      tags: [...(this.user.tags || []), 'new-tag']
    };
    this.userChange.emit(updatedUser);
  }
}

// GOOD: Timer component with proper markForCheck calls
@Component({
  selector: 'app-timer',
  template: `
    <div class="timer">
      <span>{{ currentTime | date:'HH:mm:ss' }}</span>
      <button (click)="startTimer()">Start</button>
      <button (click)="stopTimer()">Stop</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class TimerComponent implements OnDestroy {
  currentTime = new Date();
  @Output() timeUpdate = new EventEmitter<Date>();

  private intervalId?: number;

  constructor(private cdr: ChangeDetectorRef) {}

  // GOOD: markForCheck() called when external state changes
  startTimer() {
    this.intervalId = window.setInterval(() => {
      this.currentTime = new Date();
      this.cdr.markForCheck(); // GOOD: Explicitly mark for check
      this.timeUpdate.emit(this.currentTime);
    }, 1000);
  }

  stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  ngOnDestroy() {
    this.stopTimer();
  }
}

// GOOD: Shopping cart with immutable updates
@Component({
  selector: 'app-shopping-cart',
  template: `
    <div class="cart">
      <div *ngFor="let item of cart.items">
        <span>{{ item.name }}</span>
        <button (click)="updateQuantity(item, item.quantity + 1)">+</button>
        <span>{{ item.quantity }}</span>
        <button (click)="updateQuantity(item, item.quantity - 1)">-</button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class ShoppingCartComponent {
  @Input() cart!: { items: Array<{ name: string; quantity: number; id: number }> };
  @Output() cartChange = new EventEmitter<any>();

  constructor(private cdr: ChangeDetectorRef) {}

  // GOOD: Creates new immutable cart object
  updateQuantity(item: any, newQuantity: number) {
    const updatedItems = this.cart.items.map(cartItem =>
      cartItem.id === item.id
        ? { ...cartItem, quantity: Math.max(0, newQuantity) }
        : cartItem
    );

    const updatedCart = {
      ...this.cart,
      items: updatedItems
    };

    this.cartChange.emit(updatedCart);
  }
}