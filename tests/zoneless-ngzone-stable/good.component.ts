// GOOD: Proper zoneless patterns without NgZone.onStable dependency
import { Component, OnInit, OnDestroy, signal, effect, inject } from '@angular/core';
import { afterNextRender } from '@angular/core';

// GOOD: Component using proper zoneless patterns
@Component({
  selector: 'app-stable-independent',
  template: `
    <div class="stable-independent">
      <h3>Stable Independent Component</h3>
      <p>Operations completed: {{ operationsCompleted() }}</p>
      <p>Status: {{ status() }}</p>
      <button (click)="triggerAsyncOperation()">Trigger Async</button>
    </div>
  `,
  standalone: false
})
export class StableIndependentComponent implements OnInit, OnDestroy {
  // GOOD: Signal-based state management
  operationsCompleted = signal(0);
  status = signal('Ready');
  private timeoutId: any;

  constructor() {
    // GOOD: Using afterNextRender for post-render work
    afterNextRender(() => {
      console.log('Component rendered');
      // GOOD: Safe to perform DOM operations here
    });
  }

  ngOnInit() {
    // GOOD: No NgZone.onStable dependency
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  // GOOD: Async operation with proper signal updates
  triggerAsyncOperation() {
    this.status.set('Processing...');

    // GOOD: setTimeout with signal updates
    this.timeoutId = setTimeout(() => {
      this.operationsCompleted.update(count => count + 1);
      this.status.set('Complete');
      console.log('Async operation completed');
    }, 1000);
  }
}

// GOOD: Service that doesn't depend on zone stability
export class ZoneIndependentService {
  // GOOD: Signal-based state
  private operationCount = signal(0);

  constructor() {
    // GOOD: Using afterNextRender for initialization
    afterNextRender(() => {
      console.log('Service initialized after render');
    });
  }

  // GOOD: Method that doesn't rely on stability
  performOperation(callback: () => void) {
    // GOOD: Execute immediately, let caller handle timing
    callback();
    this.operationCount.update(count => count + 1);
  }

  // GOOD: Reactive access to operation count
  getOperationCount() {
    return this.operationCount.asReadonly();
  }
}

// GOOD: Component using ZoneIndependentService
@Component({
  selector: 'app-zone-service-user',
  template: `
    <div class="zone-service-user">
      <h3>Zone Independent Service User</h3>
      <p>Operations: {{ operationCount() }}</p>
      <button (click)="performOperation()">Perform Operation</button>
    </div>
  `,
  standalone: false
})
export class ZoneServiceUserComponent {
  // GOOD: Reactive binding
  operationCount = this.zoneService.getOperationCount();

  constructor(private zoneService: ZoneIndependentService) {}

  // GOOD: Direct operation execution
  performOperation() {
    this.zoneService.performOperation(() => {
      console.log('Operation performed');
    });
  }
}

// GOOD: Directive that doesn't depend on zone stability
import { Directive, ElementRef, signal, effect } from '@angular/core';

@Directive({
  selector: '[appRenderAware]'
})
export class RenderAwareDirective implements OnInit {
  // GOOD: Signal-based state
  private renderCount = signal(0);

  constructor(private element: ElementRef) {}

  ngOnInit() {
    // GOOD: Using afterNextRender for DOM manipulation
    afterNextRender(() => {
      this.renderCount.update(count => count + 1);
      // GOOD: Safe DOM manipulation after render
      this.element.nativeElement.style.backgroundColor = 'lightblue';
      console.log('Element updated after render');
    });

    // GOOD: Effect for reactive updates
    effect(() => {
      console.log(`Render count: ${this.renderCount()}`);
    });
  }
}

// GOOD: Component using render-aware directive
@Component({
  selector: 'app-directive-user',
  template: `
    <div appRenderAware class="directive-user">
      <h3>Directive User</h3>
      <p>This element updates safely after render</p>
    </div>
  `,
  standalone: false
})
export class DirectiveUserComponent {}

// GOOD: HTTP interceptor that doesn't depend on stability
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

@Injectable()
export class ZoneIndependentHttpInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // GOOD: Add headers immediately without stability checks
    const enhancedReq = req.clone({
      headers: req.headers.set('X-Requested-At', new Date().toISOString())
    });
    return next.handle(enhancedReq);
  }
}

// GOOD: Router guard that doesn't depend on stability
import { CanActivate } from '@angular/router';
import { inject } from '@angular/core';

export const zoneIndependentGuard: CanActivate = () => {
  // GOOD: Guard logic without zone stability checks
  const authService = inject(AuthService);
  return authService.isAuthenticated();
};

// GOOD: Animation service that doesn't depend on stability
@Injectable({
  providedIn: 'root'
})
export class ZoneIndependentAnimationService {
  // GOOD: Method that animates immediately
  animateElement(element: HTMLElement) {
    // GOOD: Start animation immediately using afterNextRender if needed
    afterNextRender(() => {
      this.startAnimation(element);
    });
  }

  private startAnimation(element: HTMLElement) {
    // GOOD: Animation logic executed after render
    element.style.transition = 'transform 0.3s';
    element.style.transform = 'scale(1.1)';

    // GOOD: Clean up after animation
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, 300);
  }
}

