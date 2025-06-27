import { apiClient } from './client';
import { API_ENDPOINTS } from './config';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface User {
  id: number;
  password?: string;
  last_login?: string;
  is_superuser?: boolean;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_staff?: boolean;
  is_active?: boolean;
  date_joined?: string;
  active_organization?: number;
  groups?: number[];
  user_permissions?: number[];
}

class AuthService {
  private refreshToken: string | null = null;
  private accessToken: string | null = null;

  constructor() {
    // Load tokens from localStorage on initialization
    this.accessToken = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
  }

  async login(credentials: LoginCredentials): Promise<TokenResponse> {
    const response = await apiClient.post<TokenResponse>(
      API_ENDPOINTS.auth.login,
      credentials
    );

    this.setTokens(response.access, response.refresh);
    return response;
  }

  async refreshAccessToken(): Promise<string> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<{ access: string }>(
      API_ENDPOINTS.auth.refresh,
      { refresh: this.refreshToken }
    );

    this.setAccessToken(response.access);
    return response.access;
  }

  async verifyToken(token?: string): Promise<boolean> {
    try {
      await apiClient.post(
        API_ENDPOINTS.auth.verify,
        { token: token || this.accessToken }
      );
      return true;
    } catch {
      return false;
    }
  }

  // Decode JWT token to get user info
  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

  getUserFromToken(): User | null {
    if (!this.accessToken) return null;
    
    const decoded = this.decodeToken(this.accessToken);
    if (!decoded) return null;

    // JWT typically contains user_id, username, etc.
    return {
      id: decoded.user_id || decoded.sub,
      username: decoded.username || decoded.preferred_username || 'Unknown User',
      email: decoded.email || 'user@vensa.ai',
      first_name: decoded.first_name || '',
      last_name: decoded.last_name || '',
    };
  }

  async getCurrentUser(): Promise<User> {
    // First get user ID from JWT token
    const userFromToken = this.getUserFromToken();
    if (!userFromToken?.id) {
      throw new Error('No user ID found in token');
    }

    // Fetch full user data from BE API using the user ID
    try {
      return await apiClient.get<User>(`${API_ENDPOINTS.user.users}${userFromToken.id}/`);
    } catch (error) {
      // Fallback to token data if API fails
      console.log('Failed to fetch user from API, using token data:', error);
      return userFromToken;
    }
  }

  logout() {
    this.clearTokens();
    // Redirect to login page
    window.location.href = '/login';
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  private setTokens(access: string, refresh: string) {
    this.accessToken = access;
    this.refreshToken = refresh;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  }

  private setAccessToken(access: string) {
    this.accessToken = access;
    localStorage.setItem('access_token', access);
  }

  private clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}

export const authService = new AuthService();