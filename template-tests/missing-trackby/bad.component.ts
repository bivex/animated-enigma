@Component({
  selector: 'app-user-list',
  template: `
    <ul>
      <li *ngFor="let user of users">
        <input [(ngModel)]="user.name">
        {{ user.email }}
      </li>
    </ul>
  `
})
export class UserListComponent {
  @Input() users: User[] = [];
}