// GOOD: Normalized state with separate entity tables
export interface User {
  id: number;
  name: string;
  email: string;
  departmentId: number;
  profileId?: number;
}

export interface Department {
  id: number;
  name: string;
  managerId: number;
  parentDepartmentId?: number;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  memberIds: number[];
  taskIds: number[];
}

export interface Task {
  id: number;
  title: string;
  description: string;
  assigneeId: number;
  projectId: number;
  status: 'todo' | 'in-progress' | 'done';
}

export interface UserProfile {
  id: number;
  userId: number;
  avatar: string;
  bio: string;
  skills: string[];
}

// GOOD: Normalized state structure
export interface GoodAppState {
  // GOOD: Separate entity tables
  users: { [id: number]: User };
  departments: { [id: number]: Department };
  projects: { [id: number]: Project };
  tasks: { [id: number]: Task };
  profiles: { [id: number]: UserProfile };

  // GOOD: ID arrays for relationships
  projectIds: number[];
  departmentIds: number[];
  taskIds: number[];

  // GOOD: UI state separate from entities
  ui: {
    currentUserId: number | null;
    selectedProjectId: number | null;
    loading: {
      projects: boolean;
      users: boolean;
      tasks: boolean;
    };
  };

  // GOOD: Notifications with simple ID references
  notifications: Array<{
    id: number;
    type: string;
    message: string;
    senderId: number;
    recipientId: number;
    relatedEntity: {
      type: 'project' | 'task' | 'user';
      id: number;
    };
  }>;
}

// GOOD: Efficient selectors using normalized structure
export const selectUserById = (userId: number) => (state: GoodAppState) =>
  state.users[userId];

export const selectDepartmentById = (departmentId: number) => (state: GoodAppState) =>
  state.departments[departmentId];

export const selectProjectById = (projectId: number) => (state: GoodAppState) =>
  state.projects[projectId];

// GOOD: Complex selectors with efficient lookups
export const selectProjectWithDetails = (projectId: number) => (state: GoodAppState) => {
  const project = state.projects[projectId];
  if (!project) return null;

  const owner = state.users[project.ownerId];
  const members = project.memberIds.map(id => state.users[id]).filter(Boolean);
  const tasks = project.taskIds.map(id => state.tasks[id]).filter(Boolean);

  return {
    ...project,
    owner,
    members,
    tasks
  };
};

// GOOD: User selector with department relationship
export const selectUserWithDepartment = (userId: number) => (state: GoodAppState) => {
  const user = state.users[userId];
  if (!user) return null;

  const department = state.departments[user.departmentId];
  const profile = user.profileId ? state.profiles[user.profileId] : null;

  return {
    ...user,
    department,
    profile
  };
};

// GOOD: Current user selector
export const selectCurrentUser = (state: GoodAppState) => {
  if (!state.ui.currentUserId) return null;
  return selectUserWithDepartment(state.ui.currentUserId)(state);
};

// GOOD: Department hierarchy selector
export const selectDepartmentHierarchy = (departmentId: number) => (state: GoodAppState) => {
  const department = state.departments[departmentId];
  if (!department) return null;

  const manager = state.users[department.managerId];
  const employees = Object.values(state.users)
    .filter(user => user.departmentId === departmentId);

  const subDepartments = Object.values(state.departments)
    .filter(dept => dept.parentDepartmentId === departmentId)
    .map(dept => ({
      ...dept,
      manager: state.users[dept.managerId],
      employees: Object.values(state.users)
        .filter(user => user.departmentId === dept.id)
    }));

  return {
    ...department,
    manager,
    employees,
    subDepartments
  };
};

// GOOD: Efficient updates using normalized structure
export const updateUser = (
  state: GoodAppState,
  userId: number,
  updates: Partial<User>
): GoodAppState => {
  const existingUser = state.users[userId];
  if (!existingUser) return state;

  return {
    ...state,
    users: {
      ...state.users,
      [userId]: { ...existingUser, ...updates }
    }
  };
};

// GOOD: Adding a new project with normalized relationships
export const addProject = (
  state: GoodAppState,
  project: Omit<Project, 'id'>,
  tasks: Omit<Task, 'id' | 'projectId'>[]
): GoodAppState => {
  const projectId = Math.max(...state.projectIds, 0) + 1;
  const taskIds = tasks.map((_, index) => Math.max(...state.taskIds, 0) + index + 1);

  const newProject: Project = { ...project, id: projectId };
  const newTasks: { [id: number]: Task } = {};

  tasks.forEach((task, index) => {
    const taskId = taskIds[index];
    newTasks[taskId] = { ...task, id: taskId, projectId };
  });

  return {
    ...state,
    projects: { ...state.projects, [projectId]: newProject },
    tasks: { ...state.tasks, ...newTasks },
    projectIds: [...state.projectIds, projectId],
    taskIds: [...state.taskIds, ...taskIds]
  };
};

// GOOD: Complex query selectors
export const selectUsersWithTaskCounts = (state: GoodAppState) => {
  const taskCounts: { [userId: number]: number } = {};

  // GOOD: Efficient counting using normalized structure
  Object.values(state.tasks).forEach(task => {
    taskCounts[task.assigneeId] = (taskCounts[task.assigneeId] || 0) + 1;
  });

  return Object.values(state.users).map(user => ({
    ...user,
    taskCount: taskCounts[user.id] || 0
  }));
};

// GOOD: Cross-entity selectors
export const selectProjectSummary = (state: GoodAppState) => {
  return state.projectIds.map(projectId => {
    const project = state.projects[projectId];
    const owner = state.users[project.ownerId];
    const taskCount = project.taskIds.length;
    const completedTasks = project.taskIds.filter(taskId =>
      state.tasks[taskId]?.status === 'done'
    ).length;

    return {
      id: project.id,
      name: project.name,
      ownerName: owner?.name,
      taskCount,
      completedTasks,
      progress: taskCount > 0 ? (completedTasks / taskCount) * 100 : 0
    };
  });
};