import { apiClient } from './client';
import { API_ENDPOINTS } from './config';

export interface Evidence {
  id: string;
  name: string;
  type: string;
  tags: string;
  file: string;
  created_at: string;
  updated_at: string;
}

export interface ControlTest {
  id: string;
  name: string;
  description?: string;
}

export interface TickTie {
  id: string;
  evidence: string;
  control: string;
  created_at: string;
}

export const evidenceApi = {
  async upload(file: File, name?: string, tags?: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name || file.name);
    formData.append('type', file.type || 'application/octet-stream');
    formData.append('tags', tags || ''); // tags is required according to API doc

    console.log('Uploading file:', {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      name: name || file.name,
      tags: tags || '',
      endpoint: API_ENDPOINTS.audit.evidence
    });

    return apiClient.post<Evidence>(API_ENDPOINTS.audit.evidence, formData);
  },

  async list() {
    return apiClient.get<Evidence[]>(API_ENDPOINTS.audit.evidence);
  },

  async get(id: string) {
    return apiClient.get<Evidence>(`${API_ENDPOINTS.audit.evidence}${id}/`);
  },

  async update(id: string, data: Partial<Evidence>) {
    return apiClient.put<Evidence>(`${API_ENDPOINTS.audit.evidence}${id}/`, data);
  },

  async delete(id: string) {
    return apiClient.delete(`${API_ENDPOINTS.audit.evidence}${id}/`);
  },

  async getControlTests() {
    return apiClient.get<ControlTest[]>(API_ENDPOINTS.audit.controlTests);
  },

  async linkToControlTest(evidenceId: string, controlId: string) {
    return apiClient.post<TickTie>(API_ENDPOINTS.audit.ticktie, {
      evidence: evidenceId,
      control: controlId,
    });
  },
};