// GOOD: Component using zone-independent animation service
@Component({
  selector: 'app-animated-component',
  template: `
    <div #animatedElement class="animated-component">
      <h3>Animated Component</h3>
      <button (click)="animate()">Animate</button>
    </div>
  `,
  standalone: false
})
export class AnimatedComponent {
  constructor(private animationService: ZoneIndependentAnimationService) {}

  // GOOD: Triggering animation without stability assumptions
  animate() {
    const element = this.animatedElement;
    if (element) {
      this.animationService.animateElement(element);
    }
  }

  private get animatedElement(): HTMLElement | null {
    return document.querySelector('.animated-component');
  }
}

// GOOD: Form validation that doesn't depend on stability
@Component({
  selector: 'app-independent-validation',
  template: `
    <form (ngSubmit)="onSubmit()">
      <input
        type="text"
        [(ngModel)]="inputValue"
        (input)="validateInput()"
        name="input"
      />
      <div *ngIf="validationMessage()">{{ validationMessage() }}</div>
      <button type="submit" [disabled]="!isValid()">Submit</button>
    </form>
  `,
  standalone: false
})
export class IndependentValidationComponent {
  // GOOD: Signal-based validation state
  inputValue = signal('');
  validationMessage = signal('');

  // GOOD: Computed signal for validation
  isValid = computed(() => {
    const value = this.inputValue();
    return value.length >= 3;
  });

  constructor() {
    // GOOD: Effect for validation logic
    effect(() => {
      this.validateInput();
    });
  }

  // GOOD: Validation method
  validateInput() {
    const value = this.inputValue();
    if (value.length < 3) {
      this.validationMessage.set('Input too short');
    } else {
      this.validationMessage.set('');
    }
  }

  onSubmit() {
    if (this.isValid()) {
      this.performSubmit();
    }
  }

  private performSubmit() {
    console.log('Submitting:', this.inputValue());
  }
}

// GOOD: Modal service that doesn't depend on stability
@Injectable({
  providedIn: 'root'
})
export class ZoneIndependentModalService {
  // GOOD: Signal-based modal state
  private isOpen = signal(false);

  // GOOD: Opening modal immediately
  openModal(component: any) {
    // GOOD: Update state immediately
    this.isOpen.set(true);
    console.log('Modal opened');

    // GOOD: Use afterNextRender if DOM manipulation is needed
    afterNextRender(() => {
      // DOM manipulation after render
    });
  }

  // GOOD: Reactive modal state
  getIsOpen() {
    return this.isOpen.asReadonly();
  }
}

// GOOD: Data loading service that doesn't depend on stability
@Injectable({
  providedIn: 'root'
})
export class ZoneIndependentDataService {
  // GOOD: Signal-based data storage
  private data = signal<any>(null);

  constructor() {
    // GOOD: Load data immediately or when needed
    this.loadInitialData();
  }

  private loadInitialData() {
    // GOOD: Load data without waiting for stability
    // Simulate data loading
    setTimeout(() => {
      this.data.set({ loaded: true, timestamp: Date.now() });
    }, 1000);
  }

  // GOOD: Method that saves data immediately
  saveData(newData: any) {
    // GOOD: Update signal immediately
    this.data.set(newData);
    console.log('Data saved');
  }

  // GOOD: Reactive data access
  getData() {
    return this.data.asReadonly();
  }
}

// GOOD: Component with proper timing using afterNextRender
@Component({
  selector: 'app-timing-aware',
  template: `
    <div class="timing-aware">
      <h3>Timing Aware Component</h3>
      <p>Initialization step: {{ initStep() }}</p>
      <button (click)="advanceStep()">Advance</button>
    </div>
  `,
  standalone: false
})
export class TimingAwareComponent implements OnInit {
  // GOOD: Signal-based initialization tracking
  initStep = signal(0);

  constructor() {
    // GOOD: Use afterNextRender for post-render initialization
    afterNextRender(() => {
      this.initStep.set(1);
      console.log('After first render');

      // GOOD: Chain multiple afterNextRender calls if needed
      afterNextRender(() => {
        this.initStep.set(2);
        console.log('After second render');
      });
    });
  }

  ngOnInit() {
    // GOOD: Initial setup
    this.initStep.set(0);
  }

  // GOOD: Method that advances step
  advanceStep() {
    this.initStep.update(step => step + 1);
  }
}

// GOOD: Service for coordinating async operations without zone stability
@Injectable({
  providedIn: 'root'
})
export class AsyncCoordinatorService {
  // GOOD: Signal-based operation tracking
  private pendingOperations = signal(0);

  // GOOD: Method to coordinate async operations
  async coordinateOperation<T>(operation: () => Promise<T>): Promise<T> {
    this.pendingOperations.update(count => count + 1);

    try {
      const result = await operation();
      return result;
    } finally {
      this.pendingOperations.update(count => count - 1);
    }
  }

  // GOOD: Reactive access to pending operations
  getPendingOperations() {
    return this.pendingOperations.asReadonly();
  }
}

// GOOD: Mock AuthService for examples
@Injectable({
  providedIn: 'root'
})
class AuthService {
  isAuthenticated() {
    return true;
  }
}