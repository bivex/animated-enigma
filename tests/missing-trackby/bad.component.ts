@Component({
  selector: 'app-bad',
  template: `
    <div *ngFor="let item of items">
      {{ item.name }}
    </div>
  `
})
export class BadComponent {
  items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ];
}