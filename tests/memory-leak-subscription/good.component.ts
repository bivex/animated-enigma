@Component({
  selector: 'app-good',
  template: '<div>{{ data$ | async }}</div>'
})
export class GoodComponent implements OnInit, OnDestroy {
  data$ = this.dataService.getData();
  private destroy$ = new Subject<void>();

  constructor(private dataService: DataService) {}

  ngOnInit() {
    // Good: using takeUntil pattern
    this.dataService.getOtherData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(other => {
        console.log(other);
      });
  }

  ngOnDestroy() {
    // Good: proper cleanup
    this.destroy$.next();
    this.destroy$.complete();
  }
}