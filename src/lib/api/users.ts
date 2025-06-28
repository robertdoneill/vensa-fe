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

  async removeUser(userId: number): Promise<void> {
    return await apiClient.delete(`${API_ENDPOINTS.user.users}${userId}/`);
  }

  async updateUserRole(userId: number, role: string): Promise<OrganizationUser> {
    // TODO: Replace with actual endpoint when backend supports role updates
    return await apiClient.patch<OrganizationUser>(`${API_ENDPOINTS.user.users}${userId}/`, { role });
  }
}

export const usersApi = new UsersApi();