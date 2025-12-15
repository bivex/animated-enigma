// GOOD: Proper data selection in NgRx selectors - select only what components need
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

// GOOD: Specific selectors for specific needs
export const selectCurrentUserId = createSelector(
  createFeatureSelector<AppState['ui']>('ui'),
  (ui) => ui.selectedUserId
);

export const selectCurrentUserName = createSelector(
  createFeatureSelector<AppState['users']>('users'),
  selectCurrentUserId,
  (users, userId) => {
    console.log('selectCurrentUserName: selecting only user name');
    return userId ? users[userId]?.name || null : null;
  }
);

// GOOD: Component that only selects what it needs
@Component({
  selector: 'app-user-name-display',
  template: `<div>{{ userName | async }}</div>`,
  standalone: true
})
export class UserNameDisplayComponent {
  // GOOD: Only selects user name - won't re-render on other user property changes
  userName = this.store.select(selectCurrentUserName);

  constructor(private store: Store) {}
}

// GOOD: Avatar-only selector
export const selectCurrentUserAvatar = createSelector(
  createFeatureSelector<AppState['users']>('users'),
  createFeatureSelector<AppState['ui']>('ui'),
  (users, ui) => {
    console.log('selectCurrentUserAvatar: selecting only avatar');
    const user = ui.currentUserId ? users[ui.currentUserId] : null;
    return user?.avatar || null;
  }
);

// GOOD: Component that only gets avatar
@Component({
  selector: 'app-user-avatar',
  template: `<img [src]="userAvatar | async" alt="Avatar" />`,
  standalone: true
})
export class UserAvatarComponent {
  // GOOD: Only selects avatar - efficient and targeted
  userAvatar = this.store.select(selectCurrentUserAvatar);

  constructor(private store: Store) {}
}

// GOOD: Task count only selector
export const selectCurrentUserTaskCount = createSelector(
  createFeatureSelector<AppState['users']>('users'),
  createFeatureSelector<AppState['ui']>('ui'),
  (users, ui) => {
    console.log('selectCurrentUserTaskCount: selecting only task count');
    const user = ui.currentUserId ? users[ui.currentUserId] : null;
    return user?.statistics.tasksCompleted || 0;
  }
);

// GOOD: Component that only needs task count
@Component({
  selector: 'app-task-counter',
  template: `<div>Tasks: {{ taskCount | async }}</div>`,
  standalone: true
})
export class TaskCounterComponent {
  // GOOD: Only selects task count - minimal data transfer
  taskCount = this.store.select(selectCurrentUserTaskCount);

  constructor(private store: Store) {}
}

// GOOD: User count selector
export const selectUserCount = createSelector(
  createFeatureSelector<AppState['users']>('users'),
  (users) => {
    console.log('selectUserCount: selecting only count');
    return Object.keys(users).length;
  }
);

// GOOD: Component that only shows count
@Component({
  selector: 'app-user-count',
  template: `<div>Total users: {{ userCount | async }}</div>`,
  standalone: true
})
export class UserCountComponent {
  // GOOD: Only selects count - no unnecessary data transfer
  userCount = this.store.select(selectUserCount);

  constructor(private store: Store) {}
}

// GOOD: Theme-only selector
export const selectCurrentUserTheme = createSelector(
  createFeatureSelector<AppState['users']>('users'),
  createFeatureSelector<AppState['ui']>('ui'),
  (users, ui) => {
    console.log('selectCurrentUserTheme: selecting only theme');
    const user = ui.currentUserId ? users[ui.currentUserId] : null;
    return user?.preferences.theme || 'light';
  }
);

// GOOD: Component that only uses theme
@Component({
  selector: 'app-theme-display',
  template: `
    <div [class]="(userTheme | async) === 'dark' ? 'dark-theme' : 'light-theme'">
      Content
    </div>
  `,
  standalone: true
})
export class ThemeDisplayComponent {
  // GOOD: Only selects theme - targeted selection
  userTheme = this.store.select(selectCurrentUserTheme);

  constructor(private store: Store) {}
}

// GOOD: Flexible filtering - component controls filter criteria
export const selectUsers = createSelector(
  createFeatureSelector<AppState['users']>('users'),
  (users) => Object.values(users)
);

// GOOD: Component does its own filtering
@Component({
  selector: 'app-engineer-list',
  template: `
    <div *ngFor="let user of filteredUsers">
      {{ user.name }} ({{ user.experience }} years)
    </div>
  `,
  standalone: true
})
export class EngineerListComponent {
  // GOOD: Component gets all users and filters locally - flexible and controlled
  users = this.store.select(selectUsers);

  // GOOD: Component controls filtering logic
  filteredUsers = computed(() =>
    this.users().filter(user =>
      user.department === 'engineering' &&
      user.experience > 3 &&
      user.skills.includes('typescript')
    )
  );

  constructor(private store: Store) {}
}

// GOOD: Phone number only selector
export const selectCurrentUserPhone = createSelector(
  createFeatureSelector<AppState['users']>('users'),
  createFeatureSelector<AppState['ui']>('ui'),
  (users, ui) => {
    console.log('selectCurrentUserPhone: selecting only phone number');
    const user = ui.currentUserId ? users[ui.currentUserId] : null;
    return user?.contactInfo.phone || null;
  }
);

// GOOD: Component that only needs phone
@Component({
  selector: 'app-phone-display',
  template: `<div>Phone: {{ phoneNumber | async }}</div>`,
  standalone: true
})
export class PhoneDisplayComponent {
  // GOOD: Only selects phone number - minimal and efficient
  phoneNumber = this.store.select(selectCurrentUserPhone);

  constructor(private store: Store) {}
}

// GOOD: Multiple specific selectors for different component needs
export const selectUserBasicInfo = createSelector(
  createFeatureSelector<AppState['users']>('users'),
  createFeatureSelector<AppState['ui']>('ui'),
  (users, ui) => {
    console.log('selectUserBasicInfo: selecting only basic info');
    const user = ui.currentUserId ? users[ui.currentUserId] : null;
    return user ? {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar
    } : null;
  }
);

export const selectUserWorkInfo = createSelector(
  createFeatureSelector<AppState['users']>('users'),
  createFeatureSelector<AppState['ui']>('ui'),
  (users, ui) => {
    console.log('selectUserWorkInfo: selecting only work-related info');
    const user = ui.currentUserId ? users[ui.currentUserId] : null;
    return user ? {
      department: user.department,
      experience: user.experience,
      skills: user.skills,
      managerId: user.managerId
    } : null;
  }
);

// GOOD: Profile component uses multiple specific selectors
@Component({
  selector: 'app-user-profile',
  template: `
    <div class="profile">
      <!-- Uses basic info selector -->
      <div *ngIf="basicInfo | async as info">
        <img [src]="info.avatar" alt="Avatar" />
        <h2>{{ info.name }}</h2>
        <p>{{ info.email }}</p>
      </div>

      <!-- Uses work info selector -->
      <div *ngIf="workInfo | async as work">
        <p>Department: {{ work.department }}</p>
        <p>Experience: {{ work.experience }} years</p>
        <p>Skills: {{ work.skills.join(', ') }}</p>
      </div>
    </div>
  `,
  standalone: true
})
export class UserProfileComponent {
  // GOOD: Separate selectors for different concerns - each component only gets what it needs
  basicInfo = this.store.select(selectUserBasicInfo);
  workInfo = this.store.select(selectUserWorkInfo);

  constructor(private store: Store) {}
}