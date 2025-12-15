// BAD: Over-selecting in NgRx selectors - selecting more data than needed
import { createSelector, createFeatureSelector } from '@ngrx/store';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  skills: string[];
  experience: number;
  department: string;
  managerId?: number;
  lastLogin: Date;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    language: string;
  };
  statistics: {
    tasksCompleted: number;
    projectsLed: number;
    averageRating: number;
  };
  contactInfo: {
    phone: string;
    address: string;
    emergencyContact: string;
  };
  permissions: string[];
  auditLog: Array<{ action: string; timestamp: Date }>;
}

export interface AppState {
  users: { [id: number]: User };
  ui: {
    selectedUserId: number | null;
    currentUserId: number;
  };
}

// BAD: Selector that selects entire user object when component only needs name
export const selectCurrentUser = createSelector(
  createFeatureSelector<AppState['users']>('users'),
  createFeatureSelector<AppState['ui']>('ui'),
  (users, ui) => {
    console.log('selectCurrentUser: selecting ENTIRE user object');
    return ui.selectedUserId ? users[ui.selectedUserId] : null;
  }
);

// BAD: Component that only displays user name but triggers updates on any user change
@Component({
  selector: 'app-user-name-display',
  template: `<div>{{ (currentUser | async)?.name }}</div>`,
  standalone: true
})
export class UserNameDisplayComponent {
  // BAD: This component only needs user name, but will re-render when ANY user property changes
  currentUser = this.store.select(selectCurrentUser);

  constructor(private store: Store) {}
}

// BAD: Selector that selects all user data when component only needs avatar
export const selectUserAvatar = createSelector(
  createFeatureSelector<AppState['users']>('users'),
  createFeatureSelector<AppState['ui']>('ui'),
  (users, ui) => {
    console.log('selectUserAvatar: selecting entire user for just avatar');
    const user = ui.currentUserId ? users[ui.currentUserId] : null;
    return user?.avatar || null;
  }
);

// BAD: Component that only shows avatar but re-renders on any user change
@Component({
  selector: 'app-user-avatar',
  template: `<img [src]="userAvatar | async" alt="Avatar" />`,
  standalone: true
})
export class UserAvatarComponent {
  // BAD: Over-selecting - component only needs avatar but gets entire user
  userAvatar = this.store.select(selectUserAvatar);

  constructor(private store: Store) {}
}

// BAD: Selector that selects user statistics when component only needs task count
export const selectUserStats = createSelector(
  createFeatureSelector<AppState['users']>('users'),
  createFeatureSelector<AppState['ui']>('ui'),
  (users, ui) => {
    console.log('selectUserStats: selecting all statistics for just task count');
    const user = ui.currentUserId ? users[ui.currentUserId] : null;
    return user?.statistics || null;
  }
);

// BAD: Component that only needs task count but gets all statistics
@Component({
  selector: 'app-task-counter',
  template: `<div>Tasks: {{ (userStats | async)?.tasksCompleted }}</div>`,
  standalone: true
})
export class TaskCounterComponent {
  // BAD: Over-selecting statistics when only tasksCompleted is needed
  userStats = this.store.select(selectUserStats);

  constructor(private store: Store) {}
}

// BAD: Selector that selects entire user list when component only needs count
export const selectAllUsersData = createSelector(
  createFeatureSelector<AppState['users']>('users'),
  (users) => {
    console.log('selectAllUsersData: selecting ALL user data for just counting');
    return Object.values(users);
  }
);

// BAD: Component that only shows count but gets all user data
@Component({
  selector: 'app-user-count',
  template: `<div>Total users: {{ (allUsers | async)?.length }}</div>`,
  standalone: true
})
export class UserCountComponent {
  // BAD: Over-selecting - component gets all user data but only uses length
  allUsers = this.store.select(selectAllUsersData);

  constructor(private store: Store) {}
}

// BAD: Selector that selects user preferences when component only needs theme
export const selectUserPreferences = createSelector(
  createFeatureSelector<AppState['users']>('users'),
  createFeatureSelector<AppState['ui']>('ui'),
  (users, ui) => {
    console.log('selectUserPreferences: selecting all preferences for just theme');
    const user = ui.currentUserId ? users[ui.currentUserId] : null;
    return user?.preferences || null;
  }
);

// BAD: Component that only uses theme but gets all preferences
@Component({
  selector: 'app-theme-display',
  template: `
    <div [class]="(userPrefs | async)?.theme === 'dark' ? 'dark-theme' : 'light-theme'">
      Content
    </div>
  `,
  standalone: true
})
export class ThemeDisplayComponent {
  // BAD: Over-selecting preferences when only theme is needed
  userPrefs = this.store.select(selectUserPreferences);

  constructor(private store: Store) {}
}

// BAD: Complex selector that does filtering in selector instead of component
export const selectFilteredUsers = createSelector(
  createFeatureSelector<AppState['users']>('users'),
  (users) => {
    console.log('selectFilteredUsers: selecting and filtering ALL users');
    return Object.values(users).filter(user =>
      user.department === 'engineering' &&
      user.experience > 3 &&
      user.skills.includes('typescript')
    );
  }
);

// BAD: Component that could filter locally but selector does it
@Component({
  selector: 'app-engineer-list',
  template: `
    <div *ngFor="let user of filteredUsers | async">
      {{ user.name }} ({{ user.experience }} years)
    </div>
  `,
  standalone: true
})
export class EngineerListComponent {
  // BAD: Selector does filtering - component can't control filter criteria
  filteredUsers = this.store.select(selectFilteredUsers);

  constructor(private store: Store) {}
}

// BAD: Selector that selects nested objects when component only needs primitives
export const selectUserContactInfo = createSelector(
  createFeatureSelector<AppState['users']>('users'),
  createFeatureSelector<AppState['ui']>('ui'),
  (users, ui) => {
    console.log('selectUserContactInfo: selecting entire contact object for just phone');
    const user = ui.currentUserId ? users[ui.currentUserId] : null;
    return user?.contactInfo || null;
  }
);

// BAD: Component that only needs phone number but gets entire contact info
@Component({
  selector: 'app-phone-display',
  template: `<div>Phone: {{ (contactInfo | async)?.phone }}</div>`,
  standalone: true
})
export class PhoneDisplayComponent {
  // BAD: Over-selecting contact info when only phone is needed
  contactInfo = this.store.select(selectUserContactInfo);

  constructor(private store: Store) {}
}