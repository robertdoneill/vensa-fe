// Authentication service for JWT token management
import { config } from '@/config'

interface AuthTokens {
  access: string
  refresh: string
}

interface LoginCredentials {
  username: string
  password: string
}

export class AuthService {
  private static ACCESS_TOKEN_KEY = 'vensa_access_token'
  private static REFRESH_TOKEN_KEY = 'vensa_refresh_token'

  // Store tokens in localStorage
  static setTokens(tokens: AuthTokens): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.access)
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refresh)
  }

  // Get access token
  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY)
  }

  // Get refresh token
  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY)
  }

  // Clear tokens (logout)
  static clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY)
    localStorage.removeItem(this.REFRESH_TOKEN_KEY)
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!this.getAccessToken()
  }

  // Login
  static async login(credentials: LoginCredentials): Promise<AuthTokens> {
    const response = await fetch(`${config.api.url}/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Login failed' }))
      throw new Error(error.detail || 'Invalid credentials')
    }

    const tokens = await response.json() as AuthTokens
    this.setTokens(tokens)
    return tokens
  }

  // Refresh access token
  static async refreshToken(): Promise<string> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await fetch(`${config.api.url}/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    })

    if (!response.ok) {
      this.clearTokens()
      throw new Error('Token refresh failed')
    }

    const data = await response.json()
    localStorage.setItem(this.ACCESS_TOKEN_KEY, data.access)
    return data.access
  }

  // Logout
  static async logout(): Promise<void> {
    // Optionally call a logout endpoint if your backend has one
    this.clearTokens()
  }
}