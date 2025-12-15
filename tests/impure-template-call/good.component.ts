import { Component, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-impure-template-call-good',
  template: `
    <div>
      <!-- GOOD: Use signals and computed values instead of method calls -->
      <p>{{ userName() }}</p>
      <p>{{ total() }}</p>
      <p>{{ currentDate | date:'short' }}</p>
      <p *ngFor="let item of items; trackBy: trackByItem">{{ item.displayName }}</p>
    </div>
  `,
  providers: [DatePipe]
})
export class ImpureTemplateCallGoodComponent {
  private datePipe = new DatePipe('en-US');

  // GOOD: Signals for reactive state
  items = signal([
    { id: 1, firstName: 'John', lastName: 'Doe', price: 100 },
    { id: 2, firstName: 'Jane', lastName: 'Smith', price: 200 }
  ]);

  userName = signal('John Doe');
  currentDate = new Date();

  // GOOD: Computed values are cached and only recalculated when dependencies change
  total = computed(() => {
    console.log('total recalculated'); // Only called when items change
    return this.items().reduce((sum, item) => sum + item.price, 0);
  });

  // GOOD: Pre-compute display names during initialization
  ngOnInit() {
    this.items.update(items =>
      items.map(item => ({
        ...item,
        displayName: `${item.firstName} ${item.lastName}`
      }))
    );
  }

  // GOOD: trackBy function for efficient list updates
  trackByItem(index: number, item: any): number {
    return item.id;
  }
}