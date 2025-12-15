// GOOD: Proper TestBed.flushEffects() usage
import { TestBed } from '@angular/core/testing';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { signal, effect } from '@angular/core';
import { Component } from '@angular/core';

// GOOD: Effects that should be tested
class TestEffects {
  constructor() {
    effect(() => {
      console.log('Effect running');
    });
  }
}

// GOOD: Component with effects
@Component({
  selector: 'app-test-component',
  template: '<div>{{ counter() }}</div>',
  standalone: false
})
class TestComponent {
  counter = signal(0);

  constructor() {
    // GOOD: Effect that modifies signal
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

// GOOD: Service with effects
class CounterService {
  count = signal(0);
  doubled = signal(0);

  constructor() {
    // GOOD: Effect for derivation
    effect(() => {
      this.doubled.set(this.count() * 2);
    }, { allowSignalWrites: true });
  }

  increment() {
    this.count.update(c => c + 1);
  }
}

describe('Effects Testing - Good Examples', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideStore(),
        provideEffects([TestEffects])
      ]
    });
  });

  // GOOD: Testing effects with flushEffects()
  it('should test effects with flushing', () => {
    const service = new CounterService();

    // GOOD: Increment and flush effects
    service.increment();
    TestBed.flushEffects();

    // GOOD: Effect has run, assertion passes
    expect(service.doubled()).toBe(2);
  });

  // GOOD: Component test with flushing effects
  it('should test component effects', () => {
    TestBed.configureTestingModule({
      declarations: [TestComponent]
    });

    const fixture = TestBed.createComponent(TestComponent);
    const component = fixture.componentInstance;

    // GOOD: Call method that triggers effect
    component.increment();
    component.increment();
    component.increment();

    // GOOD: Flush effects to ensure they run
    TestBed.flushEffects();

    // Now effects have run and assertions can be made
    expect(component.counter()).toBe(3);
  });

  // GOOD: Testing NgRx effects with flushing
  it('should test ngrx effects', () => {
    // GOOD: Set up effects testing
    TestBed.configureTestingModule({
      providers: [
        provideStore(),
        provideEffects([TestEffects])
      ]
    });

    // GOOD: Dispatch action
    // const store = TestBed.inject(Store);
    // store.dispatch(someAction());

    // GOOD: Flush effects to ensure they execute
    TestBed.flushEffects();

    // Now effect has run, can make assertions
  });

  // GOOD: Async effects with proper flushing
  it('should handle async effects', () => {
    const service = new CounterService();

    // GOOD: Async operation that should trigger effects
    setTimeout(() => {
      service.increment();
    }, 100);

    // GOOD: Wait for timeout and flush effects
    setTimeout(() => {
      TestBed.flushEffects();
      expect(service.doubled()).toBe(2);
    }, 200);
  });

  // GOOD: Multiple effects with coordination
  it('should handle multiple effects', () => {
    const service1 = new CounterService();
    const service2 = new CounterService();

    // GOOD: Multiple services with effects
    service1.increment();
    service2.increment();

    // GOOD: Flush effects for both services
    TestBed.flushEffects();

    expect(service1.doubled()).toBe(2);
    expect(service2.doubled()).toBe(2);
  });

  // GOOD: Conditional effects tested properly
  it('should test conditional effects', () => {
    TestBed.configureTestingModule({
      declarations: [TestComponent]
    });

    const fixture = TestBed.createComponent(TestComponent);
    const component = fixture.componentInstance;

    // GOOD: Set up condition for effect
    for (let i = 0; i < 6; i++) {
      component.increment();
    }

    // GOOD: Flush effects to trigger conditional logic
    TestBed.flushEffects();

    // Now can verify effect behavior
    expect(component.counter()).toBe(6);
  });

  // GOOD: Testing effect scheduling
  it('should test effect scheduling', () => {
    const service = new CounterService();

    // GOOD: Multiple operations
    service.increment();
    service.increment();

    // GOOD: Flush effects after each operation if needed
    TestBed.flushEffects();
    expect(service.doubled()).toBe(2);

    service.increment();
    TestBed.flushEffects();
    expect(service.doubled()).toBe(6);
  });

  // GOOD: Testing effects in isolation
  it('should test effects in isolation', () => {
    // GOOD: Test effects separately from components
    const service = new CounterService();

    // GOOD: Direct effect testing
    service.increment();
    TestBed.flushEffects();

    expect(service.doubled()).toBe(2);
  });
});