// BAD: Non-normalized state stores entities in nested arrays
export interface User {
  id: number;
  name: string;
  email: string;
  department: {
    id: number;
    name: string;
    manager: {
      id: number;
      name: string;
    };
  };
}

export interface Task {
  id: number;
  title: string;
  description: string;
  assignee: User;
  project: {
    id: number;
    name: string;
    owner: User;
  };
}

// BAD: Non-normalized state with nested entities
export interface BadAppState {
  // BAD: Users stored in nested arrays within other entities
  projects: Array<{
    id: number;
    name: string;
    description: string;
    owner: User;
    members: User[];
    tasks: Array<{
      id: number;
      title: string;
      assignee: User;
      status: 'todo' | 'in-progress' | 'done';
    }>;
  }>;

  // BAD: Departments with nested users
  departments: Array<{
    id: number;
    name: string;
    manager: User;
    employees: User[];
    subDepartments: Array<{
      id: number;
      name: string;
      manager: User;
      employees: User[];
    }>;
  }>;

  // BAD: Current user with nested profile data
  currentUser: {
    id: number;
    name: string;
    email: string;
    profile: {
      avatar: string;
      bio: string;
      skills: string[];
    };
    department: {
      id: number;
      name: string;
      manager: User;
    };
    recentProjects: Array<{
      id: number;
      name: string;
      role: string;
      tasks: Task[];
    }>;
  } | null;

  // BAD: Complex nested relationships
  notifications: Array<{
    id: number;
    type: string;
    message: string;
    sender: User;
    recipient: User;
    relatedEntity: {
      type: 'project' | 'task' | 'user';
      id: number;
      data: any; // BAD: Any type for nested data
    };
  }>;
}

// BAD: Selectors that navigate deeply nested structures
export const selectCurrentUserDepartment = (state: BadAppState) =>
  state.currentUser?.department;

export const selectProjectTasks = (projectId: number) => (state: BadAppState) =>
  state.projects.find(p => p.id === projectId)?.tasks || [];

export const selectUserProjects = (userId: number) => (state: BadAppState) =>
  state.projects.filter(p =>
    p.owner.id === userId ||
    p.members.some(m => m.id === userId)
  );

// BAD: Updates require deep traversal and mutation
export const updateUserInProject = (
  state: BadAppState,
  projectId: number,
  userId: number,
  updates: Partial<User>
): BadAppState => {
  return {
    ...state,
    projects: state.projects.map(project =>
      project.id === projectId
        ? {
            ...project,
            owner: project.owner.id === userId
              ? { ...project.owner, ...updates }
              : project.owner,
            members: project.members.map(member =>
              member.id === userId
                ? { ...member, ...updates }
                : member
            ),
            tasks: project.tasks.map(task =>
              task.assignee.id === userId
                ? { ...task, assignee: { ...task.assignee, ...updates } }
                : task
            )
          }
        : project
    )
  };
};

// BAD: Complex selectors with multiple traversals
export const selectUsersWithTasks = (state: BadAppState) => {
  const users = new Map<number, User>();

  // BAD: Collecting users from multiple nested locations
  state.projects.forEach(project => {
    users.set(project.owner.id, project.owner);
    project.members.forEach(member => users.set(member.id, member));
    project.tasks.forEach(task => users.set(task.assignee.id, task.assignee));
  });

  state.departments.forEach(dept => {
    users.set(dept.manager.id, dept.manager);
    dept.employees.forEach(emp => users.set(emp.id, emp));
    dept.subDepartments.forEach(sub => {
      users.set(sub.manager.id, sub.manager);
      sub.employees.forEach(emp => users.set(emp.id, emp));
    });
  });

  if (state.currentUser) {
    users.set(state.currentUser.id, state.currentUser);
  }

  return Array.from(users.values());
};

// BAD: Inefficient lookups require O(n) operations
export const findUserById = (state: BadAppState, userId: number): User | undefined => {
  // BAD: Linear search through all nested locations
  for (const project of state.projects) {
    if (project.owner.id === userId) return project.owner;
    const member = project.members.find(m => m.id === userId);
    if (member) return member;
    const assignee = project.tasks.find(t => t.assignee.id === userId)?.assignee;
    if (assignee) return assignee;
  }

  for (const dept of state.departments) {
    if (dept.manager.id === userId) return dept.manager;
    const employee = dept.employees.find(e => e.id === userId);
    if (employee) return employee;

    for (const subDept of dept.subDepartments) {
      if (subDept.manager.id === userId) return subDept.manager;
      const subEmployee = subDept.employees.find(e => e.id === userId);
      if (subEmployee) return subEmployee;
    }
  }

  return state.currentUser?.id === userId ? state.currentUser : undefined;
};