import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';

// BAD: Subject misuse patterns
@Injectable({
  providedIn: 'root'
})
export class UserService {
  // BAD: BehaviorSubject with meaningless initial value (null)
  private usersSubject = new BehaviorSubject<any[]>(null);
  public users$ = this.usersSubject.asObservable();

  // BAD: Unbounded ReplaySubject - memory leak
  private eventsSubject = new ReplaySubject<any>();
  public events$ = this.eventsSubject.asObservable();

  // BAD: Exposed subject allows external mutation
  public actionsSubject = new Subject<any>();

  constructor() {
    // BAD: Meaningless initial value
    this.loadUsers();
  }

  // BAD: BehaviorSubject used for event signaling, not state
  notifyUserLogin(user: any) {
    this.usersSubject.next([user]); // Wrong usage pattern
  }

  // BAD: Unbounded replay buffer
  logEvent(event: any) {
    this.eventsSubject.next(event);
    // No buffer size limit - memory leak
  }

  private loadUsers() {
    // Simulate API call
    setTimeout(() => {
      this.usersSubject.next([]);
    }, 1000);
  }
}

// BAD: Component exposing subjects
import { Component } from '@angular/core';

@Component({
  selector: 'app-data-manager',
  template: `
    <div>
      <button (click)="triggerAction()">Trigger Action</button>
    </div>
  `,
  standalone: true
})
export class DataManagerComponent {
  // BAD: Public subject allows external components to push data
  public dataSubject = new Subject<any>();

  // BAD: Exposed BehaviorSubject
  public stateSubject = new BehaviorSubject<any>({});

  triggerAction() {
    this.dataSubject.next({ type: 'ACTION' });
  }

  // BAD: Method that exposes internal subjects
  getDataStream() {
    return this.dataSubject; // Returns mutable subject
  }
}

// BAD: Service with multiple subject anti-patterns
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // BAD: BehaviorSubject with undefined initial value
  private notificationsSubject = new BehaviorSubject<any[]>(undefined);
  public notifications$ = this.notificationsSubject.asObservable();

  // BAD: Large unbounded ReplaySubject
  private historySubject = new ReplaySubject<any>(1000); // Too large buffer
  public history$ = this.historySubject.asObservable();

  // BAD: Public subject for external use
  public configSubject = new Subject<any>();

  addNotification(notification: any) {
    const current = this.notificationsSubject.value || [];
    this.notificationsSubject.next([...current, notification]);
  }

  // BAD: Exposing subject directly
  getConfigSubject() {
    return this.configSubject; // Allows external mutation
  }
}