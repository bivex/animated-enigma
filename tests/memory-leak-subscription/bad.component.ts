@Component({
  selector: 'app-bad',
  template: '<div>{{ data }}</div>'
})
export class BadComponent implements OnInit {
  data: string = '';
  private subscription: Subscription;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    // Bad: subscription not cleaned up
    this.subscription = this.dataService.getData()
      .subscribe(data => {
        this.data = data;
      });

    // Bad: unassigned subscription
    this.dataService.getOtherData()
      .subscribe(other => {
        console.log(other);
      });
  }

  // Missing ngOnDestroy!
}