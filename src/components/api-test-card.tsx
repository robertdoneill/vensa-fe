import * as React from "react"
import { toast } from "sonner"
import { 
  IconApi, 
  IconCheck, 
  IconX, 
  IconLoader2,
  IconDatabase,
  IconRefresh
} from "@tabler/icons-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/api/config"
import { apiClient } from "@/lib/api/client"
import { authService } from "@/lib/api/auth"
import { evidenceApi } from "@/lib/api/evidence"

interface ApiTestResult {
  endpoint: string
  status: 'pending' | 'success' | 'error'
  message?: string
  data?: any
}

export function ApiTestCard() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [testResults, setTestResults] = React.useState<ApiTestResult[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated())
  }, [])

  const runApiTests = async () => {
    setIsLoading(true)
    setTestResults([])

    const tests: ApiTestResult[] = []

    // Test 1: Check API URL
    tests.push({
      endpoint: API_BASE_URL,
      status: 'pending',
      message: 'Checking API configuration...'
    })
    setTestResults([...tests])

    // Test 2: Check authentication
    if (isAuthenticated) {
      tests.push({
        endpoint: API_ENDPOINTS.auth.verify,
        status: 'pending',
        message: 'Verifying authentication token...'
      })
      setTestResults([...tests])
    }

    // Test 3: Fetch control tests
    tests.push({
      endpoint: API_ENDPOINTS.audit.controlTests,
      status: 'pending',
      message: 'Fetching control tests...'
    })
    setTestResults([...tests])

    // Run actual tests
    try {
      // Update test 1 - API URL is configured
      tests[0] = {
        ...tests[0],
        status: 'success',
        message: `API URL configured: ${API_BASE_URL}`
      }
      setTestResults([...tests])

      // Test authentication if logged in
      if (isAuthenticated) {
        try {
          // Verify token using our new API
          await authService.verifyToken()
          tests[1] = {
            ...tests[1],
            status: 'success',
            message: 'Authentication token is valid'
          }
        } catch (error) {
          tests[1] = {
            ...tests[1],
            status: 'error',
            message: 'Authentication token is invalid or expired'
          }
        }
        setTestResults([...tests])
      }

      // Test control tests endpoint
      try {
        const controlTests = await evidenceApi.getControlTests()
        tests[tests.length - 1] = {
          ...tests[tests.length - 1],
          status: 'success',
          message: `Found ${controlTests.length} control tests`,
          data: controlTests
        }
      } catch (error: any) {
        tests[tests.length - 1] = {
          ...tests[tests.length - 1],
          status: 'error',
          message: error.message || 'Failed to fetch control tests'
        }
      }
      setTestResults([...tests])

    } catch (error: any) {
      toast.error('API tests failed', {
        description: error.message
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createTestData = async () => {
    try {
      console.log('Creating control test with proper required fields...')
      
      // First get or create a workpaper
      let workpapers = [];
      try {
        workpapers = await apiClient.get(API_ENDPOINTS.audit.workpapers);
      } catch (error) {
        console.log('Error fetching workpapers:', error);
      }

      let workpaperId = null;
      if (workpapers.length > 0) {
        workpaperId = workpapers[0].id;
        console.log('Using existing workpaper:', workpaperId);
      } else {
        // Create a workpaper first
        console.log('Creating workpaper...');
        const workpaperData = {
          title: 'Test Workpaper',
          description: 'Auto-created for testing',
          period_start: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
          period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // One year from now
          status: 'draft'
        };
        console.log('Sending workpaper data:', workpaperData);
        try {
          const newWorkpaper = await apiClient.post(API_ENDPOINTS.audit.workpapers, workpaperData);
          workpaperId = newWorkpaper.id;
          console.log('Created workpaper:', workpaperId);
        } catch (error: any) {
          console.log('Workpaper creation error details:', error.response?.data || error);
          toast.error('Failed to create workpaper for testing');
          return;
        }
      }
      
      const testData = {
        name: 'Test Ctrl',  // Max 20 characters
        objective: 'Test control objective for validation',
        frequency: 'w',  // Weekly
        criteria: 'Test passes when all validations are met',
        workpaper: workpaperId
      }
      
      console.log('Sending control test data:', testData)
      
      const testControl = await apiClient.post(API_ENDPOINTS.audit.controlTests, testData)
      
      toast.success('Test control created!', {
        description: `Created control: ${testControl.name}`
      })
      
      // Re-run tests to see the new data
      runApiTests()
    } catch (error: any) {
      console.error('Full error:', error)
      toast.error('Failed to create test data', {
        description: error.message
      })
    }
  }

  const getStatusIcon = (status: ApiTestResult['status']) => {
    switch (status) {
      case 'success':
        return <IconCheck className="h-4 w-4 text-green-600" />
      case 'error':
        return <IconX className="h-4 w-4 text-red-600" />
      case 'pending':
        return <IconLoader2 className="h-4 w-4 animate-spin text-blue-600" />
    }
  }

  const getStatusBadge = (status: ApiTestResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">Success</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      case 'pending':
        return <Badge variant="secondary">Testing...</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <IconApi className="h-5 w-5" />
              API Connection Test
            </CardTitle>
            <CardDescription>
              Test connection to backend at {API_BASE_URL}
            </CardDescription>
          </div>
          <Badge variant={isAuthenticated ? "default" : "secondary"}>
            {isAuthenticated ? "Authenticated" : "Not Authenticated"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isAuthenticated && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              You are not authenticated. <a href="/login" className="underline">Login</a> to test authenticated endpoints.
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={runApiTests} disabled={isLoading}>
            <IconRefresh className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Run API Tests
          </Button>
          {isAuthenticated && (
            <Button variant="outline" onClick={createTestData} disabled={isLoading}>
              <IconDatabase className="h-4 w-4 mr-2" />
              Create Test Data
            </Button>
          )}
        </div>

        {testResults.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Test Results:</h4>
            {testResults.map((result, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                {getStatusIcon(result.status)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{result.endpoint}</p>
                    {getStatusBadge(result.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{result.message}</p>
                  {result.data && (
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer text-blue-600">View Response</summary>
                      <pre className="text-xs mt-2 p-2 bg-background rounded overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 border-t">
          <h4 className="text-sm font-semibold mb-2">Backend Information:</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Using AWS backend at: <code className="text-xs bg-muted px-1 rounded">{API_BASE_URL}</code></p>
            <p>API Documentation: <a href={`${API_BASE_URL}/api/schema/redoc/`} target="_blank" rel="noopener noreferrer" className="underline">{API_BASE_URL}/api/schema/redoc/</a></p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}