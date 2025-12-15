// BAD: Using fakeAsync/tick in zoneless tests anti-pattern
import { fakeAsync, tick } from '@angular/core/testing';
import { Component } from '@angular/core';

// BAD: Component that uses timers in zoneless mode
@Component({
  selector: 'app-timer-component',
  template: '<div>{{ message() }}</div>',
  standalone: false
})
class TimerComponent {
  message = signal('initial');

  startTimer() {
    // BAD: setTimeout in zoneless - won't trigger change detection
    setTimeout(() => {
      this.message.set('timeout completed');
    }, 1000);
  }

  startInterval() {
    // BAD: setInterval in zoneless - won't trigger change detection
    setInterval(() => {
      this.message.update(msg => msg + '!');
    }, 500);
  }

  asyncOperation() {
    // BAD: Promise-based operation
    return new Promise(resolve => {
      setTimeout(() => resolve('done'), 2000);
    });
  }
}

// BAD: Service with async operations
class AsyncService {
  result = signal('');

  performAsync() {
    // BAD: setTimeout without signal updates
    setTimeout(() => {
      this.result.set('async result');
    }, 1500);
  }

  promiseBased() {
    // BAD: Promise without proper handling
    return new Promise(resolve => {
      setTimeout(() => resolve('promise result'), 1000);
    });
  }
}

describe('Zoneless Testing - Bad Examples', () => {
  let component: TimerComponent;
  let service: AsyncService;

  beforeEach(async () => {
    // BAD: TestBed configured for zoneless but using Zone.js utilities
    await TestBed.configureTestingModule({
      declarations: [TimerComponent],
      providers: [AsyncService]
    }).compileComponents();

    const fixture = TestBed.createComponent(TimerComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(AsyncService);
  });

  // BAD: Using fakeAsync in zoneless tests
  it('should use fakeAsync with setTimeout', fakeAsync(() => {
    component.startTimer();

    // BAD: tick() doesn't work in zoneless - timer won't advance
    tick(1000);

    // BAD: Expecting timeout to have completed
    expect(component.message()).toBe('timeout completed'); // Will fail
  }));

  // BAD: Using fakeAsync with setInterval
  it('should use fakeAsync with setInterval', fakeAsync(() => {
    component.startInterval();

    // BAD: tick() doesn't affect setInterval in zoneless
    tick(500);
    tick(500);

    // BAD: Expecting interval to have run
    expect(component.message()).toContain('!'); // Will fail
  }));

  // BAD: Testing promises with fakeAsync
  it('should test promises with fakeAsync', fakeAsync(() => {
    let result: string;

    component.asyncOperation().then(data => {
      result = data as string;
    });

    // BAD: tick() doesn't resolve promises in zoneless
    tick(2000);

    // BAD: Promise won't resolve
    expect(result).toBe('done'); // Will fail
  }));

  // BAD: Service testing with fakeAsync
  it('should test service with fakeAsync', fakeAsync(() => {
    service.performAsync();

    // BAD: tick() won't trigger the setTimeout
    tick(1500);

    // BAD: Service result won't update
    expect(service.result()).toBe('async result'); // Will fail
  }));

  // BAD: Mixed Zone.js and zoneless utilities
  it('should mix zone and zoneless utilities', fakeAsync(() => {
    // BAD: Using both Zone.js testing utilities and expecting zoneless behavior
    component.startTimer();
    service.performAsync();

    // BAD: tick() only affects Zone.js timers, not zoneless ones
    tick(1000);

    // BAD: Neither will work as expected
    expect(component.message()).toBe('timeout completed');
    expect(service.result()).toBe('async result'); // Both will fail
  }));

  // BAD: Testing async service methods
  it('should test async service method', fakeAsync(() => {
    let result: string;

    service.promiseBased().then(data => {
      result = data as string;
    });

    // BAD: flush() doesn't work for promises in this context
    // tick() doesn't resolve promises
    tick(1000);

    expect(result).toBe('promise result'); // Will fail
  }));

  // BAD: Complex timer scenarios
  it('should handle complex timer scenarios', fakeAsync(() => {
    component.startTimer();
    component.startInterval();

    // BAD: Multiple timer types with fakeAsync
    tick(1000); // Should trigger timeout
    tick(500);  // Should trigger interval

    // BAD: None of the timers will work as expected
    expect(component.message()).toBe('timeout completed!');
    // Will fail
  }));
});

// Import signal
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';