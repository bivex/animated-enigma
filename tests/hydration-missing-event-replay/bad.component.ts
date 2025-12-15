// BAD: Missing event replay anti-patterns
import { Component, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideClientHydration } from '@angular/platform-browser';

// BAD: App component with interactive elements
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
    // BAD: Component initializes but doesn't handle event replay
    console.log('App initialized');
  }

  handleClick() {
    console.log('Button clicked!');
    // BAD: User clicks during hydration gap are lost
  }
}

// BAD: Interactive form component
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
    // BAD: Input changes during hydration gap are lost
    console.log('Input changed:', this.inputValue);
  }

  onSubmit() {
    // BAD: Form submissions during hydration gap are lost
    this.submittedValue = this.inputValue;
    this.submitted = true;
    console.log('Form submitted');
  }
}

// BAD: Click counter component
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
    // BAD: Clicks during hydration gap are lost
    this.count++;
  }

  decrement() {
    this.count--;
  }

  reset() {
    this.count = 0;
  }
}

// BAD: Bootstrap without event replay
bootstrapApplication(AppComponent, {
  providers: [
    // BAD: provideClientHydration without withEventReplay()
    provideClientHydration()
    // BAD: User interactions during hydration are lost
  ]
});

// BAD: Component with complex event handling
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
    // BAD: Mouse events during hydration are lost
    this.mouseEntered = true;
  }

  onMouseLeave() {
    this.mouseEntered = false;
  }

  onDoubleClick() {
    // BAD: Double clicks during hydration are lost
    this.doubleClicked = true;
  }

  onNestedClick() {
    // BAD: Nested element clicks during hydration are lost
    this.nestedClicks++;
  }
}

// BAD: Component with keyboard events
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
    // BAD: Keyboard events during hydration are lost
    this.lastKey = event.key;
  }

  onKeyUp(event: KeyboardEvent) {
    this.keyCount++;
  }
}

// BAD: Component with drag and drop
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
    // BAD: Drag events during hydration are lost
    this.dragged = true;
  }

  onDragEnd() {
    this.dragged = false;
  }

  onDrop() {
    this.dropped = true;
  }

  onDropZoneDrop() {
    // BAD: Drop events during hydration are lost
    console.log('Dropped in zone');
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
}

// BAD: Component with scroll events
@Component({
  selector: 'app-scroll-events',
  template: `
    <div class="scroll-container" (scroll)="onScroll()">
      <div class="content">
        <p>Scroll during hydration to see if events are captured!</p>
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
    // BAD: Scroll events during hydration are lost
    const element = document.querySelector('.scroll-container');
    if (element) {
      this.scrollPosition = element.scrollTop;
    }
  }
}

// BAD: Bootstrap with partial hydration features
bootstrapApplication(AppComponent, {
  providers: [
    // BAD: Only provideClientHydration without event replay
    provideClientHydration()
    // BAD: Missing withEventReplay() - user interactions lost during uncanny valley
  ]
});

// BAD: App with multiple interactive components
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

// Import for bootstrapApplication
import { bootstrapApplication } from '@angular/platform-browser';