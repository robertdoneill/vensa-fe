// Base API service with authentication handling
import { config } from '@/config'
import { AuthService } from './auth'

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

interface RequestOptions extends RequestInit {
  skipAuth?: boolean
}

export class ApiService {
  private static async makeRequest(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<Response> {
    const { skipAuth = false, ...fetchOptions } = options
    
    const url = endpoint.startsWith('http') 
      ? endpoint 
      : `${config.api.url}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(fetchOptions.headers as Record<string, string> || {}),
    }

    // Add auth header if token exists and not skipped
    if (!skipAuth) {
      const token = AuthService.getAccessToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), config.api.timeout)

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // Handle 401 - try to refresh token
      if (response.status === 401 && !skipAuth) {
        try {
          await AuthService.refreshToken()
          // Retry the request with new token
          return this.makeRequest(endpoint, options)
        } catch {
          // Refresh failed, clear tokens and redirect to login
          AuthService.clearTokens()
          window.location.href = '/login'
          throw new ApiError('Authentication failed', 401)
        }
      }

      return response
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408)
      }
      throw error
    }
  }

  // GET request
  static async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const response = await this.makeRequest(endpoint, {
      ...options,
      method: 'GET',
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }))
      throw new ApiError(
        error.detail || `GET ${endpoint} failed`,
        response.status,
        error
      )
    }

    return response.json()
  }

  // POST request
  static async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    const response = await this.makeRequest(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }))
      throw new ApiError(
        error.detail || `POST ${endpoint} failed`,
        response.status,
        error
      )
    }

    return response.json()
  }

  // PUT request
  static async put<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    const response = await this.makeRequest(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }))
      throw new ApiError(
        error.detail || `PUT ${endpoint} failed`,
        response.status,
        error
      )
    }

    return response.json()
  }

  // DELETE request
  static async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const response = await this.makeRequest(endpoint, {
      ...options,
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }))
      throw new ApiError(
        error.detail || `DELETE ${endpoint} failed`,
        response.status,
        error
      )
    }

    // Handle empty responses
    const text = await response.text()
    return text ? JSON.parse(text) : {} as T
  }

  // File upload
  static async upload<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>,
    options?: RequestOptions
  ): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }

    const response = await this.makeRequest(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
      headers: {
        // Remove Content-Type to let browser set it with boundary
        ...(options?.headers as Record<string, string> || {}),
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Upload failed' }))
      throw new ApiError(
        error.detail || `Upload to ${endpoint} failed`,
        response.status,
        error
      )
    }

    return response.json()
  }
}