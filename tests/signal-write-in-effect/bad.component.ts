import { Component, signal, effect } from '@angular/core';

@Component({
  selector: 'app-signal-write-in-effect-bad',
  template: `
    <div>
      <p>Counter: {{ counter() }}</p>
      <button (click)="increment()">Increment</button>
    </div>
  `
})
export class SignalWriteInEffectBadComponent {
  counter = signal(0);

  constructor() {
    // BAD: Writing to signal inside effect creates infinite loops
    effect(() => {
      console.log('Counter changed:', this.counter());
      // This causes infinite loop!
      this.counter.set(this.counter() + 1);
    });
  }

  increment() {
    this.counter.update(c => c + 1);
  }
}