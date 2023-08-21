const mapping: Record<string, string> = {
  projects: 'project',
  'project-managers': 'project_manager',
  tasks: 'task',
  teams: 'team',
  'team-members': 'team_member',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
