import { Component, signal, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-test-example',
  template: `
    <div>{{ getDisplayName() }}</div>
    <div *ngFor="let item of items">
      {{ item.name }}
    </div>
    <div [innerHTML]="userContent"></div>
    <div>{{ Math.random() }}</div>
  `,
  providers: [HttpClient] // PROVIDER_POLLUTION - HttpClient is root-provided
})
export class TestExampleComponent {
  private http = inject(HttpClient);

  // Signals
  counter = signal(0);

  // Effect with signal write (SIGNAL_WRITE_IN_EFFECT)
  effectRef = effect(() => {
    console.log('Counter changed:', this.counter());
    this.counter.set(5); // This creates infinite loop potential
  });

  // Large list without virtualization (LARGE_LIST_WITHOUT_VIRTUALIZATION)
  items = Array.from({length: 1500}, (_, i) => ({id: i, name: `Item ${i}`}));

  // Impure template call (IMPURE_TEMPLATE_CALL)
  getDisplayName() {
    return 'Test User';
  }

  // Unsafe innerHTML (template security issue)
  userContent = '<script>alert("xss")</script>';

  // Nested subscriptions (NESTED_SUBSCRIPTION_HELL)
  ngOnInit() {
    this.http.get('/api/data').subscribe(data => {
      this.http.get('/api/more-data').subscribe(moreData => {
        console.log('Nested subscription');
      });
    });
  }
}