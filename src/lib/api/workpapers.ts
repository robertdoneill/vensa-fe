import { apiClient } from './client';
import { API_ENDPOINTS } from './config';

export interface Workpaper {
  id: number;
  organization: {
    id: number;
    name: string;
  };
  title: string;
  description?: string;
  period_start: string; // YYYY-MM-DD format
  period_end: string;   // YYYY-MM-DD format
  status: string;
  created_at: string;
  updated_at: string;
}

export interface WorkpaperSection {
  id: number;
  workpaper_details: {
    id: number;
    title: string;
  };
  evidence_details: {
    id: number;
    name: string;
  };
  exceptions: Array<{
    id: number;
    note: string;
  }>;
  exceptions_details: {
    id: number;
    notes: Array<{
      id: number;
      note: string;
    }>;
  };
  name: string;
  summary: string;
  created_at: string;
  updated_at: string;
}

export interface WorkpaperExport {
  id: number;
  workpaper_details: {
    id: number;
    title: string;
  };
  format: string;
  data: string;
  hash: string;
  created_at: string;
  updated_at: string;
}

export interface CreateWorkpaperRequest {
  title: string;
  period_start: string;
  period_end: string;
  status: string;
}

export interface CreateWorkpaperSectionRequest {
  workpaper: number;
  evidence?: number;
  name: string;
  summary: string;
}

export interface CreateWorkpaperExportRequest {
  workpaper: number;
  format: string;
  data?: string;
}

class WorkpapersApi {
  // Workpapers
  async getWorkpapers(): Promise<Workpaper[]> {
    return apiClient.get<Workpaper[]>(API_ENDPOINTS.audit.workpapers);
  }

  async getWorkpaper(id: number): Promise<Workpaper> {
    return apiClient.get<Workpaper>(`${API_ENDPOINTS.audit.workpapers}${id}/`);
  }

  async createWorkpaper(data: CreateWorkpaperRequest): Promise<Workpaper> {
    return apiClient.post<Workpaper>(API_ENDPOINTS.audit.workpapers, data);
  }

  async updateWorkpaper(id: number, data: Partial<CreateWorkpaperRequest>): Promise<Workpaper> {
    return apiClient.patch<Workpaper>(`${API_ENDPOINTS.audit.workpapers}${id}/`, data);
  }

  async deleteWorkpaper(id: number): Promise<void> {
    return apiClient.delete(`${API_ENDPOINTS.audit.workpapers}${id}/`);
  }

  // Workpaper Sections
  async getWorkpaperSections(workpaperId?: number): Promise<WorkpaperSection[]> {
    const url = workpaperId 
      ? `${API_ENDPOINTS.audit.workpaperSections}?workpaper=${workpaperId}`
      : API_ENDPOINTS.audit.workpaperSections;
    return apiClient.get<WorkpaperSection[]>(url);
  }

  async getWorkpaperSection(id: number): Promise<WorkpaperSection> {
    return apiClient.get<WorkpaperSection>(`${API_ENDPOINTS.audit.workpaperSections}${id}/`);
  }

  async createWorkpaperSection(data: CreateWorkpaperSectionRequest): Promise<WorkpaperSection> {
    return apiClient.post<WorkpaperSection>(API_ENDPOINTS.audit.workpaperSections, data);
  }

  async updateWorkpaperSection(id: number, data: Partial<CreateWorkpaperSectionRequest>): Promise<WorkpaperSection> {
    return apiClient.patch<WorkpaperSection>(`${API_ENDPOINTS.audit.workpaperSections}${id}/`, data);
  }

  async deleteWorkpaperSection(id: number): Promise<void> {
    return apiClient.delete(`${API_ENDPOINTS.audit.workpaperSections}${id}/`);
  }

  // Workpaper Exports
  async getWorkpaperExports(workpaperId?: number): Promise<WorkpaperExport[]> {
    const url = workpaperId 
      ? `${API_ENDPOINTS.audit.workpaperExports}?workpaper=${workpaperId}`
      : API_ENDPOINTS.audit.workpaperExports;
    return apiClient.get<WorkpaperExport[]>(url);
  }

  async getWorkpaperExport(id: number): Promise<WorkpaperExport> {
    return apiClient.get<WorkpaperExport>(`${API_ENDPOINTS.audit.workpaperExports}${id}/`);
  }

  async createWorkpaperExport(data: CreateWorkpaperExportRequest): Promise<WorkpaperExport> {
    return apiClient.post<WorkpaperExport>(API_ENDPOINTS.audit.workpaperExports, data);
  }

  async deleteWorkpaperExport(id: number): Promise<void> {
    return apiClient.delete(`${API_ENDPOINTS.audit.workpaperExports}${id}/`);
  }

  // Helper method to export workpaper as blob for download
  async exportWorkpaperAsBlob(workpaperId: number, format: 'pdf' | 'xlsx'): Promise<Blob> {
    try {
      // First create export record
      const exportRecord = await this.createWorkpaperExport({
        workpaper: workpaperId,
        format: format
      });

      // Convert base64 data to blob if available
      if (exportRecord.data) {
        const binaryString = atob(exportRecord.data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const mimeType = format === 'pdf' 
          ? 'application/pdf' 
          : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        
        return new Blob([bytes], { type: mimeType });
      }
      
      throw new Error('No export data available');
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    }
  }

  // Helper method to get workpaper with sections
  async getWorkpaperWithSections(id: number): Promise<Workpaper & { sections: WorkpaperSection[] }> {
    const [workpaper, sections] = await Promise.all([
      this.getWorkpaper(id),
      this.getWorkpaperSections(id)
    ]);

    return {
      ...workpaper,
      sections
    };
  }

  // Helper method to get workpaper with all related data
  async getWorkpaperWithDetails(id: number): Promise<Workpaper & { 
    sections: WorkpaperSection[];
    exports: WorkpaperExport[];
  }> {
    const [workpaper, sections, exports] = await Promise.all([
      this.getWorkpaper(id),
      this.getWorkpaperSections(id),
      this.getWorkpaperExports(id)
    ]);

    return {
      ...workpaper,
      sections,
      exports
    };
  }
}

export const workpapersApi = new WorkpapersApi();