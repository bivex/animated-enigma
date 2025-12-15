// GOOD: Proper memoization in NgRx selectors using createSelector
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

// GOOD: Base selectors
export const selectUsersState = createFeatureSelector<AppState['users']>('users');
export const selectUIState = createFeatureSelector<AppState['ui']>('ui');

// GOOD: Memoized selector with complex computation
export const selectAllUsers = createSelector(
  selectUsersState,
  (users) => {
    console.log('selectAllUsers computed - memoized!');
    return Object.values(users).map(user => ({
      ...user,
      totalProjectHours: user.projects.reduce((sum, p) => sum + p.hours, 0),
      skillCount: user.skills.length,
      primarySkill: user.skills[0] || 'None'
    }));
  }
);

// GOOD: Memoized selector with parameter
export const selectUserById = (userId: number) => createSelector(
  selectUsersState,
  (users) => {
    console.log(`selectUserById computed for user ${userId} - memoized!`);
    const user = users[userId];
    if (!user) return null;

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
  }
);

// GOOD: Complex selector with proper memoization
export const selectUsersWithStats = createSelector(
  selectUsersState,
  (users) => {
    console.log('selectUsersWithStats computed - memoized!');
    const userStats = Object.values(users).map(user => {
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

    return userStats.sort((a, b) => b.stats.totalHours - a.stats.totalHours);
  }
);

// GOOD: Memoized filtering selector
export const selectActiveUsers = createSelector(
  selectUsersState,
  (users) => {
    console.log('selectActiveUsers computed - memoized!');
    return Object.values(users).filter(user => {
      const recentActivity = user.lastLogin > Date.now() - (30 * 24 * 60 * 60 * 1000);
      const hasActiveProjects = user.projects.some(p => p.status === 'active');
      const skillScore = user.skills.reduce((score, skill) => score + skill.level, 0);

      return recentActivity && (hasActiveProjects || skillScore > 50);
    });
  }
);

// GOOD: Properly chained memoized selectors
export const selectCurrentUserId = createSelector(
  selectUIState,
  (ui) => ui.selectedUserId
);

export const selectCurrentUser = createSelector(
  selectUsersState,
  selectCurrentUserId,
  (users, userId) => {
    console.log('selectCurrentUser computed - memoized!');
    if (!userId) return null;
    return users[userId] || null;
  }
);

export const selectCurrentUserProjects = createSelector(
  selectCurrentUser,
  (user) => {
    console.log('selectCurrentUserProjects computed - memoized!');
    if (!user) return [];

    return user.projects.map(project => ({
      ...project,
      estimatedValue: project.hours * project.hourlyRate,
      riskLevel: project.complexity > 8 ? 'high' : project.complexity > 5 ? 'medium' : 'low',
      teamSize: project.teamMembers?.length || 1
    }));
  }
);

// GOOD: Memoized selector with external data (properly handled)
export const selectExternalAPICache = createSelector(
  selectUsersState,
  (users) => {
    // GOOD: Cache external data properly
    const cache = new Map<number, any>();
    return { cache, users };
  }
);

// GOOD: Recursive selector with memoization
const selectUserHierarchyCache = new Map<string, User[]>();

export const selectUserHierarchy = (userId: number) => createSelector(
  selectUsersState,
  (users) => {
    const cacheKey = `hierarchy_${userId}`;
    if (selectUserHierarchyCache.has(cacheKey)) {
      return selectUserHierarchyCache.get(cacheKey)!;
    }

    console.log(`selectUserHierarchy computed for user ${userId} - memoized!`);

    const buildHierarchy = (id: number, visited = new Set<number>()): User[] => {
      if (visited.has(id)) return [];
      visited.add(id);

      const user = users[id];
      if (!user) return [];

      const subordinates = user.subordinateIds?.map(subId =>
        buildHierarchy(subId, visited)
      ).flat() || [];

      return [user, ...subordinates];
    };

    const result = buildHierarchy(userId);
    selectUserHierarchyCache.set(cacheKey, result);
    return result;
  }
);

// GOOD: Time-based selector with proper memoization
export const selectRecentUsers = (hours: number) => createSelector(
  selectUsersState,
  (users) => {
    console.log(`selectRecentUsers computed for ${hours} hours - memoized!`);
    const cutoff = Date.now() - (hours * 60 * 60 * 1000);

    return Object.values(users).filter(user => {
      return user.createdAt > cutoff &&
             user.lastLogin > cutoff &&
             user.projects.some(p => p.updatedAt > cutoff);
    }).map(user => ({
      ...user,
      activityScore: user.activityScore || calculateActivityScore(user),
      freshness: (Date.now() - user.lastLogin) / (1000 * 60 * 60)
    }));
  }
);

// GOOD: Memoized helper function result
const activityScoreCache = new Map<string, number>();

function calculateActivityScore(user: User): number {
  const cacheKey = `activity_${user.id}_${user.projects.length}_${user.skills.length}`;
  if (activityScoreCache.has(cacheKey)) {
    return activityScoreCache.get(cacheKey)!;
  }

  console.log('calculateActivityScore computed - cached!');
  let score = 0;
  score += user.projects.length * 10;
  score += user.skills.length * 5;
  score += user.followers?.length || 0;
  score += Math.min(user.experienceYears || 0, 10) * 2;

  activityScoreCache.set(cacheKey, score);
  return score;
}

// GOOD: Composite selectors for complex UI state
export const selectUserDashboardData = createSelector(
  selectCurrentUser,
  selectCurrentUserProjects,
  selectRecentUsers(24),
  (currentUser, projects, recentUsers) => {
    console.log('selectUserDashboardData computed - memoized!');
    return {
      currentUser,
      projects,
      recentUsers,
      stats: {
        totalProjects: projects.length,
        completedProjects: projects.filter(p => p.status === 'completed').length,
        activeCollaborators: recentUsers.length
      }
    };
  }
);

// GOOD: Selector composition for better reusability
export const selectUserSkills = createSelector(
  selectUsersState,
  (users) => {
    console.log('selectUserSkills computed - memoized!');
    const allSkills = new Set<string>();
    Object.values(users).forEach(user => {
      user.skills.forEach(skill => allSkills.add(skill));
    });
    return Array.from(allSkills).sort();
  }
);

export const selectUsersBySkill = (skill: string) => createSelector(
  selectUsersState,
  (users) => {
    console.log(`selectUsersBySkill computed for ${skill} - memoized!`);
    return Object.values(users).filter(user =>
      user.skills.includes(skill)
    );
  }
);