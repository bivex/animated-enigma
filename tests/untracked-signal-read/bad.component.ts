@Component({
  selector: 'app-bad',
  template: '<div>{{ count() }}</div>'
})
export class BadComponent {
  private count = signal(0);

  constructor() {
    effect(() => {
      // Bad: reading signal inside effect without untracked()
      const currentCount = this.count();
      console.log('Count changed:', currentCount);
    });
  }
}