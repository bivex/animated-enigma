// BAD: Missing memoization in NgRx selectors - expensive computations on every call
import { createSelector, createFeatureSelector } from '@ngrx/store';

export interface User {
  id: number;
  name: string;
  email: string;
  skills: string[];
  projects: Array<{ id: number; name: string; hours: number }>;
}

export interface AppState {
  users: { [id: number]: User };
  projects: { [id: number]: any };
  ui: { selectedUserId: number | null };
}

// BAD: Non-memoized selector - expensive computation on every call
export const selectAllUsers = (state: AppState): User[] => {
  console.log('selectAllUsers called - expensive computation!');
  return Object.values(state.users).map(user => ({
    ...user,
    // BAD: Complex computation in selector without memoization
    totalProjectHours: user.projects.reduce((sum, p) => sum + p.hours, 0),
    skillCount: user.skills.length,
    primarySkill: user.skills[0] || 'None'
  }));
};

// BAD: Another non-memoized selector with heavy computation
export const selectUserById = (userId: number) => (state: AppState): User | null => {
  console.log(`selectUserById called for user ${userId} - expensive computation!`);
  const user = state.users[userId];
  if (!user) return null;

  // BAD: Expensive calculations repeated on every call
  const totalProjects = user.projects.length;
  const avgHoursPerProject = totalProjects > 0
    ? user.projects.reduce((sum, p) => sum + p.hours, 0) / totalProjects
    : 0;

  return {
    ...user,
    stats: {
      totalProjects,
      avgHoursPerProject,
      isSenior: user.skills.length > 5 && totalProjects > 10
    }
  };
};

// BAD: Complex selector without memoization
export const selectUsersWithStats = (state: AppState) => {
  console.log('selectUsersWithStats called - very expensive computation!');
  const users = Object.values(state.users);

  // BAD: Multiple expensive operations without memoization
  const userStats = users.map(user => {
    const projectStats = user.projects.reduce((acc, project) => ({
      totalHours: acc.totalHours + project.hours,
      projectCount: acc.projectCount + 1,
      avgComplexity: acc.avgComplexity + (project.complexity || 5)
    }), { totalHours: 0, projectCount: 0, avgComplexity: 0 });

    projectStats.avgComplexity = projectStats.avgComplexity / projectStats.projectCount;

    return {
      ...user,
      stats: {
        ...projectStats,
        efficiency: projectStats.totalHours / projectStats.projectCount,
        skillUtilization: user.skills.length / projectStats.projectCount
      }
    };
  });

  // BAD: Sorting operation on every call
  return userStats.sort((a, b) => b.stats.totalHours - a.stats.totalHours);
};

// BAD: Selector that performs filtering without memoization
export const selectActiveUsers = (state: AppState) => {
  console.log('selectActiveUsers called - filtering on every call!');
  return Object.values(state.users).filter(user => {
    // BAD: Complex filtering logic repeated
    const recentActivity = user.lastLogin > Date.now() - (30 * 24 * 60 * 60 * 1000);
    const hasActiveProjects = user.projects.some(p => p.status === 'active');
    const skillScore = user.skills.reduce((score, skill) => score + skill.level, 0);

    return recentActivity && (hasActiveProjects || skillScore > 50);
  });
};

// BAD: Chained selectors without memoization
export const selectCurrentUser = (state: AppState) => {
  console.log('selectCurrentUser called');
  const userId = state.ui.selectedUserId;
  if (!userId) return null;

  // BAD: Calling non-memoized selector inside another non-memoized selector
  return selectUserById(userId)(state);
};

export const selectCurrentUserProjects = (state: AppState) => {
  console.log('selectCurrentUserProjects called');
  const user = selectCurrentUser(state);
  if (!user) return [];

  // BAD: Expensive computation on every call
  return user.projects.map(project => ({
    ...project,
    // BAD: Complex calculations repeated
    estimatedValue: project.hours * project.hourlyRate,
    riskLevel: project.complexity > 8 ? 'high' : project.complexity > 5 ? 'medium' : 'low',
    teamSize: project.teamMembers?.length || 1
  }));
};

// BAD: Selector that uses external dependencies without memoization
let externalApiCache = new Map();

export const selectUserFromExternalAPI = (userId: number) => async (state: AppState) => {
  console.log('selectUserFromExternalAPI called - external API call!');

  if (externalApiCache.has(userId)) {
    return externalApiCache.get(userId);
  }

  // BAD: External API call without proper memoization
  try {
    const response = await fetch(`/api/users/${userId}/external-data`);
    const data = await response.json();
    externalApiCache.set(userId, data);
    return data;
  } catch (error) {
    console.error('External API call failed:', error);
    return null;
  }
};

// BAD: Recursive selectors without memoization
export const selectUserHierarchy = (userId: number, depth = 0) => (state: AppState) => {
  console.log(`selectUserHierarchy called for user ${userId}, depth ${depth}`);
  if (depth > 5) return []; // Prevent infinite recursion

  const user = state.users[userId];
  if (!user) return [];

  // BAD: Recursive calls without memoization
  const subordinates = user.subordinateIds?.map(id =>
    selectUserHierarchy(id, depth + 1)(state)
  ).flat() || [];

  return [user, ...subordinates];
};

// BAD: Time-based selectors without memoization
export const selectRecentUsers = (hours: number) => (state: AppState) => {
  console.log(`selectRecentUsers called for ${hours} hours`);
  const cutoff = Date.now() - (hours * 60 * 60 * 1000);

  return Object.values(state.users).filter(user => {
    // BAD: Time calculations on every call
    return user.createdAt > cutoff &&
           user.lastLogin > cutoff &&
           user.projects.some(p => p.updatedAt > cutoff);
  }).map(user => ({
    ...user,
    // BAD: Additional computations
    activityScore: calculateActivityScore(user),
    freshness: (Date.now() - user.lastLogin) / (1000 * 60 * 60) // hours ago
  }));
};

// BAD: Helper function called on every selector invocation
function calculateActivityScore(user: User): number {
  console.log('calculateActivityScore called');
  let score = 0;
  score += user.projects.length * 10;
  score += user.skills.length * 5;
  score += user.followers?.length || 0;
  score += Math.min(user.experienceYears || 0, 10) * 2;
  return score;
}