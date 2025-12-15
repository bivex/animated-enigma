import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, switchMap } from 'rxjs';

// BAD: switchMap with HTTP operations causing data loss
@Component({
  selector: 'app-user-manager',
  template: `
    <div class="user-manager">
      <input [(ngModel)]="searchTerm" placeholder="Search users..." />
      <button (click)="saveUser()">Save User</button>
      <button (click)="deleteUser()">Delete User</button>
      <div *ngIf="loading">Loading...</div>
      <ul>
        <li *ngFor="let user of users">{{ user.name }}</li>
      </ul>
    </div>
  `,
  standalone: true
})
export class UserManagerComponent {
  searchTerm = '';
  users: any[] = [];
  loading = false;

  private searchSubject = new Subject<string>();
  private saveSubject = new Subject<any>();
  private deleteSubject = new Subject<number>();

  constructor(private http: HttpClient) {
    // BAD: switchMap cancels previous HTTP POST requests - DATA LOSS
    this.saveSubject.pipe(
      switchMap(userData => this.http.post('/api/users', userData))
    ).subscribe(result => {
      console.log('User saved:', result);
    });

    // BAD: switchMap cancels previous HTTP DELETE requests - DATA LOSS
    this.deleteSubject.pipe(
      switchMap(userId => this.http.delete(`/api/users/${userId}`))
    ).subscribe(() => {
      console.log('User deleted');
    });

    // This one is actually OK for search (switchMap is correct for search)
    this.searchSubject.pipe(
      switchMap(term => this.http.get(`/api/users/search?q=${term}`))
    ).subscribe(users => {
      this.users = users as any[];
    });
  }

  // BAD: Rapid save clicks will cancel previous saves - DATA LOSS
  saveUser() {
    const userData = { name: 'New User', email: 'user@example.com' };
    this.saveSubject.next(userData);
  }

  // BAD: Multiple delete operations will cancel each other - DATA LOSS
  deleteUser() {
    const userId = Math.floor(Math.random() * 100) + 1;
    this.deleteSubject.next(userId);
  }

  // GOOD: Search uses switchMap correctly (cancels previous searches)
  onSearch() {
    this.searchSubject.next(this.searchTerm);
  }
}

// BAD: Effect with switchMap data loss
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';

@Injectable()
export class UserEffects {
  // BAD: switchMap cancels previous save operations - CRITICAL DATA LOSS
  saveUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[User] Save User'),
      switchMap(action =>
        this.http.post('/api/users', action.user).pipe(
          map(response => ({ type: '[User] Save User Success', user: response }))
        )
      )
    )
  );

  // BAD: switchMap cancels previous delete operations - DATA LOSS
  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[User] Delete User'),
      switchMap(action =>
        this.http.delete(`/api/users/${action.userId}`).pipe(
          map(() => ({ type: '[User] Delete User Success', userId: action.userId }))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient
  ) {}
}