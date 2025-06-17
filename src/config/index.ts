// Application configuration
export const config = {
  api: {
    url: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Vensa Audit Platform',
  },
} as const

// Type-safe config access
export type Config = typeof config