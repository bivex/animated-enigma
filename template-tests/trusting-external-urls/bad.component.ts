@Component({
  selector: 'app-user-profile',
  template: `
    <div class="profile">
      <a [href]="user.website">Visit website</a>
    </div>
  `
})
export class UserProfileComponent {
  @Input() user!: User; // user.website might be 'javascript:alert(1)'
}