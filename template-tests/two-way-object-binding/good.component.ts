@Component({
  selector: 'app-address-form',
  template: `
    <input
      [value]="address.street"
      (change)="onStreetChange($event.target.value)">
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressFormComponent {
  @Input() address!: Address;
  @Output() addressChange = new EventEmitter<Address>();

  onStreetChange(street: string): void {
    const updated = { ...this.address, street };
    this.addressChange.emit(updated);
  }
}

@Component({
  selector: 'app-parent',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-address-form
      [address]="userAddress"
      (addressChange)="onAddressChange($event)">
    </app-address-form>
  `
})
export class ParentComponent {
  userAddress: Address = { street: 'Main St' };

  onAddressChange(updated: Address): void {
    this.userAddress = updated;
  }
}