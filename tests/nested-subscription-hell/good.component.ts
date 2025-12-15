import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, forkJoin, switchMap } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-nested-subscription-hell-good',
  template: `
    <div>
      <div *ngFor="let user of users$ | async">
        {{ user.name }}
      </div>
    </div>
  `
})
export class NestedSubscriptionHellGoodComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // GOOD: Use async pipe to handle subscriptions automatically
  users$ = this.http.get('/api/users').pipe(
    switchMap((users: any[]) => {
      // GOOD: Use forkJoin or other operators instead of nesting
      const detailRequests = users.map(user =>
        this.http.get(`/api/user-details/${user.id}`)
      );

      return forkJoin(detailRequests).pipe(
        switchMap(details => {
          // Combine users with their details
          return users.map((user, index) => ({
            ...user,
            details: details[index]
          }));
        })
      );
    })
  );

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // GOOD: No manual subscriptions needed with async pipe
    // All subscriptions are managed automatically
  }

  ngOnDestroy() {
    // GOOD: Clean up any manual subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }
}