@Component({
  selector: 'app-test',
  template: `
    <div [hidden]="!showContent">Hidden content</div>
    <div [style]="{'color': 'red'}">Styled content</div>
    <input [(ngModel)]="user.name">
    <input [(ngModel)]="user.email">
    <input [(ngModel)]="user.address.street">
    <input [(ngModel)]="user.address.city">
    <input [(ngModel)]="user.phone">
  `
})
export class TestComponent {
  showContent = false;
  user = { name: '', email: '', phone: '', address: { street: '', city: '' } };
}