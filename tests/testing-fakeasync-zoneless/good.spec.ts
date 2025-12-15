// GOOD: Proper zoneless testing without Zone.js utilities
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

// GOOD: Component that uses timers in zoneless mode
@Component({
  selector: 'app-timer-component',
  template: '<div>{{ message() }}</div>',
  standalone: false
})
class TimerComponent {
  message = signal('initial');

  startTimer() {
    // GOOD: setTimeout with proper signal updates
    setTimeout(() => {
      this.message.set('timeout completed');
    }, 1000);
  }

  startInterval() {
    // GOOD: setInterval with proper signal updates
    setInterval(() => {
      this.message.update(msg => msg + '!');
    }, 500);
  }

  asyncOperation() {
    // GOOD: Promise-based operation
    return new Promise(resolve => {
      setTimeout(() => resolve('done'), 2000);
    });
  }
}

// GOOD: Service with async operations
class AsyncService {
  result = signal('');

  performAsync() {
    // GOOD: setTimeout with signal updates
    setTimeout(() => {
      this.result.set('async result');
    }, 1500);
  }

  promiseBased() {
    // GOOD: Promise-based method
    return new Promise(resolve => {
      setTimeout(() => resolve('promise result'), 1000);
    });
  }
}

describe('Zoneless Testing - Good Examples', () => {
  let component: TimerComponent;
  let service: AsyncService;

  beforeEach(async () => {
    // GOOD: TestBed configured for zoneless testing
    await TestBed.configureTestingModule({
      declarations: [TimerComponent],
      providers: [AsyncService]
    }).compileComponents();

    const fixture = TestBed.createComponent(TimerComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(AsyncService);
  });

  // GOOD: Testing setTimeout with real timers
  it('should test setTimeout with real timers', async () => {
    component.startTimer();

    // GOOD: Wait for real timeout
    await new Promise(resolve => setTimeout(resolve, 1100));

    // GOOD: Manually trigger change detection if needed
    // (in zoneless, signals auto-trigger, but for testing we might need to ensure)

    expect(component.message()).toBe('timeout completed');
  });

  // GOOD: Testing setInterval with controlled execution
  it('should test setInterval carefully', async () => {
    component.startInterval();

    // GOOD: Wait for interval and clear it
    await new Promise(resolve => setTimeout(resolve, 600));

    // GOOD: Check that interval ran (at least once)
    expect(component.message()).toContain('!');
  });

  // GOOD: Testing promises properly
  it('should test promises correctly', async () => {
    const result = await component.asyncOperation();

    expect(result).toBe('done');
  });

  // GOOD: Service testing with real async
  it('should test service async operations', async () => {
    service.performAsync();

    // GOOD: Wait for async operation
    await new Promise(resolve => setTimeout(resolve, 1600));

    expect(service.result()).toBe('async result');
  });

  // GOOD: Testing async service methods
  it('should test async service method', async () => {
    const result = await service.promiseBased();

    expect(result).toBe('promise result');
  });

  // GOOD: Using Jasmine clock for controlled timing
  it('should use jasmine clock for timers', () => {
    // GOOD: Install jasmine clock for controlled timing
    jasmine.clock().install();

    component.startTimer();

    // GOOD: Advance jasmine clock
    jasmine.clock().tick(1000);

    // GOOD: In zoneless, the setTimeout callback will run
    // but may need manual change detection trigger
    expect(component.message()).toBe('timeout completed');

    jasmine.clock().uninstall();
  });

  // GOOD: Testing intervals with jasmine clock
  it('should test intervals with jasmine clock', () => {
    jasmine.clock().install();

    component.startInterval();

    // GOOD: Advance clock to trigger interval
    jasmine.clock().tick(500);
    expect(component.message()).toBe('initial!');

    jasmine.clock().tick(500);
    expect(component.message()).toBe('initial!!');

    jasmine.clock().uninstall();
  });

  // GOOD: Complex async scenarios with proper waiting
  it('should handle complex async scenarios', async () => {
    // GOOD: Start multiple async operations
    const promise1 = component.asyncOperation();
    service.performAsync();

    // GOOD: Wait for all operations
    const result1 = await promise1;
    await new Promise(resolve => setTimeout(resolve, 1600));

    expect(result1).toBe('done');
    expect(service.result()).toBe('async result');
  });

  // GOOD: Testing with proper cleanup
  it('should clean up timers', () => {
    jasmine.clock().install();

    const intervalId = setInterval(() => {
      component.message.update(msg => msg + 'x');
    }, 100);

    // GOOD: Advance clock
    jasmine.clock().tick(100);
    expect(component.message()).toBe('initialx');

    // GOOD: Clean up
    clearInterval(intervalId);
    jasmine.clock().uninstall();
  });

  // GOOD: Using async/await patterns
  it('should use async/await patterns', async () => {
    // GOOD: Direct async/await usage
    const result = await component.asyncOperation();
    expect(result).toBe('done');

    // GOOD: Wait for service operation
    service.performAsync();
    await new Promise(resolve => setTimeout(resolve, 1600));
    expect(service.result()).toBe('async result');
  });
});

// Import signal
import { signal } from '@angular/core';