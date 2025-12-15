// GOOD: Observable subscriptions with proper notification mechanisms in zoneless Angular
import { Component, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, interval, fromEvent, map, startWith } from 'rxjs';

// GOOD: Component using toSignal() for automatic change detection
@Component({
  selector: 'app-user-profile-good',
  template: `
    <div class="profile">
      <h2>{{ user()?.name || 'Loading...' }}</h2>
      <p>{{ user()?.email || 'Loading...' }}</p>
      <div>Status: {{ status() }}</div>
      <div>Timer: {{ timerValue() }}</div>
      <div>Mouse position: {{ mouseX() }}, {{ mouseY() }}</div>
    </div>
  `,
  standalone: true
})
export class UserProfileGoodComponent {
  // GOOD: Convert observables to signals for automatic change detection
  user = toSignal(this.http.get('/api/user'), { initialValue: null });
  status = signal('offline');
  timerValue = toSignal(interval(1000).pipe(map(v => v)), { initialValue: 0 });
  mouseX = signal(0);
  mouseY = signal(0);

  constructor(private http: HttpClient) {
    // GOOD: Effect for side effects that need change detection
    effect(() => {
      // GOOD: Subscribe to DOM events and trigger change detection via signals
      const mouseMove$ = fromEvent<MouseEvent>(document, 'mousemove');
      mouseMove$.subscribe(event => {
        this.mouseX.set(event.clientX);
        this.mouseY.set(event.clientY);
      });
    });

    // GOOD: WebSocket connection with signal updates
    this.initializeWebSocket();
  }

  private initializeWebSocket() {
    // GOOD: Convert WebSocket to signal updates
    this.createWebSocketConnection().subscribe(message => {
      this.status.set(message.status);
    });
  }

  private createWebSocketConnection(): Observable<any> {
    return new Observable(subscriber => {
      const ws = new WebSocket('ws://localhost:8080');
      ws.onmessage = (event) => subscriber.next(JSON.parse(event.data));
      return () => ws.close();
    });
  }
}

// GOOD: Service that provides signal-based APIs
@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) {}

  // GOOD: Expose signal-based methods
  getDataSignal() {
    return toSignal(this.http.get('/api/data'), { initialValue: null });
  }

  // GOOD: Keep observable methods for components that need them
  getDataObservable(): Observable<any> {
    return this.http.get('/api/data');
  }
}

@Component({
  selector: 'app-data-consumer-good',
  template: `
    <div>
      <div>Data: {{ data()?.value }}</div>
      <div>Loading: {{ loading() }}</div>
      <div>Error: {{ error() }}</div>
    </div>
  `,
  standalone: true
})
export class DataConsumerGoodComponent {
  // GOOD: Use toSignal for HTTP requests
  data = toSignal(this.dataService.getDataObservable(), { initialValue: null });

  // GOOD: Computed signals for derived state
  loading = computed(() => this.data() === null);
  error = computed(() => {
    const data = this.data();
    return data && data.error ? data.error : '';
  });

  constructor(private dataService: DataService) {}
}

// GOOD: Dashboard with proper signal-based subscriptions
@Component({
  selector: 'app-dashboard-good',
  template: `
    <div class="dashboard">
      <div>Users online: {{ onlineUsers() }}</div>
      <div>Notifications: {{ notificationCount() }}</div>
      <div>System status: {{ systemStatus() }}</div>
      <div>Last update: {{ lastUpdate() }}</div>
    </div>
  `,
  standalone: true
})
export class DashboardGoodComponent {
  // GOOD: Convert all observables to signals
  onlineUsers = toSignal(this.getOnlineUsers(), { initialValue: 0 });
  notifications = toSignal(this.getNotifications(), { initialValue: [] });
  systemStatus = toSignal(this.getSystemStatus().pipe(startWith('checking')), { initialValue: 'checking' });
  lastUpdate = signal(new Date().toLocaleTimeString());

  // GOOD: Computed signal for notification count
  notificationCount = computed(() => this.notifications().length);

  constructor() {
    // GOOD: Effect to update timestamp when system status changes
    effect(() => {
      this.systemStatus(); // Track dependency
      this.lastUpdate.set(new Date().toLocaleTimeString());
    });
  }

  private getOnlineUsers(): Observable<number> {
    return interval(5000).pipe(map(() => Math.floor(Math.random() * 100)));
  }

  private getNotifications(): Observable<any[]> {
    return interval(10000).pipe(map(() => [
      { id: 1, message: 'New message' },
      { id: 2, message: 'System alert' }
    ]));
  }

  private getSystemStatus(): Observable<string> {
    return interval(30000).pipe(map(() => 'healthy'));
  }
}

// GOOD: Reactive form component with proper signal integration
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-reactive-form-good',
  template: `
    <form [formGroup]="userForm">
      <input formControlName="name" placeholder="Name" />
      <input formControlName="email" placeholder="Email" />
      <div>Form valid: {{ isFormValid() }}</div>
      <div>Submitted: {{ submitMessage() }}</div>
      <button type="submit" (click)="onSubmit()">Submit</button>
    </form>
  `,
  standalone: true
})
export class ReactiveFormGoodComponent {
  userForm: FormGroup;
  submitMessage = signal('');

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.userForm = this.fb.group({
      name: [''],
      email: ['']
    });
  }

  // GOOD: Convert form valueChanges to signal
  formValue = toSignal(this.userForm.valueChanges.pipe(startWith(this.userForm.value)), {
    initialValue: this.userForm.value
  });

  // GOOD: Computed signal for form validity
  isFormValid = computed(() => this.userForm.valid);

  onSubmit() {
    if (this.userForm.valid) {
      // GOOD: Convert HTTP observable to signal
      const submitResult = toSignal(
        this.http.post('/api/users', this.userForm.value).pipe(
          map(() => 'User created successfully!'),
          startWith('Submitting...')
        ),
        { initialValue: '' }
      );

      this.submitMessage = submitResult;
    }
  }
}

// GOOD: Component with mixed observable and signal patterns
@Component({
  selector: 'app-mixed-patterns',
  template: `
    <div>
      <div>Real-time data: {{ realTimeData() }}</div>
      <div>Cached data: {{ cachedData()?.value }}</div>
      <div>Computed result: {{ computedResult() }}</div>
      <button (click)="refreshData()">Refresh</button>
    </div>
  `,
  standalone: true
})
export class MixedPatternsComponent {
  // GOOD: Signal for real-time data that updates frequently
  realTimeData = signal(0);

  // GOOD: toSignal for HTTP requests
  cachedData = toSignal(this.http.get('/api/cached-data'), { initialValue: null });

  // GOOD: Computed signal for derived data
  computedResult = computed(() => {
    const realTime = this.realTimeData();
    const cached = this.cachedData();
    return realTime + (cached?.value || 0);
  });

  constructor(private http: HttpClient) {
    // GOOD: Manual subscription with signal updates for custom logic
    interval(1000).subscribe(() => {
      this.realTimeData.update(v => v + 1);
    });
  }

  refreshData() {
    // GOOD: Trigger HTTP request and convert to signal
    this.cachedData = toSignal(
      this.http.get('/api/cached-data?v=' + Date.now()),
      { initialValue: this.cachedData() }
    );
  }
}