@Component({
  selector: 'app-card',
  template: '<div class="card">{{ content }}</div>',
  styles: [`
    .card {
      background: blue;
      padding: 1rem;
    }
  `],
  encapsulation: ViewEncapsulation.Emulated // Default; good for most cases
})
export class CardComponent {
  @Input() content: string = '';
}