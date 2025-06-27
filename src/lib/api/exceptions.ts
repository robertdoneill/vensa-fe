import { apiClient } from './client';
import { API_ENDPOINTS } from './config';

export interface Exception {
  id: number;
  test_details: {
    id: number;
    name: string;
  };
  workpaper_details: {
    id: number;
    title: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ExceptionNote {
  id: number;
  exception_details: {
    id: number;
    notes: Array<{
      id: number;
      note: string;
    }>;
  };
  note: string;
  created_at: string;
  updated_at: string;
}

export interface Remediation {
  id: number;
  exception_details: {
    id: number;
    notes: Array<{
      id: number;
      note: string;
    }>;
  };
  remediation: string;
  created_at: string;
  updated_at: string;
}

export interface CreateExceptionRequest {
  test: number;
  workpaper: number;
}

export interface CreateExceptionNoteRequest {
  exception: number;
  note: string;
}

export interface CreateRemediationRequest {
  exception: number;
  remediation: string;
}

class ExceptionsApi {
  // Exceptions
  async getExceptions(): Promise<Exception[]> {
    return apiClient.get<Exception[]>(API_ENDPOINTS.audit.exceptions);
  }

  async getException(id: number): Promise<Exception> {
    return apiClient.get<Exception>(`${API_ENDPOINTS.audit.exceptions}${id}/`);
  }

  async createException(data: CreateExceptionRequest): Promise<Exception> {
    return apiClient.post<Exception>(API_ENDPOINTS.audit.exceptions, data);
  }

  async updateException(id: number, data: Partial<CreateExceptionRequest>): Promise<Exception> {
    return apiClient.patch<Exception>(`${API_ENDPOINTS.audit.exceptions}${id}/`, data);
  }

  async deleteException(id: number): Promise<void> {
    return apiClient.delete(`${API_ENDPOINTS.audit.exceptions}${id}/`);
  }

  // Exception Notes
  async getExceptionNotes(exceptionId?: number): Promise<ExceptionNote[]> {
    const url = exceptionId 
      ? `${API_ENDPOINTS.audit.exceptionNotes}?exception=${exceptionId}`
      : API_ENDPOINTS.audit.exceptionNotes;
    return apiClient.get<ExceptionNote[]>(url);
  }

  async getExceptionNote(id: number): Promise<ExceptionNote> {
    return apiClient.get<ExceptionNote>(`${API_ENDPOINTS.audit.exceptionNotes}${id}/`);
  }

  async createExceptionNote(data: CreateExceptionNoteRequest): Promise<ExceptionNote> {
    return apiClient.post<ExceptionNote>(API_ENDPOINTS.audit.exceptionNotes, data);
  }

  async updateExceptionNote(id: number, data: Partial<CreateExceptionNoteRequest>): Promise<ExceptionNote> {
    return apiClient.patch<ExceptionNote>(`${API_ENDPOINTS.audit.exceptionNotes}${id}/`, data);
  }

  async deleteExceptionNote(id: number): Promise<void> {
    return apiClient.delete(`${API_ENDPOINTS.audit.exceptionNotes}${id}/`);
  }

  // Remediations
  async getRemediations(exceptionId?: number): Promise<Remediation[]> {
    const url = exceptionId 
      ? `${API_ENDPOINTS.audit.remediations}?exception=${exceptionId}`
      : API_ENDPOINTS.audit.remediations;
    return apiClient.get<Remediation[]>(url);
  }

  async getRemediation(id: number): Promise<Remediation> {
    return apiClient.get<Remediation>(`${API_ENDPOINTS.audit.remediations}${id}/`);
  }

  async createRemediation(data: CreateRemediationRequest): Promise<Remediation> {
    return apiClient.post<Remediation>(API_ENDPOINTS.audit.remediations, data);
  }

  async updateRemediation(id: number, data: Partial<CreateRemediationRequest>): Promise<Remediation> {
    return apiClient.patch<Remediation>(`${API_ENDPOINTS.audit.remediations}${id}/`, data);
  }

  async deleteRemediation(id: number): Promise<void> {
    return apiClient.delete(`${API_ENDPOINTS.audit.remediations}${id}/`);
  }

  // Helper method to get exception with notes and remediations
  async getExceptionWithDetails(id: number): Promise<Exception & {
    notes: ExceptionNote[];
    remediations: Remediation[];
  }> {
    const [exception, notes, remediations] = await Promise.all([
      this.getException(id),
      this.getExceptionNotes(id),
      this.getRemediations(id)
    ]);

    return {
      ...exception,
      notes,
      remediations
    };
  }

  // Helper method to get all exceptions with note counts
  async getExceptionsWithCounts(): Promise<Array<Exception & {
    noteCount: number;
    remediationCount: number;
    status: 'open' | 'in_progress' | 'resolved';
  }>> {
    const exceptions = await this.getExceptions();
    
    const exceptionsWithCounts = await Promise.all(
      exceptions.map(async (exception) => {
        const [notes, remediations] = await Promise.all([
          this.getExceptionNotes(exception.id),
          this.getRemediations(exception.id)
        ]);

        // Determine status based on remediations
        let status: 'open' | 'in_progress' | 'resolved' = 'open';
        if (remediations.length > 0) {
          status = 'resolved';
        } else if (notes.length > 0) {
          status = 'in_progress';
        }

        return {
          ...exception,
          noteCount: notes.length,
          remediationCount: remediations.length,
          status
        };
      })
    );

    return exceptionsWithCounts;
  }
}

export const exceptionsApi = new ExceptionsApi();