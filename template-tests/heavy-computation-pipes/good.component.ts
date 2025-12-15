@Component({
  selector: 'app-item-list',
  template: `
    <div *ngFor="let item of filteredAndSorted(); trackBy: trackByItemId">
      {{ item.name }}
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemListComponent {
  items = input.required<Item[]>();
  sortBy = input<string>('name');
  filterBy = input<string>('all');

  filteredAndSorted = computed(() => {
    const items = this.items();
    const sort = this.sortBy();
    const filter = this.filterBy();

    return items
      .filter(item => filter === 'all' || item.type === filter)
      .sort((a, b) => a[sort].localeCompare(b[sort]));
  });

  trackByItemId(index: number, item: Item): string {
    return item.id;
  }
}