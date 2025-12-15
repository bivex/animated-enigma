import { createReducer, on } from '@ngrx/store';
import { addUser, updateUser, deleteUser, loadUsersSuccess } from './user.actions';

// GOOD: Immutable state updates in NgRx reducers
export interface UserState {
  users: any[];
  loading: boolean;
  selectedUser: any;
}

export const initialState: UserState = {
  users: [],
  loading: false,
  selectedUser: null
};

// GOOD: Pure reducer with immutable state updates
export const userReducer = createReducer(
  initialState,

  // GOOD: Immutable array update using spread operator
  on(addUser, (state, { user }) => ({
    ...state,
    users: [...state.users, user] // Creates new array
  })),

  // GOOD: Immutable update using map
  on(updateUser, (state, { user }) => ({
    ...state,
    users: state.users.map(u =>
      u.id === user.id ? { ...u, ...user } : u // Creates new user object
    )
  })),

  // GOOD: Immutable array filtering
  on(deleteUser, (state, { userId }) => ({
    ...state,
    users: state.users.filter(u => u.id !== userId) // Creates new array
  })),

  // GOOD: Immutable state update
  on(loadUsersSuccess, (state, { users }) => ({
    ...state,
    users: [...users], // Creates new array
    loading: false
  }))
);

// GOOD: Complex nested immutable updates
export interface AppState {
  user: {
    profile: {
      name: string;
      preferences: {
        theme: string;
        notifications: boolean;
      };
    };
    settings: any[];
  };
}

export const appInitialState: AppState = {
  user: {
    profile: {
      name: '',
      preferences: {
        theme: 'light',
        notifications: true
      }
    },
    settings: []
  }
};

export const appReducer = createReducer(
  appInitialState,

  // GOOD: Deep immutable update
  on(updateUserProfile, (state, { profile }) => ({
    ...state,
    user: {
      ...state.user,
      profile: {
        ...state.user.profile,
        ...profile,
        preferences: {
          ...state.user.profile.preferences,
          ...profile.preferences
        }
      }
    }
  })),

  // GOOD: Immutable array addition
  on(addUserSetting, (state, { setting }) => ({
    ...state,
    user: {
      ...state.user,
      settings: [...state.user.settings, setting]
    }
  })),

  // GOOD: Complex immutable operations
  on(updateNotificationSettings, (state, { enabled }) => ({
    ...state,
    user: {
      ...state.user,
      profile: {
        ...state.user.profile,
        preferences: {
          ...state.user.profile.preferences,
          notifications: enabled
        }
      },
      settings: enabled
        ? state.user.settings
        : state.user.settings.filter(s => s.type !== 'notification')
    }
  }))
);

// Action creators for the examples
import { createAction, props } from '@ngrx/store';

export const updateUserProfile = createAction(
  '[User] Update Profile',
  props<{ profile: any }>()
);

export const addUserSetting = createAction(
  '[User] Add Setting',
  props<{ setting: any }>()
);

export const updateNotificationSettings = createAction(
  '[User] Update Notification Settings',
  props<{ enabled: boolean }>()
);

// GOOD: Utility functions for complex immutable updates
export class StateUtils {
  static updateUser(state: UserState, userId: number, updates: Partial<any>): UserState {
    return {
      ...state,
      users: state.users.map(user =>
        user.id === userId ? { ...user, ...updates } : user
      )
    };
  }

  static addItemToArray<T>(array: T[], item: T): T[] {
    return [...array, item];
  }

  static updateNestedProperty<T>(
    obj: T,
    path: string[],
    value: any
  ): T {
    if (path.length === 0) return value;
    const [head, ...tail] = path;
    return {
      ...obj,
      [head]: tail.length === 0
        ? value
        : this.updateNestedProperty((obj as any)[head], tail, value)
    };
  }
}