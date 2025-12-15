// BAD: Relying on NgZone.onStable anti-patterns
import { Component, NgZone, OnInit, OnDestroy } from '@angular/core';

// BAD: Component that relies on NgZone.onStable
@Component({
  selector: 'app-stable-dependent',
  template: `
    <div class="stable-dependent">
      <h3>Stable Dependent Component</h3>
      <p>Stable state: {{ isStable }}</p>
      <p>Stable events count: {{ stableEventCount }}</p>
      <button (click)="triggerAsyncOperation()">Trigger Async</button>
    </div>
  `,
  standalone: false
})
export class StableDependentComponent implements OnInit, OnDestroy {
  isStable = false;
  stableEventCount = 0;
  private stableSubscription: any;

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    // BAD: Relying on NgZone.onStable in zoneless mode
    this.stableSubscription = this.ngZone.onStable.subscribe(() => {
      this.isStable = true; // BAD: Direct property assignment
      this.stableEventCount++; // BAD: Another direct assignment
      console.log('Zone became stable');

      // BAD: Performing work when zone becomes stable
      this.performStableWork();
    });

    // BAD: Also subscribing to onMicrotaskEmpty
    this.ngZone.onMicrotaskEmpty.subscribe(() => {
      console.log('Microtasks empty');
      // BAD: Assuming this means stable state
    });
  }

  ngOnDestroy() {
    // BAD: Not properly cleaning up subscriptions
    if (this.stableSubscription) {
      this.stableSubscription.unsubscribe();
    }
  }

  // BAD: Method that assumes stable timing
  triggerAsyncOperation() {
    // BAD: Async operation without proper handling
    setTimeout(() => {
      console.log('Async operation completed');
      // BAD: No change detection trigger in zoneless
    }, 1000);
  }

  // BAD: Work performed when stable
  private performStableWork() {
    // BAD: Assuming stable means safe to update UI
    this.isStable = true;
  }
}

// BAD: Service that depends on zone stability
export class ZoneDependentService {
  private stableCallbacks: (() => void)[] = [];
  private stableSubscription: any;

  constructor(private ngZone: NgZone) {
    // BAD: Service relying on zone stability
    this.stableSubscription = this.ngZone.onStable.subscribe(() => {
      // BAD: Executing callbacks when stable
      this.stableCallbacks.forEach(callback => callback());
      this.stableCallbacks = [];
    });
  }

  // BAD: Method that queues work for stable timing
  queueStableWork(callback: () => void) {
    // BAD: Assuming onStable will fire
    this.stableCallbacks.push(callback);
  }

  // BAD: Method that checks stability
  isStable(): boolean {
    // BAD: Checking NgZone.isStable
    return this.ngZone.isStable;
  }

  destroy() {
    if (this.stableSubscription) {
      this.stableSubscription.unsubscribe();
    }
  }
}

// BAD: Component using ZoneDependentService
@Component({
  selector: 'app-zone-service-user',
  template: `
    <div class="zone-service-user">
      <h3>Zone Service User</h3>
      <p>Stable: {{ isCurrentlyStable }}</p>
      <p>Work executed: {{ workExecutedCount }}</p>
      <button (click)="queueWork()">Queue Stable Work</button>
      <button (click)="checkStability()">Check Stability</button>
    </div>
  `,
  standalone: false
})
export class ZoneServiceUserComponent implements OnInit, OnDestroy {
  isCurrentlyStable = false;
  workExecutedCount = 0;

  constructor(private zoneService: ZoneDependentService) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.zoneService.destroy();
  }

  // BAD: Queueing work that assumes stable timing
  queueWork() {
    this.zoneService.queueStableWork(() => {
      this.workExecutedCount++; // BAD: Direct property update
      console.log('Stable work executed');
    });
  }

  // BAD: Checking stability status
  checkStability() {
    this.isCurrentlyStable = this.zoneService.isStable(); // BAD: Direct assignment
  }
}

// BAD: Directive that depends on zone stability
import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appStableAware]'
})
export class StableAwareDirective implements OnInit, OnDestroy {
  private stableSubscription: any;

  constructor(private ngZone: NgZone, private element: ElementRef) {}

  ngOnInit() {
    // BAD: Directive relying on stable events
    this.stableSubscription = this.ngZone.onStable.subscribe(() => {
      // BAD: Manipulating DOM when stable
      this.element.nativeElement.style.backgroundColor = 'green';
      console.log('Element updated when stable');
    });

    // BAD: Also using onMicrotaskEmpty
    this.ngZone.onMicrotaskEmpty.subscribe(() => {
      this.element.nativeElement.style.border = '2px solid blue';
    });
  }

  ngOnDestroy() {
    if (this.stableSubscription) {
      this.stableSubscription.unsubscribe();
    }
  }
}

// BAD: Component using stable-aware directive
@Component({
  selector: 'app-directive-user',
  template: `
    <div appStableAware class="directive-user">
      <h3>Directive User</h3>
      <p>This element changes when zone becomes stable</p>
    </div>
  `,
  standalone: false
})
export class DirectiveUserComponent {}

