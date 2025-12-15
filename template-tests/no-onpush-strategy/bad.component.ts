@Component({
  selector: 'app-user-card',
  template: '{{ user.name }}'
  // No changeDetection specified = CheckAlways (default)
})
export class UserCardComponent {
  @Input() user!: User;
}

@Component({
  selector: 'app-dashboard',
  template: `
    <app-user-card [user]="user"></app-user-card>
    <input [(ngModel)]="searchTerm"> <!-- Typing here triggers check in UserCard too -->
  `
})
export class DashboardComponent {
  @Input() user!: User;
  searchTerm = '';
}