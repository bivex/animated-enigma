import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-list',
  template: `
    <div class="user-list">
      <div *ngFor="let user of users; trackBy: trackByUser"
           class="user-item"
           (click)="userSelected.emit(user)">
        {{ user.name }} ({{ user.email }})
      </div>
    </div>
  `
})
export class UserListComponent {
  @Input() users: any[] = [];
  @Output() userSelected = new EventEmitter<any>();

  trackByUser(index: number, user: any): number {
    return user.id;
  }
}