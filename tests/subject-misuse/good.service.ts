import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject, Observable } from 'rxjs';

// GOOD: Proper Subject usage patterns
@Injectable({
  providedIn: 'root'
})
export class UserService {
  // GOOD: BehaviorSubject with meaningful initial value
  private usersSubject = new BehaviorSubject<any[]>([]);
  public users$ = this.usersSubject.asObservable();

  // GOOD: Bounded ReplaySubject with reasonable buffer size
  private eventsSubject = new ReplaySubject<any>(10);
  public events$ = this.eventsSubject.asObservable();

  // GOOD: Private subject, only expose observable
  private actionsSubject = new Subject<any>();
  public actions$ = this.actionsSubject.asObservable();

  constructor() {
    this.loadUsers();
  }

  // GOOD: BehaviorSubject used correctly for state management
  setUsers(users: any[]) {
    this.usersSubject.next(users);
  }

  // GOOD: Proper event logging with bounded buffer
  logEvent(event: any) {
    this.eventsSubject.next(event);
  }

  // GOOD: Method that triggers actions without exposing subject
  triggerAction(action: any) {
    this.actionsSubject.next(action);
  }

  private loadUsers() {
    // Simulate API call
    setTimeout(() => {
      this.usersSubject.next([]);
    }, 1000);
  }
}

// GOOD: Component that doesn't expose subjects
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
  // GOOD: Private subjects, only expose observables
  private dataSubject = new Subject<any>();
  public data$ = this.dataSubject.asObservable();

  private stateSubject = new BehaviorSubject<any>({});
  public state$ = this.stateSubject.asObservable();

  triggerAction() {
    this.dataSubject.next({ type: 'ACTION' });
  }

  // GOOD: Return observable, not subject
  getDataStream(): Observable<any> {
    return this.data$;
  }

  // GOOD: Method to update state safely
  updateState(newState: any) {
    this.stateSubject.next({ ...this.stateSubject.value, ...newState });
  }
}

// GOOD: Service with proper subject encapsulation
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // GOOD: BehaviorSubject with proper initial value
  private notificationsSubject = new BehaviorSubject<any[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  // GOOD: Reasonably sized ReplaySubject
  private historySubject = new ReplaySubject<any>(50);
  public history$ = this.historySubject.asObservable();

  // GOOD: Private subject, expose methods to interact with it
  private configSubject = new Subject<any>();
  public config$ = this.configSubject.asObservable();

  addNotification(notification: any) {
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([...current, notification]);
  }

  // GOOD: Method to emit config changes
  updateConfig(config: any) {
    this.configSubject.next(config);
  }

  // GOOD: Return observable, not subject
  getConfigStream(): Observable<any> {
    return this.config$;
  }
}