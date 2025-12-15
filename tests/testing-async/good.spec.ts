// GOOD: Proper async testing patterns
import { fakeAsync, tick, flush, flushMicrotasks } from '@angular/core/testing';
import { of, throwError, timer } from 'rxjs';
import { delay } from 'rxjs/operators';

// GOOD: Service with async operations
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

describe('AsyncService Good Tests', () => {
  let service: AsyncService;

  beforeEach(() => {
    service = new AsyncService();
  });

  // GOOD: Using done() callback properly
  it('should get data with done callback', (done) => {
    service.getData().subscribe(data => {
      expect(data).toBe('data');
      done(); // GOOD: Properly calling done()
    });
  });

  // GOOD: Using fakeAsync with tick()
  it('should handle async with fakeAsync', fakeAsync(() => {
    let result: string;

    service.getData().subscribe(data => result = data);

    // GOOD: Advance virtual time
    tick(1000);
    expect(result).toBe('data');
  }));

  // GOOD: Handling promises in fakeAsync
  it('should handle promises with flush', fakeAsync(() => {
    let result: string;

    Promise.resolve('data').then(data => result = data);

    // GOOD: Flush microtasks
    flushMicrotasks();
    expect(result).toBe('data');
  }));

  // GOOD: Complex async operations
  it('should handle complex async', fakeAsync(() => {
    let result: number;

    service.complexAsync().subscribe(data => result = data);

    // GOOD: Handle both timer and delay
    tick(2000); // timer
    tick(1000); // delay
    expect(result).toBeDefined();
  }));

  // GOOD: Error testing with async handling
  it('should handle errors properly', (done) => {
    service.failOperation().subscribe({
      next: () => fail('Should not succeed'),
      error: (err) => {
        expect(err.message).toBe('Failed');
        done();
      }
    });
  });

  // GOOD: Multiple async operations with coordination
  it('should handle multiple async ops', fakeAsync(() => {
    let result1: string;
    let result2: string;

    service.getData().subscribe(data => result1 = data);
    service.getData().subscribe(data => result2 = data);

    tick(1000);

    expect(result1).toBe('data');
    expect(result2).toBe('data');
  }));

  // GOOD: Async test with proper cleanup
  it('should clean up subscriptions', () => {
    let subscription = service.getData().subscribe(() => {
      // Do nothing
    });

    // GOOD: Cleanup after test
    subscription.unsubscribe();
  });

  // GOOD: Using async/await with done
  it('should work with async/await', async () => {
    const result = await service.getData().toPromise();
    expect(result).toBe('data');
  });

  // GOOD: Testing observables with marble testing approach
  it('should handle observable timing', fakeAsync(() => {
    let emissions: string[] = [];

    const observable = of('first').pipe(delay(500));

    observable.subscribe(data => emissions.push(data));

    tick(500);
    expect(emissions).toEqual(['first']);
  }));

  // GOOD: Testing error scenarios in fakeAsync
  it('should handle errors in fakeAsync', fakeAsync(() => {
    let error: Error;

    service.failOperation().subscribe({
      error: (err) => error = err
    });

    tick(500);
    expect(error.message).toBe('Failed');
  }));

  // GOOD: Testing completion
  it('should test completion', (done) => {
    let completed = false;

    service.getData().subscribe({
      next: (data) => expect(data).toBe('data'),
      complete: () => {
        completed = true;
        done();
      }
    });
  });
});