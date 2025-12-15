// Bad: Entity duplication in NgRx state
export interface BadState {
  // Duplicate storage - same user data stored in multiple ways
  users: User[];
  selectedUser: User; // Full object duplication
  userIds: string[]; // IDs duplication
  totalUsers: number; // Derived data duplication
}

export const initialBadState: BadState = {
  users: [],
  selectedUser: null,
  userIds: [],
  totalUsers: 0
};