// BAD: HTTP interceptor that depends on stability
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

@Injectable()
export class StableHttpInterceptor implements HttpInterceptor {
  constructor(private ngZone: NgZone) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // BAD: Assuming stability for HTTP requests
    if (this.ngZone.isStable) {
      // BAD: Adding headers based on stability
      const stableReq = req.clone({
        headers: req.headers.set('X-Zone-Stable', 'true')
      });
      return next.handle(stableReq);
    }

    // BAD: Queuing requests until stable
    return new Promise(resolve => {
      const subscription = this.ngZone.onStable.subscribe(() => {
        subscription.unsubscribe();
        resolve(next.handle(req));
      });
    });
  }
}

// BAD: Router guard that depends on stability
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class StableGuard implements CanActivate {
  constructor(private ngZone: NgZone) {}

  canActivate(): boolean {
    // BAD: Guard logic based on zone stability
    if (!this.ngZone.isStable) {
      console.log('Zone not stable, waiting...');
      // BAD: Blocking navigation until stable
      return false;
    }

    return true;
  }
}

// BAD: Animation service that depends on stability
@Injectable({
  providedIn: 'root'
})
export class StableAnimationService {
  constructor(private ngZone: NgZone) {}

  // BAD: Method that waits for stability to start animations
  animateElement(element: HTMLElement) {
    if (this.ngZone.isStable) {
      // BAD: Starting animation assuming stability
      this.startAnimation(element);
    } else {
      // BAD: Waiting for stability
      const subscription = this.ngZone.onStable.subscribe(() => {
        subscription.unsubscribe();
        this.startAnimation(element);
      });
    }
  }

  private startAnimation(element: HTMLElement) {
    // Animation logic
    element.style.transition = 'transform 0.3s';
    element.style.transform = 'scale(1.1)';
  }
}

// BAD: Component using stable animation service
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
  constructor(private animationService: StableAnimationService) {}

  // BAD: Triggering animation that depends on stability
  animate() {
    // BAD: Animation service assumes zone stability
    this.animationService.animateElement(this.animatedElement);
  }

  private get animatedElement(): HTMLElement {
    // Would get the element reference
    return document.querySelector('.animated-component')!;
  }
}

// BAD: Form validation that depends on stability
@Component({
  selector: 'app-stable-validation',
  template: `
    <form (ngSubmit)="onSubmit()">
      <input type="text" [(ngModel)]="inputValue" name="input" />
      <button type="submit">Submit</button>
      <p *ngIf="validationMessage">{{ validationMessage }}</p>
    </form>
  `,
  standalone: false
})
export class StableValidationComponent implements OnInit, OnDestroy {
  inputValue = '';
  validationMessage = '';
  private stableSubscription: any;

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    // BAD: Validation triggered by stability
    this.stableSubscription = this.ngZone.onStable.subscribe(() => {
      this.validateInput(); // BAD: Validation on every stable event
    });
  }

  ngOnDestroy() {
    if (this.stableSubscription) {
      this.stableSubscription.unsubscribe();
    }
  }

  onSubmit() {
    // BAD: Final validation assuming stability
    if (this.ngZone.isStable) {
      this.performSubmit();
    }
  }

  // BAD: Validation method
  private validateInput() {
    if (this.inputValue.length < 3) {
      this.validationMessage = 'Input too short'; // BAD: Direct assignment
    } else {
      this.validationMessage = ''; // BAD: Another direct assignment
    }
  }

  private performSubmit() {
    console.log('Submitting:', this.inputValue);
  }
}

// BAD: Modal service that depends on stability
@Injectable({
  providedIn: 'root'
})
export class StableModalService {
  constructor(private ngZone: NgZone) {}

  // BAD: Opening modal when stable
  openModal(component: any) {
    if (this.ngZone.isStable) {
      // BAD: Assuming safe to open modal
      this.doOpenModal(component);
    } else {
      // BAD: Waiting for stability
      const subscription = this.ngZone.onStable.subscribe(() => {
        subscription.unsubscribe();
        this.doOpenModal(component);
      });
    }
  }

  private doOpenModal(component: any) {
    // Modal opening logic
    console.log('Modal opened');
  }
}

// BAD: Data loading service that depends on stability
@Injectable({
  providedIn: 'root'
})
export class StableDataService {
  private data: any = null;
  private stableSubscription: any;

  constructor(private ngZone: NgZone) {
    // BAD: Loading data when stable
    this.stableSubscription = this.ngZone.onStable.subscribe(() => {
      if (!this.data) {
        this.loadData(); // BAD: Triggering data load on stable
      }
    });
  }

  // BAD: Method that assumes stability for data operations
  saveData(newData: any) {
    if (this.ngZone.isStable) {
      // BAD: Saving assuming stability
      this.data = newData;
      console.log('Data saved when stable');
    }
  }

  getData() {
    return this.data;
  }

  destroy() {
    if (this.stableSubscription) {
      this.stableSubscription.unsubscribe();
    }
  }
}