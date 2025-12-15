// GOOD: Proper timer-based updates with Signal integration
import { Component, OnInit, OnDestroy, signal, computed, effect } from '@angular/core';

// GOOD: Component with timer-based state updates using Signals
@Component({
  selector: 'app-timer-counter',
  template: `
    <div>
      <h3>Timer Counter</h3>
      <p>Count: {{ count() }}</p>
      <p>Last updated: {{ lastUpdate() }}</p>
      <button (click)="startTimer()">Start Timer</button>
      <button (click)="stopTimer()">Stop Timer</button>
    </div>
  `,
  standalone: false
})
export class TimerCounterComponent implements OnInit, OnDestroy {
  // GOOD: Using signals for reactive state
  count = signal(0);
  lastUpdate = signal(new Date().toLocaleTimeString());
  private intervalId: any;

  ngOnInit() {
    // GOOD: setInterval with signal updates for zoneless compatibility
    this.intervalId = setInterval(() => {
      this.count.update(c => c + 1); // GOOD: Signal update triggers change detection
      this.lastUpdate.set(new Date().toLocaleTimeString()); // GOOD: Another signal update
      console.log('Timer ticked:', this.count());
    }, 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // GOOD: Timer start with proper signal updates
  startTimer() {
    // GOOD: Clear existing interval first
    this.stopTimer();

    // GOOD: setInterval with signal updates
    this.intervalId = setInterval(() => {
      this.count.update(c => c + 2); // GOOD: Signal update
      this.lastUpdate.set(new Date().toLocaleTimeString()); // GOOD: Signal update
    }, 500);
  }

  stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
}

// GOOD: Service with timer-based operations using signals
export class TimerService {
  // GOOD: Signal-based data storage
  private data = signal<any>({});
  private timeoutId: any;

  // GOOD: setTimeout with signal updates
  scheduleDataUpdate(newData: any) {
    // GOOD: setTimeout that updates signals
    this.timeoutId = setTimeout(() => {
      this.data.update(current => ({ ...current, ...newData })); // GOOD: Signal mutation
      console.log('Data updated:', this.data());
    }, 2000);
  }

  // GOOD: Reactive data access
  getData() {
    return this.data.asReadonly();
  }

  cancelUpdate() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }
}

// GOOD: Component using TimerService with reactive binding
@Component({
  selector: 'app-data-updater',
  template: `
    <div>
      <h3>Data Updater</h3>
      <pre>{{ data() | json }}</pre>
      <button (click)="updateData()">Update Data</button>
      <button (click)="cancelUpdate()">Cancel Update</button>
    </div>
  `,
  standalone: false
})
export class DataUpdaterComponent {
  // GOOD: Reactive data binding
  data = this.timerService.getData();

  constructor(private timerService: TimerService) {}

  // GOOD: Triggering timer-based update with reactive updates
  updateData() {
    this.timerService.scheduleDataUpdate({
      timestamp: new Date().toISOString(),
      randomValue: Math.random()
    });
    // GOOD: View automatically updates when signal changes
  }

  cancelUpdate() {
    this.timerService.cancelUpdate();
  }
}

// GOOD: Real-time clock component with signals
@Component({
  selector: 'app-clock',
  template: `
    <div class="clock">
      <h3>Current Time</h3>
      <div class="time-display">{{ currentTime() }}</div>
      <div class="date-display">{{ currentDate() }}</div>
    </div>
  `,
  standalone: false
})
export class ClockComponent implements OnInit, OnDestroy {
  // GOOD: Signal-based time storage
  currentTime = signal('');
  currentDate = signal('');
  private intervalId: any;

