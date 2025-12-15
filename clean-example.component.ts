import { Component, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-clean-example',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    <div>{{ total() }}</div>
    <cdk-virtual-scroll-viewport itemSize="50" class="viewport">
      <div *ngFor="let item of items$ | async; trackBy: trackByFn">
        {{ item.name }}
      </div>
    </cdk-virtual-scroll-viewport>
  `,
  providers: [] // Clean - HttpClient not duplicated
})
export class CleanExampleComponent {
  private http = inject(HttpClient);

  // Signals for reactive state
  counter = signal(0);
  readonly total = computed(() => this.counter() * 2);

  // Proper observable handling
  items$ = this.http.get('/api/items').pipe(
    switchMap(items => this.processItems(items))
  );

  constructor() {
    // No direct subscriptions in constructor
  }

  trackByFn(index: number, item: any): number {
    return item.id;
  }

  private processItems(items: any[]) {
    return items; // Proper method separation
  }
}