@Component({
  selector: 'app-user-profile',
  template: `
    <div *ngIf="user">
      <div *ngIf="user.profile">
        <div *ngIf="user.profile.settings">
          <p>{{ user.profile.settings.theme }}</p>
        </div>
      </div>
    </div>
  `
})
export class UserProfileComponent {
  @Input() user: User | null = null;
}