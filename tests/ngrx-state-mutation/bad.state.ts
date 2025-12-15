import { createReducer, on } from '@ngrx/store';
import { addUser, updateUser, deleteUser, loadUsersSuccess } from './user.actions';

// BAD: Mutable state modifications in NgRx reducers
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

// BAD: Reducer that mutates state directly
export const userReducer = createReducer(
  initialState,

  // BAD: Direct mutation of state.users array
  on(addUser, (state, { user }) => {
    state.users.push(user); // MUTATION - breaks time travel debugging
    return state; // Returns same object reference
  }),

  // BAD: Direct property assignment
  on(updateUser, (state, { user }) => {
    const index = state.users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      state.users[index] = user; // MUTATION - replaces object in array
    }
    return state;
  }),

  // BAD: Direct array splice
  on(deleteUser, (state, { userId }) => {
    const index = state.users.findIndex(u => u.id === userId);
    if (index !== -1) {
      state.users.splice(index, 1); // MUTATION - modifies array in place
    }
    return state;
  }),

  // BAD: Direct property mutation
  on(loadUsersSuccess, (state, { users }) => {
    state.users = users; // MUTATION - direct assignment
    state.loading = false; // MUTATION - direct assignment
    return state;
  })
);

// BAD: Complex nested state mutations
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

  // BAD: Deep object mutation
  on(updateUserProfile, (state, { profile }) => {
    state.user.profile.name = profile.name; // Deep mutation
    state.user.profile.preferences.theme = profile.preferences.theme; // Deep mutation
    return state;
  }),

  // BAD: Array mutation in nested object
  on(addUserSetting, (state, { setting }) => {
    state.user.settings.push(setting); // Nested array mutation
    return state;
  }),

  // BAD: Complex nested mutations
  on(updateNotificationSettings, (state, { enabled }) => {
    // Multiple mutations in one action
    state.user.profile.preferences.notifications = enabled;
    if (!enabled) {
      // Even more mutations
      state.user.settings = state.user.settings.filter(s => s.type !== 'notification');
    }
    return state;
  })
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