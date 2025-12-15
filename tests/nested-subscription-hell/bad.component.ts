import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nested-subscription-hell-bad',
  template: `
    <div>
      <div *ngFor="let user of users">
        {{ user.name }}
      </div>
    </div>
  `
})
export class NestedSubscriptionHellBadComponent implements OnInit {
  users: any[] = [];
  private subscription?: Subscription;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // BAD: Nested subscriptions (subscription hell)
    this.subscription = this.http.get('/api/users').subscribe(users => {
      console.log('Got users:', users);

      // Nested subscription level 1
      this.http.get('/api/user-details').subscribe(details => {
        console.log('Got details:', details);

        // Nested subscription level 2
        this.http.get('/api/user-preferences').subscribe(preferences => {
          console.log('Got preferences:', preferences);

          // Even more nesting...
          this.http.get('/api/user-settings').subscribe(settings => {
            console.log('Got settings:', settings);
            this.users = users as any[];
          });
        });
      });
    });
  }

  ngOnDestroy() {
    // Memory leak if not properly cleaned up
    // this.subscription?.unsubscribe();
  }
}