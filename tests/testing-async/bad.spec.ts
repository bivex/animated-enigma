// BAD: Async testing mishandling anti-patterns
import { fakeAsync, tick, flush } from '@angular/core/testing';
import { of, throwError, timer } from 'rxjs';
import { delay } from 'rxjs/operators';

// BAD: Service with async operations
class AsyncService {
  getData() {
    return of('data').pipe(delay(1000));
  }

  failOperation() {
    return throwError(() => new Error('Failed')).pipe(delay(500));
  }

  complexAsync() {
    return timer(2000).pipe(delay(1000));
  }
}

describe('AsyncService Bad Tests', () => {
  let service: AsyncService;

  beforeEach(() => {
    service = new AsyncService();
  });

  // BAD: Not handling async operations properly
  it('should get data synchronously', () => {
    // BAD: Treating async as sync - this will fail
    let result: string;
    service.getData().subscribe(data => result = data);

    // BAD: Expecting immediate result
    expect(result).toBe('data'); // Will be undefined!
  });

  // BAD: Using done() callback incorrectly
  it('should handle async with done', (done) => {
    service.getData().subscribe(data => {
      expect(data).toBe('data');
      // BAD: Not calling done() - test will timeout
    });
  });

  // BAD: Mixing fakeAsync with real async
  it('should mix fakeAsync and real async', fakeAsync(() => {
    let result: string;

    // BAD: fakeAsync with real delay won't work
    service.getData().subscribe(data => result = data);

    // BAD: tick() doesn't affect real timers
    tick(1000);
    expect(result).toBe('data'); // Will fail
  }));

  // BAD: Not flushing microtasks
  it('should handle promises without flush', fakeAsync(() => {
    let result: string;

    // BAD: Promise in fakeAsync without flush
    Promise.resolve('data').then(data => result = data);

    // BAD: No flush() call
    expect(result).toBe('data'); // Will be undefined
  }));

  // BAD: Complex async without proper handling
  it('should handle complex async badly', () => {
    let result: number;

    service.complexAsync().subscribe(data => result = data);

    // BAD: No async handling at all
    expect(result).toBeDefined(); // Will fail
  });

  // BAD: Error testing without proper async handling
  it('should handle errors synchronously', () => {
    let error: Error;

    service.failOperation().subscribe({
      error: (err) => error = err
    });

    // BAD: Expecting immediate error
    expect(error).toBeDefined(); // Will be undefined
  });

  // BAD: Multiple async operations without coordination
  it('should handle multiple async ops', () => {
    let result1: string;
    let result2: string;

    service.getData().subscribe(data => result1 = data);
    service.getData().subscribe(data => result2 = data);

    // BAD: No waiting for completion
    expect(result1).toBe('data');
    expect(result2).toBe('data'); // Both will fail
  });

  // BAD: Async test without proper cleanup
  it('should not clean up subscriptions', () => {
    // BAD: Creating subscription without unsubscribing
    const subscription = service.getData().subscribe(() => {
      // Do nothing
    });

    // BAD: No cleanup - potential memory leak in test
  });
});