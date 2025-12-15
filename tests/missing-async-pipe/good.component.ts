import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, combineLatest, map, startWith } from 'rxjs';

// GOOD: Using async pipe for automatic subscription management
@Component({
  selector: 'app-user-profile',
  template: `
    <div class="profile" *ngIf="user$ | async as user">
      <h1>{{ user.name }}</h1>
      <p>{{ user.email }}</p>
      <p>Posts: {{ user.postsCount }}</p>
    </div>

    <!-- GOOD: Async pipe handles loading states -->
    <div *ngIf="loading$ | async">Loading...</div>

    <!-- GOOD: Async pipe handles errors -->
    <div *ngIf="error$ | async as error">{{ error }}</div>
  `,
  standalone: true
})
export class UserProfileComponent implements OnInit {
  // GOOD: Observables instead of manual subscriptions
  user$!: Observable<any>;
  loading$!: Observable<boolean>;
  error$!: Observable<string>;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // GOOD: Combine multiple HTTP calls with combineLatest
    this.user$ = combineLatest([
      this.http.get('/api/user'),
      this.http.get('/api/user/settings'),
      this.http.get('/api/user/posts')
    ]).pipe(
      map(([user, settings, posts]) => ({
        ...user,
        ...settings,
        postsCount: posts.length
      }))
    );

    // GOOD: Loading state observable
    this.loading$ = this.user$.pipe(
      map(() => false),
      startWith(true)
    );

    // GOOD: Error handling with catchError
    this.error$ = this.user$.pipe(
      map(() => ''), // No error
      catchError(error => of(error.message))
    );
  }

  // GOOD: No manual subscriptions to clean up
  // GOOD: No ngOnDestroy needed
}

// Helper function for error handling
import { catchError, of } from 'rxjs';