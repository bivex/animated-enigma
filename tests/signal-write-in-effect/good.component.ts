import { Component, signal, computed, effect } from '@angular/core';

@Component({
  selector: 'app-signal-write-in-effect-good',
  template: `
    <div>
      <p>Counter: {{ counter() }}</p>
      <p>Doubled: {{ doubled() }}</p>
      <button (click)="increment()">Increment</button>
    </div>
  `
})
export class SignalWriteInEffectGoodComponent {
  counter = signal(0);

  // GOOD: Use computed for derived state
  doubled = computed(() => {
    console.log('Computing doubled value');
    return this.counter() * 2;
  });

  constructor() {
    // GOOD: Only read signals in effects, don't write
    effect(() => {
      console.log('Counter changed:', this.counter());
      console.log('Doubled value:', this.doubled());
      // No signal writes here!
    });
  }

  increment() {
    this.counter.update(c => c + 1);
  }
}