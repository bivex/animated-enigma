@Component({
  selector: 'app-large-list',
  imports: [ScrollingModule, NgFor],
  template: `
    <cdk-virtual-scroll-viewport itemSize="50" class="viewport">
      <div *cdkVirtualFor="let item of items; trackBy: trackByItemId" class="item">
        {{ item.name }} - {{ item.description }}
      </div>
    </cdk-virtual-scroll-viewport>
  `,
  styles: [`
    .viewport {
      height: 600px;
    }
    .item {
      height: 50px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LargeListComponent {
  @Input() items: Item[] = [];

  trackByItemId(index: number, item: Item): string {
    return item.id;
  }
}