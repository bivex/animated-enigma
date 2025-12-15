@Component({
  selector: 'app-user-profile',
  template: `
    <div>
      <!-- Creates 3 separate subscriptions; 3 HTTP requests! -->
      <h1>{{ user$ | async | json }}</h1>
      <p>Name: {{ (user$ | async)?.name }}</p>
      <p>Email: {{ (user$ | async)?.email }}</p>
    </div>
  `
})
export class UserProfileComponent {
  user$ = this.userService.getUser(123); // Single HTTP request observable

  constructor(private userService: UserService) {}
}