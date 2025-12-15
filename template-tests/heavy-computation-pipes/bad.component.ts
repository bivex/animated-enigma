@Component({
  selector: 'app-item-list',
  template: `
    <div>{{ items | sortAndFilter: sortField: filterField }}</div>
  `
})
export class ItemListComponent {
  @Input() items: Item[] = [];
  sortField = 'name';
  filterField = 'active';
}