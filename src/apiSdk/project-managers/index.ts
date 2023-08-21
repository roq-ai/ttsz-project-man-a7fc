import axios from 'axios';
import queryString from 'query-string';
import { ProjectManagerInterface, ProjectManagerGetQueryInterface } from 'interfaces/project-manager';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getProjectManagers = async (
  query?: ProjectManagerGetQueryInterface,
): Promise<PaginatedInterface<ProjectManagerInterface>> => {
  const response = await axios.get('/api/project-managers', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createProjectManager = async (projectManager: ProjectManagerInterface) => {
  const response = await axios.post('/api/project-managers', projectManager);
  return response.data;
};

export const updateProjectManagerById = async (id: string, projectManager: ProjectManagerInterface) => {
  const response = await axios.put(`/api/project-managers/${id}`, projectManager);
  return response.data;
};

export const getProjectManagerById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/project-managers/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteProjectManagerById = async (id: string) => {
  const response = await axios.delete(`/api/project-managers/${id}`);
  return response.data;
};
