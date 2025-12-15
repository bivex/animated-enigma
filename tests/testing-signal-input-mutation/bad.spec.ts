// BAD: Direct signal input mutation in tests anti-pattern
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, input } from '@angular/core';
import { Component } from '@angular/core';

// BAD: Component with signal inputs
@Component({
  selector: 'app-test-component',
  template: '<div>{{ title() }} - {{ count() }}</div>',
  standalone: false
})
class TestComponent {
  // BAD: Signal inputs (readonly)
  title = input('default');
  count = input(0);

  // Computed signal based on inputs
  displayText = signal('');

  constructor() {
    // BAD: Effect that depends on inputs
    effect(() => {
      this.displayText.set(`${this.title()} (${this.count()})`);
    });
  }
}

// BAD: Component with required signal inputs
@Component({
  selector: 'app-required-inputs-component',
  template: '<span>{{ name() }}</span>',
  standalone: false
})
class RequiredInputsComponent {
  // BAD: Required signal input
  name = input.required<string>();

  greeting = signal('');

  constructor() {
    effect(() => {
      this.greeting.set(`Hello, ${this.name()}!`);
    });
  }
}

// BAD: Service with signal inputs (uncommon but possible)
class TestService {
  title = input('service default');

  getDisplayTitle() {
    return `Service: ${this.title()}`;
  }
}

describe('Signal Input Mutation - Bad Examples', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  // BAD: Direct property assignment to signal input
  it('should set input directly', () => {
    // BAD: Trying to assign to readonly signal input
    try {
      (component as any).title = signal('new title'); // Type error, but runtime might allow
      expect(component.title()).toBe('new title'); // Will fail
    } catch (error) {
      // BAD: Catching errors instead of using proper API
      console.log('Expected error:', error);
    }
  });

  // BAD: Another direct assignment attempt
  it('should modify count directly', () => {
    // BAD: Direct property assignment
    (component as any).count = 5;

    // BAD: Expecting it to work
    expect(component.count()).toBe(5); // Will fail
  });

  // BAD: Using Object.assign on component
  it('should use Object.assign', () => {
    // BAD: Attempting to assign inputs via Object.assign
    Object.assign(component, {
      title: signal('assigned title'),
      count: signal(10)
    });

    // BAD: This won't work for signal inputs
    expect(component.title()).toBe('assigned title'); // Will fail
  });

  // BAD: Testing required inputs incorrectly
  it('should handle required inputs badly', () => {
    TestBed.configureTestingModule({
      declarations: [RequiredInputsComponent]
    });

    // BAD: Create component without providing required input
    expect(() => {
      const fixture = TestBed.createComponent(RequiredInputsComponent);
      // BAD: No setInput call
    }).toThrow(); // Might not throw as expected
  });

  // BAD: Service input mutation
  it('should mutate service inputs', () => {
    const service = new TestService();

    // BAD: Direct assignment to service input
    (service as any).title = 'modified';

    // BAD: Expecting change
    expect(service.getDisplayTitle()).toBe('Service: modified'); // Will fail
  });

  // BAD: Testing input changes without proper API
  it('should test input changes incorrectly', () => {
    // BAD: Direct property manipulation
    (component as any).title = 'changed';

    // BAD: Force change detection manually
    fixture.detectChanges();

    // BAD: Expecting template to update
    const element = fixture.nativeElement;
    expect(element.textContent).toContain('changed'); // Will fail
  });

  // BAD: Multiple input changes at once
  it('should change multiple inputs directly', () => {
    // BAD: Batch assignment attempt
    const newValues = {
      title: 'batch title',
      count: 99
    };

    Object.assign(component, newValues);

    // BAD: Expecting both to change
    expect(component.title()).toBe('batch title');
    expect(component.count()).toBe(99); // Both will fail
  });

  // BAD: Testing with fixture.componentInstance direct access
  it('should use fixture.componentInstance incorrectly', () => {
    // BAD: Direct assignment via fixture
    fixture.componentInstance.title = 'fixture title'; // Type error

    fixture.detectChanges();

    // BAD: Expecting it to work
    expect(component.title()).toBe('fixture title'); // Will fail
  });
});

// Import for effect
import { effect } from '@angular/core';