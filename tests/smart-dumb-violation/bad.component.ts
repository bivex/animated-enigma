import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

// BAD: Presentational component with business logic and service injection
@Component({
  selector: 'app-user-list-item',
  template: `
    <div class="user-item">
      <span>{{ user.name }}</span>
      <button (click)="onDelete(user.id)">Delete</button>
      <button (click)="onEdit(user)">Edit</button>
    </div>
  `,
  standalone: true
})
export class UserListItemComponent implements OnInit {
  @Input() user!: { id: number; name: string; email: string };

  users$: Observable<any[]>;

  constructor(
    private http: HttpClient,
    private store: Store
  ) {
    this.users$ = this.store.select(state => state.users);
  }

  ngOnInit() {
    // BAD: Presentational component making HTTP calls
    this.loadUserDetails();
  }

  // BAD: Presentational component with business logic
  onDelete(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.http.delete(`/api/users/${userId}`).subscribe({
        next: () => {
          // BAD: Dispatching actions from presentational component
          this.store.dispatch({ type: '[Users] Delete User', userId });
          console.log('User deleted successfully');
        },
        error: (error) => {
          console.error('Failed to delete user:', error);
        }
      });
    }
  }

  // BAD: Presentational component with complex business logic
  onEdit(user: any) {
    const updatedUser = {
      ...user,
      lastModified: new Date(),
      modifiedBy: 'current-user'
    };

    this.http.put(`/api/users/${user.id}`, updatedUser).subscribe({
      next: (response) => {
        this.store.dispatch({
          type: '[Users] Update User',
          user: response
        });
      },
      error: (error) => {
        alert('Failed to update user');
      }
    });
  }

  // BAD: Presentational component with data fetching logic
  private loadUserDetails() {
    this.http.get(`/api/users/${this.user.id}/details`).subscribe({
      next: (details) => {
        // Update local user object - violates immutability
        this.user = { ...this.user, ...details };
      }
    });
  }
}