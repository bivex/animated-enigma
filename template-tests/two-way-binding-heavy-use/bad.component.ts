// Parent
@Component({
  selector: 'app-admin-panel',
  template: `
    <app-user-form [(user)]="selectedUser"></app-user-form>
    <p>Current user: {{ selectedUser.name }}</p>
  `
})
export class AdminPanelComponent {
  selectedUser: User = { name: '', email: '', role: 'user' };
}

// Child
@Component({
  selector: 'app-user-form',
  template: `
    <input [(ngModel)]="user.name">
  `
})
export class UserFormComponent {
  @Input() @Output() user!: User; // Two-way sync; parent object mutated
}