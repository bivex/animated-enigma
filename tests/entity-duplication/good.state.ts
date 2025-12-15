// Good: Normalized state without duplication
export interface GoodState {
  // Single source of truth
  users: User[];
  selectedUserId: string | null; // Only reference, no duplication
}

export const initialGoodState: GoodState = {
  users: [],
  selectedUserId: null
};

// Derived data computed via selectors
export const selectTotalUsers = createSelector(
  selectUsers,
  users => users.length
);

export const selectSelectedUser = createSelector(
  selectUsers,
  selectSelectedUserId,
  (users, selectedId) => users.find(u => u.id === selectedId)
);