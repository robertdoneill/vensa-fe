# API Integration Guide

## Overview
This frontend is configured to connect to your Django backend API. Follow these steps to test the integration.

## Environment Configuration

### Development
The app uses environment variables to configure the API connection:
- `.env.development` - Development configuration (already created)
- `.env.production` - Production configuration (update with your production API URL)

Current development configuration:
```
VITE_API_URL=http://localhost:8000/api
VITE_API_TIMEOUT=30000
VITE_APP_NAME=Vensa Audit Platform
```

## Quick Start Testing

### 1. Start Backend
```bash
cd /path/to/backend
docker-compose -f docker-compose.local.yml up
```

### 2. Create Test User
```bash
docker-compose -f docker-compose.local.yml exec web python manage.py createsuperuser
```

### 3. Start Frontend
```bash
pnpm dev
# or
npm run dev
```

### 4. Test Login
1. Navigate to http://localhost:3000/login
2. Use the superuser credentials you created
3. You should be redirected to the dashboard on successful login

### 5. Test API Connection
1. Once logged in, go to the Dashboard
2. Look for the "API Connection Test" card
3. Click "Run API Tests" to verify:
   - API URL configuration
   - Authentication token validity
   - Ability to fetch data from endpoints
4. Click "Create Test Data" to create a sample control test

## API Services

The frontend includes these service layers:

### Authentication Service (`/src/services/auth.ts`)
- JWT token management
- Login/logout functionality
- Token refresh handling

### API Service (`/src/services/api.ts`)
- Base HTTP client with authentication
- Automatic token refresh on 401 errors
- Request timeout handling
- Error handling

### Audit Service (`/src/services/audit.ts`)
- Control tests CRUD operations
- Workpapers management
- Evidence file uploads

## Testing Different Endpoints

### Manual Testing with curl

1. **Get JWT Token**:
```bash
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "your_username", "password": "your_password"}'
```

2. **Test Authenticated Endpoint**:
```bash
curl http://localhost:8000/api/audit/control-tests/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Frontend Testing

The API Test Card on the dashboard provides:
- Visual feedback for API connection status
- Ability to test authentication
- Create test data functionality
- View raw API responses

## Common Issues

### CORS Errors
If you see CORS errors in the browser console:
1. Check your Django settings for `CORS_ALLOWED_ORIGINS`
2. Add your frontend URL: `CORS_ALLOWED_ORIGINS = ["http://localhost:3000", "http://localhost:3001"]`

### 401 Unauthorized
- Token may be expired - try logging in again
- Check if the user exists in the backend

### Connection Refused
- Ensure backend is running on http://localhost:8000
- Check Docker containers are up: `docker ps`

## Production Deployment

1. Update `.env.production` with your production API URL
2. Build the frontend: `pnpm build`
3. Deploy the `dist` folder to your static hosting service
4. Ensure your backend CORS settings include your production domain

## Next Steps

1. Implement real data fetching in components (replace mock data)
2. Add error boundaries for better error handling
3. Implement loading states for async operations
4. Add API response caching where appropriate
5. Set up API request interceptors for common headers