import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, switchMap, mergeMap, concatMap, exhaustMap } from 'rxjs';

// GOOD: Correct flattening operators for different scenarios
@Component({
  selector: 'app-user-manager',
  template: `
    <div class="user-manager">
      <input [(ngModel)]="searchTerm" placeholder="Search users..." />
      <button (click)="saveUser()">Save User</button>
      <button (click)="deleteUser()">Delete User</button>
      <button (click)="sendNotification()">Send Notification</button>
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
  private notifySubject = new Subject<string>();

  constructor(private http: HttpClient) {
    // GOOD: mergeMap allows concurrent saves - no data loss
    this.saveSubject.pipe(
      mergeMap(userData => this.http.post('/api/users', userData))
    ).subscribe(result => {
      console.log('User saved:', result);
    });

    // GOOD: concatMap processes deletes sequentially - no data loss
    this.deleteSubject.pipe(
      concatMap(userId => this.http.delete(`/api/users/${userId}`))
    ).subscribe(() => {
      console.log('User deleted');
    });

    // GOOD: switchMap is correct for search (cancels previous searches)
    this.searchSubject.pipe(
      switchMap(term => this.http.get(`/api/users/search?q=${term}`))
    ).subscribe(users => {
      this.users = users as any[];
    });

    // GOOD: exhaustMap prevents multiple notifications while one is pending
    this.notifySubject.pipe(
      exhaustMap(message => this.http.post('/api/notifications', { message }))
    ).subscribe(result => {
      console.log('Notification sent:', result);
    });
  }

  // GOOD: mergeMap allows multiple concurrent saves
  saveUser() {
    const userData = { name: 'New User', email: 'user@example.com' };
    this.saveSubject.next(userData);
  }

  // GOOD: concatMap ensures deletes happen in order
  deleteUser() {
    const userId = Math.floor(Math.random() * 100) + 1;
    this.deleteSubject.next(userId);
  }

  // GOOD: exhaustMap prevents spam clicking
  sendNotification() {
    this.notifySubject.next('User action completed');
  }

  onSearch() {
    this.searchSubject.next(this.searchTerm);
  }
}

// GOOD: Effects with correct operators
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, concatMap } from 'rxjs/operators';

@Injectable()
export class UserEffects {
  // GOOD: mergeMap for saves - allows concurrent operations
  saveUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[User] Save User'),
      mergeMap(action =>
        this.http.post('/api/users', action.user).pipe(
          map(response => ({ type: '[User] Save User Success', user: response }))
        )
      )
    )
  );

  // GOOD: concatMap for deletes - processes sequentially to avoid conflicts
  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[User] Delete User'),
      concatMap(action =>
        this.http.delete(`/api/users/${action.userId}`).pipe(
          map(() => ({ type: '[User] Delete User Success', userId: action.userId }))
        )
      )
    )
  );

  // GOOD: switchMap for search - cancels previous requests
  searchUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[User] Search Users'),
      switchMap(action =>
        this.http.get(`/api/users/search?q=${action.query}`).pipe(
          map(results => ({ type: '[User] Search Users Success', results }))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient
  ) {}
}