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
  username: string;
  email: string;
  first_name: string;
  last_name: string;
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