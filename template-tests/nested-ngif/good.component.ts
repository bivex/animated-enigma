@Component({
  selector: 'app-user-profile',
  template: `
    <p>{{ user?.profile?.settings?.theme }}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileComponent {
  @Input() user: User | null = null;
}