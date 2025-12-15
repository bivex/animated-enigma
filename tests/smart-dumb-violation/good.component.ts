import { Component, Input, Output, EventEmitter } from '@angular/core';

// GOOD: Pure presentational component with no business logic or service injection
@Component({
  selector: 'app-user-list-item',
  template: `
    <div class="user-item">
      <span>{{ user.name }}</span>
      <span>{{ user.email }}</span>
      <button (click)="delete.emit(user.id)">Delete</button>
      <button (click)="edit.emit(user)">Edit</button>
    </div>
  `,
  standalone: true
})
export class UserListItemComponent {
  @Input() user!: { id: number; name: string; email: string };
  @Output() delete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<any>();

  // GOOD: No constructor, no services, no business logic
  // All logic is handled by parent component through events
}