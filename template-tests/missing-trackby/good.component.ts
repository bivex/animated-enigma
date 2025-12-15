@Component({
  selector: 'app-user-list',
  template: `
    <ul>
      <li *ngFor="let user of users; trackBy: trackByUserId">
        <input [(ngModel)]="user.name">
        {{ user.email }}
      </li>
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {
  @Input() users: User[] = [];

  trackByUserId(index: number, user: User): string | number {
    return user.id;
  }
}