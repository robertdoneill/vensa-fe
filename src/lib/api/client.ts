import { API_BASE_URL } from './config';
import { authService } from './auth';

interface FetchOptions extends RequestInit {
  token?: string | null;
  skipAuth?: boolean;
}

class ApiClient {
  private baseURL: string;
  private isRefreshing = false;
  private refreshPromise: Promise<string> | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async request<T = any>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { token, headers = {}, skipAuth = false, ...fetchOptions } = options;
    
    // Get token from authService if not provided and not skipping auth
    const authToken = skipAuth ? null : (token || authService.getAccessToken());

    const config: RequestInit = {
      ...fetchOptions,
      headers: {
        ...headers,
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
        ...(!(options.body instanceof FormData) && {
          'Content-Type': 'application/json',
        }),
      },
    };

    let response = await fetch(`${this.baseURL}${endpoint}`, config);

    // Handle 401 Unauthorized - try to refresh token
    if (response.status === 401 && !skipAuth && authService.getRefreshToken()) {
      try {
        // If we're not already refreshing, start the refresh process
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          this.refreshPromise = authService.refreshAccessToken();
        }

        // Wait for the refresh to complete
        const newToken = await this.refreshPromise!;
        
        // Retry the original request with the new token
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${newToken}`,
        };
        response = await fetch(`${this.baseURL}${endpoint}`, config);
      } catch (refreshError) {
        // Refresh failed, logout user
        authService.logout();
        throw new Error('Session expired. Please login again.');
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        detail: response.statusText,
      }));
      throw new Error(error.detail || `Request failed: ${response.status}`);
    }

    // Handle empty responses
    const text = await response.text();
    return text ? JSON.parse(text) : ({} as T);
  }

  get<T = any>(endpoint: string, options?: FetchOptions) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T = any>(endpoint: string, data?: any, options?: FetchOptions) {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  put<T = any>(endpoint: string, data?: any, options?: FetchOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  patch<T = any>(endpoint: string, data?: any, options?: FetchOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  delete<T = any>(endpoint: string, options?: FetchOptions) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);