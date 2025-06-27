import { apiClient } from './client';
import { API_ENDPOINTS } from './config';

export interface ControlTest {
  id: number;
  owner: {
    id: number;
    name: string;
  };
  workpaper_details: {
    id: number;
    title: string;
  };
  name: string;
  objective: string;
  frequency: 'd' | 'w' | 'm' | 'q' | 'y'; // daily, weekly, monthly, quarterly, yearly
  criteria: string;
  created_at: string;
  updated_at: string;
}

export interface ControlResult {
  id?: number;
  test: number;
  outcome: boolean;
  metadata: string;
  created_at?: string;
  updated_at?: string;
}

export interface ControlComment {
  id: number;
  test_details: {
    id: number;
    name: string;
  };
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  };
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface CreateControlTestRequest {
  workpaper: number;
  name: string; // <= 20 characters
  objective: string;
  frequency: 'd' | 'w' | 'b' | 'm' | 'y'; // d=Daily, w=Weekly, b=Biweekly, m=Monthly, y=Yearly
  criteria: string;
}

class ControlsApi {
  async getControlTests(): Promise<ControlTest[]> {
    return apiClient.get<ControlTest[]>(API_ENDPOINTS.audit.controlTests);
  }

  async getControlTest(id: number): Promise<ControlTest> {
    return apiClient.get<ControlTest>(`${API_ENDPOINTS.audit.controlTests}${id}/`);
  }

  async createControlTest(data: CreateControlTestRequest): Promise<ControlTest> {
    return apiClient.post<ControlTest>(API_ENDPOINTS.audit.controlTests, data);
  }

  async updateControlTest(id: number, data: Partial<CreateControlTestRequest>): Promise<ControlTest> {
    return apiClient.patch<ControlTest>(`${API_ENDPOINTS.audit.controlTests}${id}/`, data);
  }

  async deleteControlTest(id: number): Promise<void> {
    return apiClient.delete(`${API_ENDPOINTS.audit.controlTests}${id}/`);
  }

  async getControlResults(testId?: number): Promise<ControlResult[]> {
    const url = testId 
      ? `${API_ENDPOINTS.audit.controlResults}?test=${testId}`
      : API_ENDPOINTS.audit.controlResults;
    return apiClient.get<ControlResult[]>(url);
  }

  async createControlResult(data: Omit<ControlResult, 'id' | 'created_at' | 'updated_at'>): Promise<ControlResult> {
    return apiClient.post<ControlResult>(API_ENDPOINTS.audit.controlResults, data);
  }

  async getControlComments(testId?: number): Promise<ControlComment[]> {
    const url = testId 
      ? `${API_ENDPOINTS.audit.controlComments}?test=${testId}`
      : API_ENDPOINTS.audit.controlComments;
    return apiClient.get<ControlComment[]>(url);
  }

  async createControlComment(testId: number, comment: string): Promise<ControlComment> {
    return apiClient.post<ControlComment>(API_ENDPOINTS.audit.controlComments, {
      test: testId,
      comment
    });
  }

  // Helper method to get control test with latest result and comment count
  async getControlTestWithDetails(id: number): Promise<ControlTest & { 
    latestResult?: ControlResult; 
    commentCount: number;
  }> {
    const [controlTest, results, comments] = await Promise.all([
      this.getControlTest(id),
      this.getControlResults(id),
      this.getControlComments(id)
    ]);

    const latestResult = results.length > 0 
      ? results.sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())[0]
      : undefined;

    return {
      ...controlTest,
      latestResult,
      commentCount: comments.length
    };
  }
}

export const controlsApi = new ControlsApi();