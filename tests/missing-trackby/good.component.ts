@Component({
  selector: 'app-good',
  template: `
    <div *ngFor="let item of items; trackBy: trackByFn">
      {{ item.name }}
    </div>
  `
})
export class GoodComponent {
  items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ];

  trackByFn(index: number, item: any): number {
    return item.id;
  }
}