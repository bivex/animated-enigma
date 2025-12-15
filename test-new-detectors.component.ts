@Component({
  selector: 'app-test',
  template: `
    <!-- CSS hiding instead of *ngIf -->
    <div [hidden]="!showContent">Hidden content</div>

    <!-- Object creation in template -->
    <div [style]="{color: 'red', fontSize: getFontSize()}">Styled content</div>

    <!-- Multiple ngModel bindings -->
    <input [(ngModel)]="user.name">
    <input [(ngModel)]="user.email">
    <input [(ngModel)]="user.address.street">
    <input [(ngModel)]="user.address.city">
    <input [(ngModel)]="user.phone">
    <input [(ngModel)]="user.company.name">
    <input [(ngModel)]="user.settings.theme">
  `
})
export class TestComponent {
  showContent = false;
  user = { name: '', email: '', phone: '', company: { name: '' }, address: { street: '', city: '' }, settings: { theme: '' } };

  getFontSize() {
    return '14px';
  }
}