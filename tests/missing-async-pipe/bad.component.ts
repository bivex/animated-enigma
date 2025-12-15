import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

// BAD: Manual subscription management instead of async pipe
@Component({
  selector: 'app-user-profile',
  template: `
    <div class="profile" *ngIf="user">
      <h1>{{ user.name }}</h1>
      <p>{{ user.email }}</p>
      <div *ngIf="loading">Loading...</div>
      <div *ngIf="error">{{ error }}</div>
    </div>
  `,
  standalone: true
})
export class UserProfileComponent implements OnInit, OnDestroy {
  user: any = null;
  loading = false;
  error = '';

  // BAD: Multiple manual subscriptions
  private userSubscription?: Subscription;
  private settingsSubscription?: Subscription;
  private postsSubscription?: Subscription;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // BAD: Manual subscription instead of async pipe
    this.userSubscription = this.http.get('/api/user').subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });

    // BAD: Another manual subscription
    this.settingsSubscription = this.http.get('/api/user/settings').subscribe({
      next: (settings) => {
        // Update user with settings
        this.user = { ...this.user, ...settings };
      }
    });

    // BAD: Third manual subscription
    this.postsSubscription = this.http.get('/api/user/posts').subscribe({
      next: (posts) => {
        // Update user with posts count
        this.user = { ...this.user, postsCount: posts.length };
      }
    });
  }

  ngOnDestroy() {
    // BAD: Manual cleanup required
    this.userSubscription?.unsubscribe();
    this.settingsSubscription?.unsubscribe();
    this.postsSubscription?.unsubscribe();
  }

  // BAD: Method that creates more subscriptions
  loadUserPosts() {
    // BAD: Another manual subscription
    this.http.get('/api/user/posts').subscribe(posts => {
      console.log('Posts loaded:', posts);
    });
  }
}