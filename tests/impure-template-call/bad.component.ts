import { Component } from '@angular/core';

@Component({
  selector: 'app-impure-template-call-bad',
  template: `
    <div>
      <!-- BAD: Function calls in template cause re-execution on every change detection -->
      <p>{{ getUserName() }}</p>
      <p>{{ calculateTotal(items) }}</p>
      <p>{{ formatDate(new Date()) }}</p>
      <p *ngFor="let item of items">{{ getItemDisplayName(item) }}</p>
    </div>
  `
})
export class ImpureTemplateCallBadComponent {
  items = [
    { id: 1, firstName: 'John', lastName: 'Doe', price: 100 },
    { id: 2, firstName: 'Jane', lastName: 'Smith', price: 200 }
  ];

  // BAD: These methods are called on every change detection cycle
  getUserName(): string {
    console.log('getUserName called'); // This will spam the console
    return 'John Doe';
  }

  calculateTotal(items: any[]): number {
    console.log('calculateTotal called'); // Expensive operation called repeatedly
    return items.reduce((sum, item) => sum + item.price, 0);
  }

  formatDate(date: Date): string {
    console.log('formatDate called'); // Called on every tick
    return date.toLocaleDateString();
  }

  getItemDisplayName(item: any): string {
    console.log('getItemDisplayName called for', item.id); // Called for each item on every tick
    return `${item.firstName} ${item.lastName}`;
  }
}