  ngOnInit() {
    this.updateTime();

    // GOOD: setInterval with signal updates
    this.intervalId = setInterval(() => {
      this.updateTime(); // GOOD: Method updates signals
    }, 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // GOOD: Signal updates in timer callback
  private updateTime() {
    const now = new Date();
    this.currentTime.set(now.toLocaleTimeString()); // GOOD: Signal update
    this.currentDate.set(now.toLocaleDateString()); // GOOD: Signal update
  }
}

// GOOD: Progress indicator with signals
@Component({
  selector: 'app-progress-indicator',
  template: `
    <div class="progress-container">
      <h3>File Upload Progress</h3>
      <div class="progress-bar">
        <div class="progress-fill" [style.width.%]="progress()"></div>
      </div>
      <p>{{ progress() }}% complete</p>
      <p>Status: {{ status() }}</p>
    </div>
  `,
  standalone: false
})
export class ProgressIndicatorComponent implements OnInit, OnDestroy {
  // GOOD: Signal-based progress tracking
  progress = signal(0);
  status = signal('Not started');
  private intervalId: any;

  ngOnInit() {
    this.startProgressSimulation();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // GOOD: Simulated progress updates with signals
  private startProgressSimulation() {
    // GOOD: setInterval with signal updates
    this.intervalId = setInterval(() => {
      this.progress.update(p => {
        if (p >= 100) {
          this.status.set('Complete'); // GOOD: Signal update
          clearInterval(this.intervalId);
          return 100;
        } else {
          this.status.set(`Uploading... ${p + 10}%`); // GOOD: Signal update
          return p + 10;
        }
      });
    }, 500);
  }
}

// GOOD: Countdown timer component with signals
@Component({
  selector: 'app-countdown',
  template: `
    <div class="countdown">
      <h3>Countdown Timer</h3>
      <div class="timer-display">{{ timeLeft() }}</div>
      <button (click)="startCountdown()" [disabled]="isRunning()">Start</button>
      <button (click)="stopCountdown()">Stop</button>
    </div>
  `,
  standalone: false
})
export class CountdownComponent implements OnInit, OnDestroy {
  // GOOD: Signal-based countdown state
  timeLeft = signal(60); // seconds
  isRunning = signal(false);
  private intervalId: any;

  ngOnInit() {}

  ngOnDestroy() {
    this.stopCountdown();
  }

  // GOOD: Countdown using setInterval with signal updates
  startCountdown() {
    if (this.isRunning()) return;

    this.isRunning.set(true);

    // GOOD: setInterval with signal updates
    this.intervalId = setInterval(() => {
      this.timeLeft.update(time => {
        if (time <= 1) {
          this.isRunning.set(false); // GOOD: Signal update
          clearInterval(this.intervalId);
          this.showTimeUpNotification(); // GOOD: Side effect handled separately
          return 0;
        }
        return time - 1;
      });
    }, 1000);
  }

  stopCountdown() {
    this.isRunning.set(false);
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  // GOOD: Side effects handled in separate methods
  private showTimeUpNotification() {
    // Could dispatch an action, show a toast, etc.
    console.log('Time\'s up!');
  }
}

// GOOD: Auto-save functionality with signals
@Component({
  selector: 'app-auto-save',
  template: `
    <div class="auto-save">
      <h3>Auto-Save Editor</h3>
      <textarea
        [(ngModel)]="content"
        (input)="onContentChange()"
        placeholder="Start typing...">
      </textarea>
      <p class="save-status">{{ saveStatus() }}</p>
      <p class="last-saved">Last saved: {{ lastSaved() }}</p>
    </div>
  `,
  standalone: false
})
export class AutoSaveComponent implements OnInit, OnDestroy {
  // GOOD: Signal-based auto-save state
  content = signal('');
  saveStatus = signal('Not saved');
  lastSaved = signal('Never');
  private timeoutId: any;

  ngOnInit() {}

  ngOnDestroy() {
    this.cancelAutoSave();
  }

  // GOOD: Content change triggers setTimeout with signal updates
  onContentChange() {
    this.saveStatus.set('Unsaved changes'); // GOOD: Signal update

    this.cancelAutoSave();

    // GOOD: setTimeout triggers signal updates
    this.timeoutId = setTimeout(() => {
      this.saveContent(); // GOOD: Method updates signals
    }, 2000);
  }

  // GOOD: Save method with signal updates
  private saveContent() {
    this.saveStatus.set('Saving...'); // GOOD: Signal update

    // Simulate save operation
    setTimeout(() => {
      this.saveStatus.set('Saved'); // GOOD: Signal update
      this.lastSaved.set(new Date().toLocaleTimeString()); // GOOD: Signal update
    }, 1000);
  }

  private cancelAutoSave() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }
}

// GOOD: Polling service with signals
export class PollingService {
  // GOOD: Signal-based data storage
  private latestData = signal<any>(null);
  private intervalId: any;

  // GOOD: Polling with signal updates
  startPolling(endpoint: string) {
    // GOOD: setInterval with signal updates
    this.intervalId = setInterval(() => {
      // Simulate API call with signal update
      this.latestData.set({
        timestamp: Date.now(),
        data: Math.random()
      }); // GOOD: Signal update
      console.log('Polled data:', this.latestData());
    }, 5000);
  }

  stopPolling() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  // GOOD: Reactive data access
  getLatestData() {
    return this.latestData.asReadonly();
  }
}

// GOOD: Component using polling service with reactive binding
@Component({
  selector: 'app-polling-display',
  template: `
    <div class="polling-display">
      <h3>Live Data</h3>
      <pre>{{ currentData() | json }}</pre>
      <button (click)="startPolling()">Start Polling</button>
      <button (click)="stopPolling()">Stop Polling</button>
    </div>
  `,
  standalone: false
})
export class PollingDisplayComponent implements OnInit, OnDestroy {
  // GOOD: Reactive data binding
  currentData = this.pollingService.getLatestData();

  constructor(private pollingService: PollingService) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.stopPolling();
  }

  // GOOD: Starting polling with reactive updates
  startPolling() {
    this.pollingService.startPolling('/api/live-data');
    // GOOD: View automatically updates when signal changes
  }

  stopPolling() {
    this.pollingService.stopPolling();
  }
}

// GOOD: Advanced timer with computed signals
@Component({
  selector: 'app-advanced-timer',
  template: `
    <div class="advanced-timer">
      <h3>Advanced Timer</h3>
      <p>Elapsed: {{ elapsedTime() }}s</p>
      <p>Status: {{ status() }}</p>
      <button (click)="toggleTimer()">{{ isRunning() ? 'Pause' : 'Start' }}</button>
      <button (click)="reset()">Reset</button>
    </div>
  `,
  standalone: false
})
export class AdvancedTimerComponent implements OnInit, OnDestroy {
  // GOOD: Signal-based timer state
  startTime = signal<number | null>(null);
  currentTime = signal(Date.now());
  isRunning = signal(false);

  // GOOD: Computed signals for derived state
  elapsedTime = computed(() => {
    const start = this.startTime();
    const current = this.currentTime();
    if (!start) return 0;
    return Math.floor((current - start) / 1000);
  });

  status = computed(() => {
    return this.isRunning() ? 'Running' : 'Paused';
  });

  private intervalId: any;

  ngOnInit() {
    // GOOD: Timer updates current time signal
    this.intervalId = setInterval(() => {
      this.currentTime.set(Date.now()); // GOOD: Signal update triggers computed updates
    }, 100);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  toggleTimer() {
    if (this.isRunning()) {
      this.isRunning.set(false);
    } else {
      this.isRunning.set(true);
      if (!this.startTime()) {
        this.startTime.set(Date.now());
      }
    }
  }

  reset() {
    this.startTime.set(null);
    this.isRunning.set(false);
  }
}