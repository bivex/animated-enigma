@Component({
  selector: 'app-address-form',
  template: `
    <input [(ngModel)]="address.street">
  `
})
export class AddressFormComponent {
  @Input() address!: Address;
}

@Component({
  selector: 'app-parent',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-address-form [(address)]="userAddress"></app-address-form>
  `
})
export class ParentComponent {
  userAddress: Address = { street: 'Main St' };
}