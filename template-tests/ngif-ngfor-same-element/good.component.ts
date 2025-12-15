@Component({
  selector: 'app-item-list',
  template: `
    <ul *ngIf="items.length > 0">
      <li *ngFor="let item of items; trackBy: trackByItemId">
        {{ item.name }}
      </li>
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemListComponent {
  @Input() items: Item[] = [];

  trackByItemId(index: number, item: Item): string {
    return item.id;
  }
}