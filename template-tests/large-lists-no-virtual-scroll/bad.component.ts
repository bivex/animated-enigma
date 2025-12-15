@Component({
  selector: 'app-large-list',
  template: `
    <div class="items-container">
      <!-- All 10,000 items rendered; only ~20 visible in viewport -->
      <div *ngFor="let item of items" class="item">
        {{ item.name }} - {{ item.description }}
      </div>
    </div>
  `
})
export class LargeListComponent {
  @Input() items: Item[] = []; // Could be 10,000+ items
}