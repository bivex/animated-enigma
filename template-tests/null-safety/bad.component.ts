@Component({
  selector: 'app-user-detail',
  template: `
    <div>
      <h1>{{ user.name }}</h1>
      <p>{{ user.profile.bio }}</p>
    </div>
  `
})
export class UserDetailComponent {
  user: User; // Could be undefined initially

  ngOnInit(): void {
    this.userService.getUser(123).subscribe(u => this.user = u);
  }
}