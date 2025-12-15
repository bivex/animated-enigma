@Component({
  selector: 'app-user-card',
  template: '{{ user.name }}',
  changeDetection: ChangeDetectionStrategy.OnPush // Only check on input change
})
export class UserCardComponent {
  @Input() user!: User;
}

@Component({
  selector: 'app-dashboard',
  template: `
    <app-user-card [user]="user"></app-user-card>
    <input [(ngModel)]="searchTerm">
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  @Input() user!: User;
  searchTerm = '';
}