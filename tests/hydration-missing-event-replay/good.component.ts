// GOOD: Proper event replay implementation
import { Component, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

// GOOD: App component with interactive elements
@Component({
  selector: 'app-root',
  template: `
    <div class="app">
      <header>
        <h1>My App</h1>
        <button (click)="handleClick()">Click me during hydration!</button>
      </header>

      <main>
        <app-interactive-form></app-interactive-form>
        <app-click-counter></app-click-counter>
      </main>
    </div>
  `,
  standalone: false
})
export class AppComponent implements OnInit {
  ngOnInit() {
    // GOOD: Component initializes with event replay protection
    console.log('App initialized with event replay');
  }

  handleClick() {
    console.log('Button clicked!');
    // GOOD: User clicks during hydration gap are replayed
  }
}

// GOOD: Interactive form component
@Component({
  selector: 'app-interactive-form',
  template: `
    <form (ngSubmit)="onSubmit()">
      <input
        type="text"
        [(ngModel)]="inputValue"
        (input)="onInputChange()"
        placeholder="Type something during hydration..."
      >
      <button type="submit">Submit</button>
    </form>
    <p *ngIf="submitted">Submitted: {{ submittedValue }}</p>
  `,
  standalone: false
})
export class InteractiveFormComponent {
  inputValue = '';
  submittedValue = '';
  submitted = false;

  onInputChange() {
    // GOOD: Input changes during hydration gap are replayed
    console.log('Input changed:', this.inputValue);
  }

  onSubmit() {
    // GOOD: Form submissions during hydration gap are replayed
    this.submittedValue = this.inputValue;
    this.submitted = true;
    console.log('Form submitted');
  }
}

// GOOD: Click counter component
@Component({
  selector: 'app-click-counter',
  template: `
    <div class="counter">
      <h3>Click Counter</h3>
      <p>Count: {{ count }}</p>
      <button (click)="increment()">Increment</button>
      <button (click)="decrement()">Decrement</button>
      <button (click)="reset()">Reset</button>
    </div>
  `,
  standalone: false
})
export class ClickCounterComponent {
  count = 0;

  increment() {
    // GOOD: Clicks during hydration gap are replayed
    this.count++;
  }

  decrement() {
    this.count--;
  }

  reset() {
    this.count = 0;
  }
}

// GOOD: Bootstrap with event replay enabled
bootstrapApplication(AppComponent, {
  providers: [
    // GOOD: provideClientHydration with withEventReplay()
    provideClientHydration(withEventReplay())
    // GOOD: User interactions during hydration are captured and replayed
  ]
});

// GOOD: Component with complex event handling
@Component({
  selector: 'app-complex-events',
  template: `
    <div class="complex-events"
         (mouseenter)="onMouseEnter()"
         (mouseleave)="onMouseLeave()"
         (dblclick)="onDoubleClick()">
      <p>Hover and interact during hydration!</p>
      <div class="nested-element" (click)="onNestedClick()">
        Nested clickable element
      </div>
    </div>
  `,
  standalone: false
})
export class ComplexEventsComponent {
  mouseEntered = false;
  doubleClicked = false;
  nestedClicks = 0;

  onMouseEnter() {
    // GOOD: Mouse events during hydration are replayed
    this.mouseEntered = true;
  }

  onMouseLeave() {
    this.mouseEntered = false;
  }

  onDoubleClick() {
    // GOOD: Double clicks during hydration are replayed
    this.doubleClicked = true;
  }

  onNestedClick() {
    // GOOD: Nested element clicks during hydration are replayed
    this.nestedClicks++;
  }
}

// GOOD: Component with keyboard events
@Component({
  selector: 'app-keyboard-events',
  template: `
    <div class="keyboard-events">
      <input
        type="text"
        (keydown)="onKeyDown($event)"
        (keyup)="onKeyUp($event)"
        placeholder="Type and use keyboard during hydration..."
      >
      <p>Last key pressed: {{ lastKey }}</p>
      <p>Keys pressed count: {{ keyCount }}</p>
    </div>
  `,
  standalone: false
})
export class KeyboardEventsComponent {
  lastKey = '';
  keyCount = 0;

  onKeyDown(event: KeyboardEvent) {
    // GOOD: Keyboard events during hydration are replayed
    this.lastKey = event.key;
  }

  onKeyUp(event: KeyboardEvent) {
    this.keyCount++;
  }
}

// GOOD: Component with drag and drop
@Component({
  selector: 'app-drag-drop',
  template: `
    <div class="drag-drop">
      <div
        class="draggable"
        draggable="true"
        (dragstart)="onDragStart()"
        (dragend)="onDragEnd()"
        (drop)="onDrop()"
        (dragover)="onDragOver($event)">
        Drag me during hydration!
      </div>
      <div class="drop-zone" (drop)="onDropZoneDrop()" (dragover)="onDragOver($event)">
        Drop zone
      </div>
      <p>Dragged: {{ dragged }}</p>
      <p>Dropped: {{ dropped }}</p>
    </div>
  `,
  standalone: false
})
export class DragDropComponent {
  dragged = false;
  dropped = false;

  onDragStart() {
    // GOOD: Drag events during hydration are replayed
    this.dragged = true;
  }

  onDragEnd() {
    this.dragged = false;
  }

  onDrop() {
    this.dropped = true;
  }

  onDropZoneDrop() {
    // GOOD: Drop events during hydration are replayed
    console.log('Dropped in zone');
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
}

// GOOD: Component with scroll events
@Component({
  selector: 'app-scroll-events',
  template: `
    <div class="scroll-container" (scroll)="onScroll()">
      <div class="content">
        <p>Scroll during hydration - events will be replayed!</p>
        <div *ngFor="let item of items">{{ item }}</div>
      </div>
      <p>Scroll position: {{ scrollPosition }}</p>
    </div>
  `,
  standalone: false
})
export class ScrollEventsComponent {
  scrollPosition = 0;
  items = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);

  onScroll() {
    // GOOD: Scroll events during hydration are replayed
    const element = document.querySelector('.scroll-container');
    if (element) {
      this.scrollPosition = element.scrollTop;
    }
  }
}

// GOOD: App with multiple interactive components
@Component({
  selector: 'app-interactive-app',
  template: `
    <div class="interactive-app">
      <app-interactive-form></app-interactive-form>
      <app-click-counter></app-click-counter>
      <app-complex-events></app-complex-events>
      <app-keyboard-events></app-keyboard-events>
      <app-drag-drop></app-drag-drop>
      <app-scroll-events></app-scroll-events>
    </div>
  `,
  standalone: false
})
export class InteractiveAppComponent {}

// GOOD: Component with form validation and event replay
@Component({
  selector: 'app-validated-form',
  template: `
    <form (ngSubmit)="onSubmit()" #form="ngForm">
      <div class="form-group">
        <input
          type="email"
          [(ngModel)]="email"
          (input)="onEmailInput()"
          required
          email
          name="email"
          placeholder="Enter email during hydration..."
        >
        <div *ngIf="email && !isValidEmail(email)" class="error">
          Invalid email format
        </div>
      </div>
      <button type="submit" [disabled]="!form.valid">Submit</button>
    </form>
    <p *ngIf="submitted">Email submitted: {{ submittedEmail }}</p>
  `,
  standalone: false
})
export class ValidatedFormComponent {
  email = '';
  submittedEmail = '';
  submitted = false;

  onEmailInput() {
    // GOOD: Input validation during hydration works with event replay
    console.log('Email input:', this.email);
  }

  onSubmit() {
    // GOOD: Form submission during hydration is replayed
    if (this.isValidEmail(this.email)) {
      this.submittedEmail = this.email;
      this.submitted = true;
    }
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// GOOD: Bootstrap with additional hydration features
bootstrapApplication(AppComponent, {
  providers: [
    // GOOD: Full hydration with event replay
    provideClientHydration(withEventReplay())
    // GOOD: All user interactions during the uncanny valley are preserved
  ]
});