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
import { config } from "@/config"
import { AuthService } from "@/services/auth"
import { AuditService } from "@/services/audit"

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
    setIsAuthenticated(AuthService.isAuthenticated())
  }, [])

  const runApiTests = async () => {
    setIsLoading(true)
    setTestResults([])

    const tests: ApiTestResult[] = []

    // Test 1: Check API URL
    tests.push({
      endpoint: config.api.url,
      status: 'pending',
      message: 'Checking API configuration...'
    })
    setTestResults([...tests])

    // Test 2: Check authentication
    if (isAuthenticated) {
      tests.push({
        endpoint: '/token/verify',
        status: 'pending',
        message: 'Verifying authentication token...'
      })
      setTestResults([...tests])
    }

    // Test 3: Fetch control tests
    tests.push({
      endpoint: '/audit/control-tests/',
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
        message: `API URL configured: ${config.api.url}`
      }
      setTestResults([...tests])

      // Test authentication if logged in
      if (isAuthenticated) {
        try {
          // Simple check - try to fetch control tests which requires auth
          await AuditService.getControlTests()
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
        const controlTests = await AuditService.getControlTests()
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
      const testControl = await AuditService.createControlTest({
        name: `Test Control ${new Date().toISOString()}`,
        description: "Test control created from frontend",
        frequency: 'weekly'
      })
      
      toast.success('Test control created!', {
        description: `Created control: ${testControl.name}`
      })
      
      // Re-run tests to see the new data
      runApiTests()
    } catch (error: any) {
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
              Test connection to backend at {config.api.url}
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
          <h4 className="text-sm font-semibold mb-2">Quick Backend Setup:</h4>
          <ol className="text-sm text-muted-foreground space-y-1">
            <li>1. Ensure backend is running: <code className="text-xs bg-muted px-1 rounded">docker-compose -f docker-compose.local.yml up</code></li>
            <li>2. Create superuser: <code className="text-xs bg-muted px-1 rounded">docker-compose -f docker-compose.local.yml exec web python manage.py createsuperuser</code></li>
            <li>3. Check API docs: <a href="http://localhost:8000/api/schema/redoc/" target="_blank" rel="noopener noreferrer" className="underline">http://localhost:8000/api/schema/redoc/</a></li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}