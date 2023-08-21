import { TaskInterface } from 'interfaces/task';
import { TeamInterface } from 'interfaces/team';
import { ProjectManagerInterface } from 'interfaces/project-manager';
import { GetQueryInterface } from 'interfaces';

export interface ProjectInterface {
  id?: string;
  name: string;
  description?: string;
  status: string;
  project_manager_id?: string;
  created_at?: any;
  updated_at?: any;
  task?: TaskInterface[];
  team?: TeamInterface[];
  project_manager?: ProjectManagerInterface;
  _count?: {
    task?: number;
    team?: number;
  };
}

export interface ProjectGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  description?: string;
  status?: string;
  project_manager_id?: string;
}
