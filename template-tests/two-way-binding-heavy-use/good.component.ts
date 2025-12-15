// Parent
@Component({
  selector: 'app-admin-panel',
  template: `
    <app-user-form
      [user]="selectedUser"
      (userChange)="onUserChange($event)">
    </app-user-form>
    <p>Current user: {{ selectedUser.name }}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminPanelComponent {
  selectedUser: User = { name: '', email: '', role: 'user' };

  onUserChange(updatedUser: User): void {
    this.selectedUser = updatedUser; // Immutable update
  }
}

// Child
@Component({
  selector: 'app-user-form',
  template: `
    <input
      [ngModel]="user.name"
      (ngModelChange)="onNameChange($event)">
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormComponent {
  @Input() user!: User;
  @Output() userChange = new EventEmitter<User>();

  onNameChange(name: string): void {
    this.userChange.emit({ ...this.user, name });
  }
}