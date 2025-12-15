// Good: Focused selectors that return only needed data
export const selectUserNames = createSelector(
  selectUsers,
  users => users.map(u => u.name) // Only names, not full objects
);

export const selectActiveUserCount = createSelector(
  selectUsers,
  users => users.filter(u => u.active).length // Only count
);

// Properly memoized computation
export const selectActiveUserNameLength = createSelector(
  selectActiveUsers,
  activeUsers => activeUsers.reduce((acc, user) => acc + user.name.length, 0)
);

export const selectActiveUsers = createSelector(
  selectUsers,
  users => users.filter(u => u.active) // Separate memoized selector
);