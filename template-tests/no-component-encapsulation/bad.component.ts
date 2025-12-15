// Parent
@Component({
  selector: 'app-dashboard',
  styles: [`
    .card { background: red; } /* Might override child's blue */
  `]
})
export class DashboardComponent {}

// Child
@Component({
  selector: 'app-card',
  styles: [`
    .card { background: blue; } /* Might be overridden */
  `]
})
export class CardComponent {}