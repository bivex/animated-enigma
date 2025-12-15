@Component({
  selector: 'app-user-card',
  template: `
    <div class="user-card">
      <h2>{{ (user.firstName + ' ' + user.lastName).toUpperCase() }}</h2>
      <p>{{ user.email.toLowerCase() }}</p>
      <span>{{ (order.items.length > 0 ? order.items.reduce((sum, item) => sum + (item.price * item.qty), 0) * 1.15 : 0).toFixed(2) }}</span>
    </div>
  `
})
export class UserCardComponent {
  @Input() user!: User;
  @Input() order!: Order;
}