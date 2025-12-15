@Component({
  selector: 'app-item-list',
  template: `
    <ul>
      <li *ngIf="items.length > 0" *ngFor="let item of items">
        {{ item.name }}
      </li>
    </ul>
  `
})
export class ItemListComponent {
  @Input() items: Item[] = [];
}