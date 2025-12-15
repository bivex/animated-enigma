// BAD: Missing TestBed.flushEffects() anti-pattern
import { TestBed } from '@angular/core/testing';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { signal, effect } from '@angular/core';

// BAD: Effect that should be tested but isn't flushed
class TestEffects {
  constructor() {
    effect(() => {
      console.log('Effect running');
    });
  }
}

// BAD: Component with effects
@Component({
  selector: 'app-test-component',
  template: '<div>{{ counter() }}</div>',
  standalone: false
})
class TestComponent {
  counter = signal(0);

  constructor() {
    // BAD: Effect that modifies signal
    effect(() => {
      if (this.counter() > 5) {
        console.log('Counter exceeded 5');
      }
    }, { allowSignalWrites: true });
  }

  increment() {
    this.counter.update(c => c + 1);
  }
}

// BAD: Service with effects
class CounterService {
  count = signal(0);
  doubled = signal(0);

  constructor() {
    // BAD: Effect for derivation
    effect(() => {
      this.doubled.set(this.count() * 2);
    }, { allowSignalWrites: true });
  }

  increment() {
    this.count.update(c => c + 1);
  }
}

describe('Effects Testing - Bad Examples', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideStore(),
        provideEffects([TestEffects])
      ]
    });
  });

  // BAD: Testing effects without flushEffects()
  it('should test effects without flushing', () => {
    const service = new CounterService();

    // BAD: Increment without flushing effects
    service.increment();

    // BAD: Expecting immediate effect execution
    expect(service.doubled()).toBe(2); // Will fail because effect hasn't run
  });

  // BAD: Component test without flushing effects
  it('should test component effects', () => {
    TestBed.configureTestingModule({
      declarations: [TestComponent]
    });

    const fixture = TestBed.createComponent(TestComponent);
    const component = fixture.componentInstance;

    // BAD: Call method that triggers effect
    component.increment();
    component.increment();
    component.increment();

    // BAD: No flushEffects() call
    // Effect won't have run, so any assertions based on effect side effects will fail
  });

  // BAD: Testing NgRx effects without flushing
  it('should test ngrx effects', () => {
    // BAD: Store actions dispatched but effects not flushed
    // const store = TestBed.inject(Store);
    // store.dispatch(someAction());

    // BAD: No TestBed.flushEffects()
    // Effect won't execute, test will fail
  });

  // BAD: Async effects without proper flushing
  it('should handle async effects', () => {
    const service = new CounterService();

    // BAD: Async operation that should trigger effects
    setTimeout(() => {
      service.increment();
    }, 100);

    // BAD: No flushEffects() after timeout
    // Effect won't run
  });

  // BAD: Multiple effects without coordination
  it('should handle multiple effects', () => {
    const service1 = new CounterService();
    const service2 = new CounterService();

    // BAD: Multiple services with effects
    service1.increment();
    service2.increment();

    // BAD: No flushEffects() - neither effect will run
    expect(service1.doubled()).toBe(2);
    expect(service2.doubled()).toBe(2); // Both will fail
  });

  // BAD: Conditional effects not tested properly
  it('should test conditional effects', () => {
    const component = new TestComponent();

    // BAD: Set up condition for effect
    for (let i = 0; i < 6; i++) {
      component.increment();
    }

    // BAD: No flushEffects() - effect condition never evaluated
    // Test can't verify effect behavior
  });
});

// BAD: Import for component decorator
import { Component } from '@angular/core';