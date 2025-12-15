// BAD: Missing DeferBlockBehavior configuration anti-pattern
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

// BAD: Component with @defer blocks
@Component({
  selector: 'app-defer-component',
  template: `
    <div>
      <h1>Above fold content</h1>
      @defer {
        <p>Deferred content that loads immediately</p>
      }
      @defer (on viewport) {
        <p>Deferred on viewport</p>
      }
      @defer (on interaction) {
        <button>Click me</button>
        <p>Deferred on interaction</p>
      }
    </div>
  `,
  standalone: false
})
class DeferComponent {}

// BAD: Component with @defer and @loading/@error
@Component({
  selector: 'app-defer-loading-component',
  template: `
    @defer (on viewport) {
      <p>Deferred content</p>
    } @loading (after 100ms; minimum 500ms) {
      <p>Loading...</p>
    } @error {
      <p>Error loading content</p>
    }
  `,
  standalone: false
})
class DeferLoadingComponent {}

// BAD: Complex defer scenarios
@Component({
  selector: 'app-complex-defer-component',
  template: `
    @defer (when condition()) {
      <p>Conditional defer</p>
    }
    @defer (on timer(2s)) {
      <p>Timer-based defer</p>
    }
    @defer (hydrate on interaction) {
      <form>
        <input type="text" placeholder="Interactive form">
      </form>
    }
  `,
  standalone: false
})
class ComplexDeferComponent {
  condition = () => false;
}

describe('DeferBlockBehavior Testing - Bad Examples', () => {
  // BAD: No DeferBlockBehavior configuration
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeferComponent]
      // BAD: Missing deferBlockBehavior configuration
    }).compileComponents();
  });

  // BAD: Testing @defer without proper behavior configuration
  it('should test defer blocks without configuration', () => {
    const fixture = TestBed.createComponent(DeferComponent);

    // BAD: @defer blocks won't render without Manual behavior override
    const element = fixture.nativeElement;

    // BAD: Expecting deferred content to be visible
    expect(element.textContent).toContain('Deferred content'); // Will fail
  });

  // BAD: Testing @defer with conditions
  it('should test conditional defer', () => {
    TestBed.configureTestingModule({
      declarations: [ComplexDeferComponent]
    });

    const fixture = TestBed.createComponent(ComplexDeferComponent);

    // BAD: Conditional defer won't trigger without proper configuration
    const element = fixture.nativeElement;

    // BAD: Expecting conditional content to show
    expect(element.textContent).toContain('Conditional defer'); // Will fail
  });

  // BAD: Testing @defer with timers
  it('should test timer defer', () => {
    TestBed.configureTestingModule({
      declarations: [ComplexDeferComponent]
    });

    const fixture = TestBed.createComponent(ComplexDeferComponent);

    // BAD: Timer-based defer won't trigger without Manual behavior
    const element = fixture.nativeElement;

    // BAD: Expecting timer content to show
    expect(element.textContent).toContain('Timer-based defer'); // Will fail
  });

  // BAD: Testing @defer with loading states
  it('should test defer loading states', () => {
    TestBed.configureTestingModule({
      declarations: [DeferLoadingComponent]
    });

    const fixture = TestBed.createComponent(DeferLoadingComponent);

    // BAD: Loading states won't show without proper defer behavior
    const element = fixture.nativeElement;

    // BAD: Can't test loading states properly
    expect(element.textContent).toContain('Loading...'); // Will fail
  });

  // BAD: Testing hydration triggers
  it('should test hydration triggers', () => {
    TestBed.configureTestingModule({
      declarations: [ComplexDeferComponent]
    });

    const fixture = TestBed.createComponent(ComplexDeferComponent);

    // BAD: Hydration triggers won't work without proper configuration
    const element = fixture.nativeElement;

    // BAD: Form won't be interactive as expected
    const input = element.querySelector('input');
    expect(input).toBeNull(); // Will be null because content isn't rendered
  });

  // BAD: Multiple defer blocks testing
  it('should test multiple defer blocks', () => {
    const fixture = TestBed.createComponent(DeferComponent);

    // BAD: None of the defer blocks will render
    const element = fixture.nativeElement;

    // BAD: All expectations will fail
    expect(element.textContent).toContain('Deferred content');
    expect(element.textContent).toContain('Deferred on viewport');
    expect(element.textContent).toContain('Deferred on interaction');
  });

  // BAD: Testing defer without fixture.detectChanges()
  it('should test defer without change detection', () => {
    const fixture = TestBed.createComponent(DeferComponent);

    // BAD: Not calling detectChanges()
    // fixture.detectChanges(); // Missing!

    const element = fixture.nativeElement;

    // BAD: Content won't be rendered
    expect(element.textContent).toContain('Above fold content'); // May pass
    expect(element.textContent).toContain('Deferred content'); // Will fail
  });

  // BAD: Testing @defer @error blocks
  it('should test error states', () => {
    TestBed.configureTestingModule({
      declarations: [DeferLoadingComponent]
    });

    const fixture = TestBed.createComponent(DeferLoadingComponent);

    // BAD: Error states can't be tested without proper defer behavior
    // Can't simulate loading failures
    const element = fixture.nativeElement;

    expect(element.textContent).toContain('Error loading content'); // Will fail
  });
});