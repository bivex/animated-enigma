// BAD: setTimeout/setInterval without Signal updates anti-patterns
import { Component, OnInit, OnDestroy } from '@angular/core';

// BAD: Component with timer-based state updates that don't trigger change detection
@Component({
  selector: 'app-timer-counter',
  template: `
    <div>
      <h3>Timer Counter</h3>
      <p>Count: {{ count }}</p>
      <p>Last updated: {{ lastUpdate }}</p>
      <button (click)="startTimer()">Start Timer</button>
      <button (click)="stopTimer()">Stop Timer</button>
    </div>
  `,
  standalone: false
})
export class TimerCounterComponent implements OnInit, OnDestroy {
  count = 0;
  lastUpdate = new Date().toLocaleTimeString();
  private intervalId: any;

  ngOnInit() {
    // BAD: setInterval without Signal updates - won't trigger change detection in zoneless
    this.intervalId = setInterval(() => {
      this.count++; // BAD: Direct property assignment
      this.lastUpdate = new Date().toLocaleTimeString(); // BAD: Another direct assignment
      console.log('Timer ticked:', this.count);
    }, 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // BAD: Manual timer start without proper change detection
  startTimer() {
    // BAD: Another setInterval without Signal updates
    this.intervalId = setInterval(() => {
      this.count += 2; // BAD: Direct property modification
      this.lastUpdate = new Date().toLocaleTimeString();
    }, 500);
  }

  stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

// BAD: Service with timer-based operations
export class TimerService {
  private data: any = {};
  private timeoutId: any;

  // BAD: setTimeout without Signal updates
  scheduleDataUpdate(newData: any) {
    // BAD: setTimeout that modifies object properties directly
    this.timeoutId = setTimeout(() => {
      this.data = { ...this.data, ...newData }; // BAD: Direct object mutation
      console.log('Data updated:', this.data);
    }, 2000);
  }

  getData() {
    return this.data;
  }

  cancelUpdate() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}

// BAD: Component using TimerService
@Component({
  selector: 'app-data-updater',
  template: `
    <div>
      <h3>Data Updater</h3>
      <pre>{{ data | json }}</pre>
      <button (click)="updateData()">Update Data</button>
      <button (click)="cancelUpdate()">Cancel Update</button>
    </div>
  `,
  standalone: false
})
export class DataUpdaterComponent {
  data: any = {};

  constructor(private timerService: TimerService) {}

  ngOnInit() {
    // BAD: Getting data directly without reactive updates
    this.data = this.timerService.getData();
  }

  // BAD: Triggering timer-based update without reactive binding
  updateData() {
    this.timerService.scheduleDataUpdate({
      timestamp: new Date().toISOString(),
      randomValue: Math.random()
    });
    // BAD: No mechanism to update the view when timer completes
  }

  cancelUpdate() {
    this.timerService.cancelUpdate();
  }
}

// BAD: Real-time clock component
@Component({
  selector: 'app-clock',
  template: `
    <div class="clock">
      <h3>Current Time</h3>
      <div class="time-display">{{ currentTime }}</div>
      <div class="date-display">{{ currentDate }}</div>
    </div>
  `,
  standalone: false
})
export class ClockComponent implements OnInit, OnDestroy {
  currentTime = '';
  currentDate = '';
  private intervalId: any;

  ngOnInit() {
    this.updateTime();

    // BAD: setInterval without Signal updates for time display
    this.intervalId = setInterval(() => {
      this.updateTime(); // BAD: Direct property updates
    }, 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // BAD: Direct property assignments in timer callback
  private updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString(); // BAD: Direct assignment
    this.currentDate = now.toLocaleDateString(); // BAD: Another direct assignment
  }
}

// BAD: Progress indicator with timer
@Component({
  selector: 'app-progress-indicator',
  template: `
    <div class="progress-container">
      <h3>File Upload Progress</h3>
      <div class="progress-bar">
        <div class="progress-fill" [style.width.%]="progress"></div>
      </div>
      <p>{{ progress }}% complete</p>
      <p>Status: {{ status }}</p>
    </div>
  `,
  standalone: false
})
export class ProgressIndicatorComponent implements OnInit, OnDestroy {
  progress = 0;
  status = 'Not started';
  private intervalId: any;

  ngOnInit() {
    this.startProgressSimulation();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // BAD: Simulated progress updates without reactive signals
  private startProgressSimulation() {
    // BAD: setInterval with direct property modifications
    this.intervalId = setInterval(() => {
      if (this.progress < 100) {
        this.progress += 10; // BAD: Direct assignment
        this.status = `Uploading... ${this.progress}%`; // BAD: Another direct assignment
      } else {
        this.status = 'Complete'; // BAD: Final status update
        clearInterval(this.intervalId);
      }
    }, 500);
  }
}

// BAD: Countdown timer component
@Component({
  selector: 'app-countdown',
  template: `
    <div class="countdown">
      <h3>Countdown Timer</h3>
      <div class="timer-display">{{ timeLeft }}</div>
      <button (click)="startCountdown()" [disabled]="isRunning">Start</button>
      <button (click)="stopCountdown()">Stop</button>
    </div>
  `,
  standalone: false
})
export class CountdownComponent implements OnInit, OnDestroy {
  timeLeft = 60; // seconds
  isRunning = false;
  private intervalId: any;

  ngOnInit() {}

  ngOnDestroy() {
    this.stopCountdown();
  }

  // BAD: Countdown using setInterval without reactive updates
  startCountdown() {
    if (this.isRunning) return;

    this.isRunning = true;

    // BAD: setInterval with direct property modifications
    this.intervalId = setInterval(() => {
      this.timeLeft--; // BAD: Direct decrement

      if (this.timeLeft <= 0) {
        this.timeLeft = 0; // BAD: Direct assignment
        this.isRunning = false; // BAD: Direct boolean assignment
        clearInterval(this.intervalId);
        alert('Time\'s up!'); // BAD: Side effect in timer
      }
    }, 1000);
  }

  stopCountdown() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

// BAD: Auto-save functionality
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
      <p class="save-status">{{ saveStatus }}</p>
      <p class="last-saved">Last saved: {{ lastSaved }}</p>
    </div>
  `,
  standalone: false
})
export class AutoSaveComponent implements OnInit, OnDestroy {
  content = '';
  saveStatus = 'Not saved';
  lastSaved = 'Never';
  private timeoutId: any;
  private hasUnsavedChanges = false;

  ngOnInit() {}

  ngOnDestroy() {
    this.cancelAutoSave();
  }

  // BAD: Content change triggers setTimeout without reactive updates
  onContentChange() {
    this.hasUnsavedChanges = true;
    this.saveStatus = 'Unsaved changes'; // BAD: Direct status update

    this.cancelAutoSave();

    // BAD: setTimeout with direct property modifications
    this.timeoutId = setTimeout(() => {
      this.saveContent(); // BAD: Method that modifies properties directly
    }, 2000);
  }

  // BAD: Save method with direct property updates
  private saveContent() {
    // Simulate save operation
    this.saveStatus = 'Saving...'; // BAD: Direct assignment

    setTimeout(() => {
      this.saveStatus = 'Saved'; // BAD: Another direct assignment
      this.lastSaved = new Date().toLocaleTimeString(); // BAD: Direct assignment
      this.hasUnsavedChanges = false; // BAD: Direct boolean assignment
    }, 1000);
  }

  private cancelAutoSave() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}

// BAD: Polling service
export class PollingService {
  private latestData: any = null;
  private intervalId: any;

  // BAD: Polling without reactive updates
  startPolling(endpoint: string) {
    // BAD: setInterval with direct property assignment
    this.intervalId = setInterval(() => {
      // Simulate API call
      this.latestData = { timestamp: Date.now(), data: Math.random() }; // BAD: Direct assignment
      console.log('Polled data:', this.latestData);
    }, 5000);
  }

  stopPolling() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  getLatestData() {
    return this.latestData;
  }
}

// BAD: Component using polling service
@Component({
  selector: 'app-polling-display',
  template: `
    <div class="polling-display">
      <h3>Live Data</h3>
      <pre>{{ currentData | json }}</pre>
      <button (click)="startPolling()">Start Polling</button>
      <button (click)="stopPolling()">Stop Polling</button>
    </div>
  `,
  standalone: false
})
export class PollingDisplayComponent implements OnInit, OnDestroy {
  currentData: any = null;

  constructor(private pollingService: PollingService) {}

  ngOnInit() {
    // BAD: Initial data fetch without reactive binding
    this.currentData = this.pollingService.getLatestData();
  }

  ngOnDestroy() {
    this.stopPolling();
  }

  // BAD: Starting polling without reactive updates
  startPolling() {
    this.pollingService.startPolling('/api/live-data');
    // BAD: No mechanism to update view when polling fetches new data
  }

  stopPolling() {
    this.pollingService.stopPolling();
  }
}