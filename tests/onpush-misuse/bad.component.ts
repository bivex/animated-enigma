import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

// BAD: OnPush component with mutable input modifications and missing markForCheck
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

  constructor(private cdr: ChangeDetectorRef) {}

  // BAD: Mutates input object directly - OnPush won't detect this change
  updateUserName() {
    this.user.name = 'Updated Name'; // Direct mutation
    // BAD: Missing markForCheck() - UI won't update
  }

  // BAD: Modifies nested object properties - OnPush change detection won't trigger
  addTag() {
    if (!this.user.tags) {
      this.user.tags = [];
    }
    this.user.tags.push('new-tag'); // Mutates nested array
    // BAD: No markForCheck call
  }
}

// BAD: Another component with external state updates without markForCheck
@Component({
  selector: 'app-timer',
  template: `
    <div class="timer">
      <span>{{ currentTime | date:'HH:mm:ss' }}</span>
      <button (click)="startTimer()">Start</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class TimerComponent {
  currentTime = new Date();

  private intervalId?: number;

  constructor(private cdr: ChangeDetectorRef) {}

  // BAD: External state update (setInterval) without markForCheck
  startTimer() {
    this.intervalId = window.setInterval(() => {
      this.currentTime = new Date();
      // BAD: Missing markForCheck() - timer won't update in UI
    }, 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

// BAD: Component that receives mutable objects and modifies them
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
  @Input() cart!: { items: Array<{ name: string; quantity: number }> };

  constructor(private cdr: ChangeDetectorRef) {}

  // BAD: Modifies input object properties directly
  updateQuantity(item: any, newQuantity: number) {
    item.quantity = newQuantity; // Direct mutation of input
    // BAD: Missing markForCheck()
  }
}