import { Component } from '@angular/core';

@Component({
  selector: 'app-large-list-without-virtualization-bad',
  template: `
    <div class="large-list-bad">
      <!-- BAD: Large list without virtualization -->
      <!-- This will create 5000 DOM nodes and cause performance issues -->
      <div *ngFor="let item of largeList; trackBy: trackByItem"
           class="list-item">
        <span>{{ item.id }}</span>
        <span>{{ item.name }}</span>
        <span>{{ item.description }}</span>
        <span>{{ item.price | currency }}</span>
      </div>
    </div>
  `,
  styles: [`
    .large-list-bad {
      height: 400px;
      overflow-y: auto;
    }
    .list-item {
      padding: 10px;
      border-bottom: 1px solid #ccc;
      display: flex;
      justify-content: space-between;
    }
  `]
})
export class LargeListWithoutVirtualizationBadComponent {
  // BAD: 5000 items rendered all at once
  largeList = Array.from({ length: 5000 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    description: `This is a description for item ${i + 1}`,
    price: Math.random() * 100
  }));

  trackByItem(index: number, item: any): number {
    return item.id;
  }
}