// Bad: Broad selectors that return too much data
export const selectEntireState = createSelector(
  (state: AppState) => state,
  (state) => state // Returns entire state - too broad!
);

export const selectAllUsersData = createSelector(
  selectUsers,
  selectUserEntities,
  selectSelectedUser,
  (users, entities, selected) => ({
    users,      // All users
    entities,   // All entities
    selected    // Selected user
  }) // Returns too much data
);

export const selectComputedWithoutMemo = createSelector(
  selectUsers,
  users => users
    .filter(u => u.active)
    .map(u => u.name)
    .reduce((acc, name) => acc + name.length, 0) // Computation not memoized
);