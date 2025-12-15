// GOOD: Minimal TestBed configuration anti-pattern avoidance
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

// GOOD: Simple test component
@Component({
  selector: 'app-test-component',
  template: '<div>{{ data }}</div>',
  standalone: false
})
export class TestComponent {
  data = 'test';
}

describe('TestComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    // GOOD: Minimal TestBed configuration - only what's needed
    await TestBed.configureTestingModule({
      declarations: [TestComponent]
      // GOOD: No unnecessary imports or providers
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display data', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('div').textContent).toContain('test');
  });
});

// GOOD: Testing a service without TestBed when possible
describe('SimpleService', () => {
  let service: SimpleService;

  beforeEach(() => {
    // GOOD: Instantiate service directly when no dependencies
    service = new SimpleService();
  });

  it('should work', () => {
    expect(service).toBeDefined();
  });
});

// GOOD: Service with minimal dependencies
describe('ServiceWithDeps', () => {
  let service: ServiceWithDeps;

  beforeEach(() => {
    // GOOD: Only configure what the service actually needs
    TestBed.configureTestingModule({
      providers: [
        ServiceWithDeps,
        // GOOD: Only provide actual dependencies
      ]
    });
    service = TestBed.inject(ServiceWithDeps);
  });

  it('should work', () => {
    expect(service).toBeDefined();
  });
});

// GOOD: Component with specific dependencies
describe('ComponentWithDeps', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComponentWithDeps],
      imports: [
        // GOOD: Only import what the component actually uses
        // If it uses HttpClient, include HttpClientTestingModule
        // If it uses Router, include RouterTestingModule
      ]
    }).compileComponents();
  });

  it('should work', () => {
    const fixture = TestBed.createComponent(ComponentWithDeps);
    expect(fixture.componentInstance).toBeDefined();
  });
});

// Mock classes for examples
class SimpleService {}
class ServiceWithDeps {}

// Mock component for examples
@Component({
  selector: 'app-component-with-deps',
  template: '<div></div>',
  standalone: false
})
class ComponentWithDeps {}