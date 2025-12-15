import { Component } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-large-list-without-virtualization-good',
  standalone: true,
  imports: [ScrollingModule],
  template: `
    <div class="large-list-good">
      <!-- GOOD: Large list with virtualization -->
      <!-- Only visible items are rendered in DOM -->
      <cdk-virtual-scroll-viewport itemSize="50" class="viewport">
        <div *cdkVirtualFor="let item of largeList; trackBy: trackByItem"
             class="list-item">
          <span>{{ item.id }}</span>
          <span>{{ item.name }}</span>
          <span>{{ item.description }}</span>
          <span>{{ item.price | currency }}</span>
        </div>
      </cdk-virtual-scroll-viewport>
    </div>
  `,
  styles: [`
    .large-list-good {
      height: 400px;
    }
    .viewport {
      height: 100%;
    }
    .list-item {
      padding: 10px;
      border-bottom: 1px solid #ccc;
      display: flex;
      justify-content: space-between;
    }
  `]
})
export class LargeListWithoutVirtualizationGoodComponent {
  // GOOD: Same large dataset but with virtualization
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