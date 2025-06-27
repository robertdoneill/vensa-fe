import { apiClient } from './client';
import { API_ENDPOINTS } from './config';

export interface OrganizationUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  active_organization?: number;
}

class UsersApi {
  async getOrganizationUsers(): Promise<OrganizationUser[]> {
    return await apiClient.get<OrganizationUser[]>(API_ENDPOINTS.user.users);
  }

  async getUserById(id: number): Promise<OrganizationUser> {
    return await apiClient.get<OrganizationUser>(`${API_ENDPOINTS.user.users}${id}/`);
  }
}

export const usersApi = new UsersApi();