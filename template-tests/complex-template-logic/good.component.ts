@Component({
  selector: 'app-user-card',
  template: `
    <div class="user-card">
      <h2>{{ getFullName() }}</h2>
      <p>{{ user.email.toLowerCase() }}</p>
      <span>{{ calculateTotal() | currency }}</span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCardComponent {
  @Input() user!: User;
  @Input() order!: Order;

  getFullName(): string {
    return `${this.user.firstName} ${this.user.lastName}`.toUpperCase();
  }

  calculateTotal(): number {
    if (this.order.items.length === 0) return 0;
    const subtotal = this.order.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    return Math.round(subtotal * 1.15 * 100) / 100;
  }
}