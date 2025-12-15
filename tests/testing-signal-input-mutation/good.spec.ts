// GOOD: Proper signal input testing with setInput()
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, input, effect } from '@angular/core';
import { Component } from '@angular/core';

// GOOD: Component with signal inputs
@Component({
  selector: 'app-test-component',
  template: '<div>{{ title() }} - {{ count() }}</div>',
  standalone: false
})
class TestComponent {
  // GOOD: Signal inputs (readonly)
  title = input('default');
  count = input(0);

  // Computed signal based on inputs
  displayText = signal('');

  constructor() {
    // GOOD: Effect that depends on inputs
    effect(() => {
      this.displayText.set(`${this.title()} (${this.count()})`);
    });
  }
}

// GOOD: Component with required signal inputs
@Component({
  selector: 'app-required-inputs-component',
  template: '<span>{{ name() }}</span>',
  standalone: false
})
class RequiredInputsComponent {
  // GOOD: Required signal input
  name = input.required<string>();

  greeting = signal('');

  constructor() {
    effect(() => {
      this.greeting.set(`Hello, ${this.name()}!`);
    });
  }
}

// GOOD: Service with signal inputs
class TestService {
  title = input('service default');

  getDisplayTitle() {
    return `Service: ${this.title()}`;
  }
}

describe('Signal Input Testing - Good Examples', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  // GOOD: Using setInput() for signal inputs
  it('should set input with setInput', () => {
    // GOOD: Use setInput() method
    fixture.componentRef.setInput('title', 'new title');

    expect(component.title()).toBe('new title');
  });

  // GOOD: Testing input changes properly
  it('should modify count with setInput', () => {
    // GOOD: Proper API usage
    fixture.componentRef.setInput('count', 5);

    expect(component.count()).toBe(5);
  });

  // GOOD: Testing with change detection
  it('should update template with setInput', () => {
    // GOOD: Set input and detect changes
    fixture.componentRef.setInput('title', 'updated title');
    fixture.componentRef.setInput('count', 10);
    fixture.detectChanges();

    // GOOD: Template reflects input changes
    const element = fixture.nativeElement;
    expect(element.textContent).toContain('updated title');
    expect(element.textContent).toContain('10');
  });

  // GOOD: Testing required inputs correctly
  it('should handle required inputs properly', async () => {
    await TestBed.configureTestingModule({
      declarations: [RequiredInputsComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(RequiredInputsComponent);

    // GOOD: Provide required input using setInput
    fixture.componentRef.setInput('name', 'John Doe');
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.name()).toBe('John Doe');
    expect(component.greeting()).toBe('Hello, John Doe!');
  });

  // GOOD: Testing effects with input changes
  it('should test effects with input changes', () => {
    // GOOD: Change inputs
    fixture.componentRef.setInput('title', 'effect test');
    fixture.componentRef.setInput('count', 42);

    // GOOD: Flush effects to ensure they run
    TestBed.flushEffects();

    // GOOD: Verify effect results
    expect(component.displayText()).toBe('effect test (42)');
  });

  // GOOD: Batch input changes
  it('should change multiple inputs properly', () => {
    // GOOD: Set multiple inputs
    fixture.componentRef.setInput('title', 'batch title');
    fixture.componentRef.setInput('count', 99);

    // GOOD: Verify both changes
    expect(component.title()).toBe('batch title');
    expect(component.count()).toBe(99);
  });

  // GOOD: Testing input defaults
  it('should test default input values', () => {
    // GOOD: Don't set inputs, test defaults
    expect(component.title()).toBe('default');
    expect(component.count()).toBe(0);
  });

  // GOOD: Testing input reactivity
  it('should test input reactivity', () => {
    // GOOD: Set initial values
    fixture.componentRef.setInput('count', 1);
    TestBed.flushEffects();

    expect(component.displayText()).toBe('default (1)');

    // GOOD: Change input and verify reactivity
    fixture.componentRef.setInput('title', 'reactive');
    TestBed.flushEffects();

    expect(component.displayText()).toBe('reactive (1)');
  });

  // GOOD: Testing service with signal inputs
  it('should test service with inputs', () => {
    const service = new TestService();

    // GOOD: For services, you might need to use a different approach
    // or avoid signal inputs in services if they complicate testing
    expect(service.getDisplayTitle()).toBe('Service: service default');
  });
});

// Import TestBed for flushEffects
import { TestBed } from '@angular/core/testing';