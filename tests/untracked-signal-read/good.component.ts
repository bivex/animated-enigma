@Component({
  selector: 'app-good',
  template: '<div>{{ count() }}</div>'
})
export class GoodComponent {
  private count = signal(0);

  constructor() {
    effect(() => {
      // Good: using untracked() for read-only access
      untracked(() => {
        const currentCount = this.count();
        console.log('Count changed:', currentCount);
      });
    });
  }
}