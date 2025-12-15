@Component({
  selector: 'app-user-detail',
  template: `
    <div *ngIf="user$ | async as user">
      <h1>{{ user.name }}</h1>
      <p>{{ user.profile.bio }}</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDetailComponent implements OnInit {
  user$: Observable<User | undefined>;

  constructor(private userService: UserService) {
    this.user$ = this.userService.getUser(123);
  }
}