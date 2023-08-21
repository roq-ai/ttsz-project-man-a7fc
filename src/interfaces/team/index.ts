import { TeamMemberInterface } from 'interfaces/team-member';
import { ProjectInterface } from 'interfaces/project';
import { GetQueryInterface } from 'interfaces';

export interface TeamInterface {
  id?: string;
  name: string;
  description?: string;
  project_id?: string;
  created_at?: any;
  updated_at?: any;
  team_member?: TeamMemberInterface[];
  project?: ProjectInterface;
  _count?: {
    team_member?: number;
  };
}

export interface TeamGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  description?: string;
  project_id?: string;
}
