// BAD: Observable subscriptions without notification mechanisms in zoneless Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, fromEvent } from 'rxjs';
import { Subscription } from 'rxjs';

// BAD: Component that subscribes to observables without triggering change detection
@Component({
  selector: 'app-user-profile-bad',
  template: `
    <div class="profile">
      <h2>{{ userName }}</h2>
      <p>{{ userEmail }}</p>
      <div>Status: {{ status }}</div>
      <div>Timer: {{ timerValue }}</div>
      <div>Mouse position: {{ mouseX }}, {{ mouseY }}</div>
    </div>
  `,
  standalone: true
})
export class UserProfileBadComponent implements OnInit, OnDestroy {
  userName = 'Loading...';
  userEmail = 'Loading...';
  status = 'offline';
  timerValue = 0;
  mouseX = 0;
  mouseY = 0;

  private subscriptions = new Subscription();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // BAD: HTTP subscription without change detection trigger
    this.subscriptions.add(
      this.http.get('/api/user').subscribe(user => {
        // BAD: Direct property assignment won't trigger change detection in zoneless
        this.userName = user.name;
        this.userEmail = user.email;
        console.log('User loaded, but UI won\'t update!');
      })
    );

    // BAD: Timer subscription without Signal updates
    this.subscriptions.add(
      interval(1000).subscribe(value => {
        // BAD: Property update won't trigger change detection
        this.timerValue = value;
      })
    );

    // BAD: DOM event subscription without change detection
    this.subscriptions.add(
      fromEvent<MouseEvent>(document, 'mousemove').subscribe(event => {
        // BAD: Property updates won't trigger change detection
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
      })
    );

    // BAD: WebSocket or other real-time subscription
    this.subscriptions.add(
      this.createWebSocketConnection().subscribe(message => {
        // BAD: Status update won't trigger change detection
        this.status = message.status;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  // BAD: Method that updates data from subscription
  updateProfile() {
    // BAD: Another subscription without change detection
    this.http.put('/api/user', { status: 'online' }).subscribe(() => {
      // BAD: This won't update the UI
      this.status = 'online';
    });
  }

  private createWebSocketConnection(): Observable<any> {
    // Mock WebSocket connection
    return new Observable(subscriber => {
      const ws = new WebSocket('ws://localhost:8080');
      ws.onmessage = (event) => subscriber.next(JSON.parse(event.data));
      return () => ws.close();
    });
  }
}

// BAD: Service with observable subscriptions in components
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private data$ = new Observable(subscriber => {
    // Some data source
    subscriber.next({ value: 42 });
  });

  getData(): Observable<any> {
    return this.data$;
  }
}

@Component({
  selector: 'app-data-consumer-bad',
  template: `
    <div>
      <div>Data: {{ data }}</div>
      <div>Loading: {{ loading }}</div>
      <div>Error: {{ error }}</div>
    </div>
  `,
  standalone: true
})
export class DataConsumerBadComponent implements OnInit, OnDestroy {
  data: any = null;
  loading = false;
  error = '';

  private subscription?: Subscription;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loading = true;

    // BAD: Manual subscription without change detection triggers
    this.subscription = this.dataService.getData().subscribe({
      next: (result) => {
        // BAD: Property assignments won't trigger change detection
        this.data = result;
        this.loading = false;
        this.error = '';
      },
      error: (err) => {
        // BAD: Error state won't update UI
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}

// BAD: Component with multiple observable subscriptions
@Component({
  selector: 'app-dashboard-bad',
  template: `
    <div class="dashboard">
      <div>Users online: {{ onlineUsers }}</div>
      <div>Notifications: {{ notificationCount }}</div>
      <div>System status: {{ systemStatus }}</div>
      <div>Last update: {{ lastUpdate }}</div>
    </div>
  `,
  standalone: true
})
export class DashboardBadComponent implements OnInit, OnDestroy {
  onlineUsers = 0;
  notificationCount = 0;
  systemStatus = 'unknown';
  lastUpdate = new Date().toLocaleTimeString();

  private subscriptions = new Subscription();

  ngOnInit() {
    // BAD: Multiple subscriptions without change detection
    this.subscriptions.add(
      this.getOnlineUsers().subscribe(count => {
        this.onlineUsers = count; // Won't update UI
      })
    );

    this.subscriptions.add(
      this.getNotifications().subscribe(notifications => {
        this.notificationCount = notifications.length; // Won't update UI
      })
    );

    this.subscriptions.add(
      this.getSystemStatus().subscribe(status => {
        this.systemStatus = status; // Won't update UI
        this.lastUpdate = new Date().toLocaleTimeString(); // Won't update UI
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private getOnlineUsers(): Observable<number> {
    return new Observable(subscriber => {
      setInterval(() => subscriber.next(Math.floor(Math.random() * 100)), 5000);
    });
  }

  private getNotifications(): Observable<any[]> {
    return new Observable(subscriber => {
      setInterval(() => subscriber.next([
        { id: 1, message: 'New message' },
        { id: 2, message: 'System alert' }
      ]), 10000);
    });
  }

  private getSystemStatus(): Observable<string> {
    return new Observable(subscriber => {
      setInterval(() => subscriber.next('healthy'), 30000);
    });
  }
}

// BAD: Form component with reactive forms but no change detection
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-reactive-form-bad',
  template: `
    <form [formGroup]="userForm">
      <input formControlName="name" placeholder="Name" />
      <input formControlName="email" placeholder="Email" />
      <div>Form valid: {{ isFormValid }}</div>
      <div>Submitted: {{ submitMessage }}</div>
    </form>
  `,
  standalone: true
})
export class ReactiveFormBadComponent implements OnInit {
  userForm: FormGroup;
  isFormValid = false;
  submitMessage = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.userForm = this.fb.group({
      name: [''],
      email: ['']
    });
  }

  ngOnInit() {
    // BAD: Form value changes subscription without change detection
    this.userForm.valueChanges.subscribe(() => {
      // BAD: Property update won't trigger change detection
      this.isFormValid = this.userForm.valid;
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      // BAD: HTTP subscription without change detection
      this.http.post('/api/users', this.userForm.value).subscribe(() => {
        this.submitMessage = 'User created successfully!'; // Won't update UI
      });
    }
  }
}