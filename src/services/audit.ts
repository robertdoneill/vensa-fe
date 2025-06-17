// Audit API service for control tests, workpapers, etc.
import { ApiService } from './api'

// Types based on your Django models
export interface Organization {
  id: number
  name: string
}

export interface ControlTest {
  id: number
  name: string
  description: string
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'annually'
  owner?: Organization
  created_at?: string
  updated_at?: string
}

export interface Workpaper {
  id: number
  name: string
  description?: string
  status?: 'draft' | 'in_review' | 'finalized'
  owner?: Organization
  created_at?: string
  updated_at?: string
}

export interface Evidence {
  id: number
  file: string
  filename: string
  uploaded_at: string
  uploaded_by?: number
  workpaper?: number
}

export class AuditService {
  // Control Tests
  static async getControlTests(): Promise<ControlTest[]> {
    return ApiService.get<ControlTest[]>('/audit/control-tests/')
  }

  static async getControlTest(id: number): Promise<ControlTest> {
    return ApiService.get<ControlTest>(`/audit/control-tests/${id}/`)
  }

  static async createControlTest(data: Partial<ControlTest>): Promise<ControlTest> {
    return ApiService.post<ControlTest>('/audit/control-tests/', data)
  }

  static async updateControlTest(id: number, data: Partial<ControlTest>): Promise<ControlTest> {
    return ApiService.put<ControlTest>(`/audit/control-tests/${id}/`, data)
  }

  static async deleteControlTest(id: number): Promise<void> {
    return ApiService.delete<void>(`/audit/control-tests/${id}/`)
  }

  // Workpapers
  static async getWorkpapers(): Promise<Workpaper[]> {
    return ApiService.get<Workpaper[]>('/audit/workpapers/')
  }

  static async getWorkpaper(id: number): Promise<Workpaper> {
    return ApiService.get<Workpaper>(`/audit/workpapers/${id}/`)
  }

  static async createWorkpaper(data: Partial<Workpaper>): Promise<Workpaper> {
    return ApiService.post<Workpaper>('/audit/workpapers/', data)
  }

  static async updateWorkpaper(id: number, data: Partial<Workpaper>): Promise<Workpaper> {
    return ApiService.put<Workpaper>(`/audit/workpapers/${id}/`, data)
  }

  // Evidence
  static async uploadEvidence(file: File, workpaperId?: number): Promise<Evidence> {
    const additionalData = workpaperId ? { workpaper: workpaperId } : undefined
    return ApiService.upload<Evidence>('/audit/evidence/', file, additionalData)
  }

  static async getEvidence(workpaperId?: number): Promise<Evidence[]> {
    const query = workpaperId ? `?workpaper=${workpaperId}` : ''
    return ApiService.get<Evidence[]>(`/audit/evidence/${query}`)
  }

  static async deleteEvidence(id: number): Promise<void> {
    return ApiService.delete<void>(`/audit/evidence/${id}/`)
  }
}