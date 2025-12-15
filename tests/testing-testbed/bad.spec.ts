// BAD: TestBed over-configuration anti-pattern
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateModule } from '@ngx-translate/core';
import { Component } from '@angular/core';

// BAD: Test component with unnecessary complexity
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
    // BAD: Massive TestBed configuration with everything under the sun
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [
        // BAD: Including way too many modules for a simple component test
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        StoreDevtoolsModule.instrument({
          maxAge: 25,
          logOnly: false,
          autoPause: true,
          trace: false,
          traceLimit: 75,
        }),
        // BAD: Including providers that aren't needed
      ],
      providers: [
        // BAD: Adding providers that the component doesn't use
        { provide: 'API_URL', useValue: 'http://test.com' },
        { provide: 'APP_CONFIG', useValue: { debug: true } },
        // BAD: Mock services that aren't actually used in the test
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // BAD: Test that doesn't actually test anything meaningful
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // BAD: Another pointless test
  it('should have data', () => {
    expect(component.data).toBe('test');
  });
});

// BAD: Another test suite with over-configuration for a simple service
describe('TestService', () => {
  beforeEach(() => {
    // BAD: Configuring TestBed for a service test when you could just instantiate it
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        // BAD: Tons of imports for testing a simple service
      ],
      providers: [
        // BAD: Service could be tested in isolation
      ]
    });
  });

  it('should work', () => {
    // BAD: Empty test that doesn't validate anything
    expect(true).toBe(true);
  });
});