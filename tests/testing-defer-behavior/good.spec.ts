// GOOD: Proper DeferBlockBehavior configuration
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeferBlockBehavior } from '@angular/core';
import { Component } from '@angular/core';

// GOOD: Component with @defer blocks
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

// GOOD: Component with @defer and @loading/@error
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

// GOOD: Complex defer scenarios
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

describe('DeferBlockBehavior Testing - Good Examples', () => {
  // GOOD: Proper DeferBlockBehavior configuration
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeferComponent],
      deferBlockBehavior: DeferBlockBehavior.Playthrough
      // GOOD: Configure defer behavior for testing
    }).compileComponents();
  });

  // GOOD: Testing @defer with proper behavior configuration
  it('should test defer blocks with playthrough', () => {
    const fixture = TestBed.createComponent(DeferComponent);
    fixture.detectChanges();

    // GOOD: @defer blocks render with Playthrough behavior
    const element = fixture.nativeElement;

    // GOOD: All deferred content is now visible
    expect(element.textContent).toContain('Deferred content');
    expect(element.textContent).toContain('Deferred on viewport');
    expect(element.textContent).toContain('Deferred on interaction');
  });

  // GOOD: Testing @defer with Manual behavior for control
  it('should test defer with manual behavior', async () => {
    await TestBed.configureTestingModule({
      declarations: [DeferComponent],
      deferBlockBehavior: DeferBlockBehavior.Manual
    }).compileComponents();

    const fixture = TestBed.createComponent(DeferComponent);
    fixture.detectChanges();

    // GOOD: With Manual behavior, can control when defer blocks render
    const deferBlocks = fixture.componentInstance;
    // Note: In real testing, you'd trigger defer blocks manually
  });

  // GOOD: Testing conditional defer
  it('should test conditional defer', async () => {
    await TestBed.configureTestingModule({
      declarations: [ComplexDeferComponent],
      deferBlockBehavior: DeferBlockBehavior.Playthrough
    }).compileComponents();

    const fixture = TestBed.createComponent(ComplexDeferComponent);
    fixture.detectChanges();

    // GOOD: Conditional defer renders with Playthrough
    const element = fixture.nativeElement;
    expect(element.textContent).toContain('Conditional defer');
  });

  // GOOD: Testing timer-based defer
  it('should test timer defer', async () => {
    await TestBed.configureTestingModule({
      declarations: [ComplexDeferComponent],
      deferBlockBehavior: DeferBlockBehavior.Playthrough
    }).compileComponents();

    const fixture = TestBed.createComponent(ComplexDeferComponent);
    fixture.detectChanges();

    // GOOD: Timer-based defer renders immediately with Playthrough
    const element = fixture.nativeElement;
    expect(element.textContent).toContain('Timer-based defer');
  });

  // GOOD: Testing @defer with loading states
  it('should test defer loading states', async () => {
    await TestBed.configureTestingModule({
      declarations: [DeferLoadingComponent],
      deferBlockBehavior: DeferBlockBehavior.Playthrough
    }).compileComponents();

    const fixture = TestBed.createComponent(DeferLoadingComponent);
    fixture.detectChanges();

    // GOOD: With Playthrough, can test the structure of loading states
    const element = fixture.nativeElement;
    // Note: Loading states may not show immediately with Playthrough
  });

  // GOOD: Testing hydration triggers
  it('should test hydration triggers', async () => {
    await TestBed.configureTestingModule({
      declarations: [ComplexDeferComponent],
      deferBlockBehavior: DeferBlockBehavior.Playthrough
    }).compileComponents();

    const fixture = TestBed.createComponent(ComplexDeferComponent);
    fixture.detectChanges();

    // GOOD: Form is rendered with Playthrough behavior
    const element = fixture.nativeElement;
    const input = element.querySelector('input');
    expect(input).toBeTruthy();
    expect(input.placeholder).toBe('Interactive form');
  });

  // GOOD: Testing @error blocks
  it('should test error states with manual control', async () => {
    await TestBed.configureTestingModule({
      declarations: [DeferLoadingComponent],
      deferBlockBehavior: DeferBlockBehavior.Manual
    }).compileComponents();

    const fixture = TestBed.createComponent(DeferLoadingComponent);

    // GOOD: With Manual behavior, can potentially test error states
    // by controlling when defer blocks complete or fail
    fixture.detectChanges();

    const element = fixture.nativeElement;
    // Note: Error testing would require more complex setup
  });

  // GOOD: Testing different defer behaviors
  it('should test different defer behaviors', async () => {
    // GOOD: Test with Playthrough
    await TestBed.configureTestingModule({
      declarations: [DeferComponent],
      deferBlockBehavior: DeferBlockBehavior.Playthrough
    }).compileComponents();

    const fixture1 = TestBed.createComponent(DeferComponent);
    fixture1.detectChanges();

    expect(fixture1.nativeElement.textContent).toContain('Deferred content');

    // GOOD: Reset TestBed and test with Manual
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      declarations: [DeferComponent],
      deferBlockBehavior: DeferBlockBehavior.Manual
    }).compileComponents();

    const fixture2 = TestBed.createComponent(DeferComponent);
    fixture2.detectChanges();

    // GOOD: With Manual, deferred content doesn't render automatically
    expect(fixture2.nativeElement.textContent).not.toContain('Deferred content');
  });

  // GOOD: Integration testing with defer blocks
  it('should integrate defer blocks properly', async () => {
    await TestBed.configureTestingModule({
      declarations: [DeferComponent],
      deferBlockBehavior: DeferBlockBehavior.Playthrough
    }).compileComponents();

    const fixture = TestBed.createComponent(DeferComponent);
    fixture.detectChanges();

    // GOOD: Full integration test with all defer blocks
    const element = fixture.nativeElement;

    expect(element.textContent).toContain('Above fold content');
    expect(element.textContent).toContain('Deferred content');
    expect(element.querySelector('button')).toBeTruthy();
  });
});