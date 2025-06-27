import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { API_BASE_URL, API_ENDPOINTS } from '@/lib/api/config';
import { apiClient } from '@/lib/api/client';

export function ApiDebug() {
  const [loading, setLoading] = useState(false);
  const [schemaData, setSchemaData] = useState<any>(null);

  const fetchSchema = async () => {
    setLoading(true);
    try {
      // Get the OpenAPI schema to see what endpoints expect
      const response = await fetch(`${API_BASE_URL}/api/schema/`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        const schema = await response.json();
        setSchemaData(schema);
        toast.success('API Schema fetched successfully');
      } else {
        toast.error('Failed to fetch API schema');
      }
    } catch (error) {
      console.error('Schema fetch error:', error);
      toast.error('Error fetching schema');
    } finally {
      setLoading(false);
    }
  };

  const testControlTestEndpoint = async () => {
    try {
      // Use our proper API client that handles token refresh
      console.log('Checking for existing workpapers...');
      
      let workpapers = [];
      try {
        workpapers = await apiClient.get(API_ENDPOINTS.audit.workpapers);
        console.log('Available workpapers:', workpapers);
      } catch (error) {
        console.log('Error fetching workpapers:', error);
      }

      let workpaperId = null;
      if (workpapers.length > 0) {
        workpaperId = workpapers[0].id;
        console.log(`Using existing workpaper ID: ${workpaperId}`);
      } else {
        // Try to create a workpaper first - let's see what error we get
        console.log('No workpapers found, creating one...');
        try {
          const workpaperData = {
            name: 'Test Workpaper',
            description: 'Auto-created for testing'
          };
          console.log('Sending workpaper data:', workpaperData);
          
          const newWorkpaper = await apiClient.post(API_ENDPOINTS.audit.workpapers, workpaperData);
          workpaperId = newWorkpaper.id;
          console.log(`Created new workpaper ID: ${workpaperId}`);
        } catch (error: any) {
          console.log('Failed to create workpaper:', error);
          
          // Try to get the actual error details
          try {
            const response = await fetch(`${API_BASE_URL}/api/audit/workpapers/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
              },
              body: JSON.stringify({
                name: 'Test Workpaper',
                description: 'Auto-created for testing'
              })
            });
            
            if (!response.ok) {
              const errorText = await response.text();
              console.log('Workpaper creation error details:', errorText);
              toast.error(`Workpaper error: ${errorText}`);
            }
          } catch (debugError) {
            console.log('Debug error:', debugError);
          }
          
          toast.error('Failed to create workpaper for testing');
          return;
        }
      }

      // Now try to create the control test with all required fields
      const controlTestData = {
        name: 'Test Ctrl',  // Max 20 chars
        objective: 'Test control objective for validation',
        frequency: 'w',  // Weekly
        criteria: 'Test passes when all validations are met',
        workpaper: workpaperId
      };

      console.log('Creating control test with data:', controlTestData);

      try {
        const result = await apiClient.post(API_ENDPOINTS.audit.controlTests, controlTestData);
        toast.success('Control test created successfully!');
        console.log('Success:', result);
      } catch (error: any) {
        console.log('Control test creation failed:', error);
        toast.error(`Error: ${error.message}`);
      }
    } catch (error: any) {
      console.error('Test error:', error);
      toast.error(`Request failed: ${error.message}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Debug Tools</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={fetchSchema} disabled={loading}>
            Fetch API Schema
          </Button>
          <Button onClick={testControlTestEndpoint} variant="outline">
            Test Control Creation
          </Button>
        </div>

        {schemaData && (
          <div className="space-y-2">
            <h4 className="font-semibold">API Schema Info:</h4>
            <div className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-96">
              <pre>
                {JSON.stringify({
                  controlTestEndpoint: schemaData?.paths?.['/api/audit/control-tests/']?.post?.requestBody?.content?.['application/json']?.schema,
                  controlTestSchema: schemaData?.components?.schemas?.ControlTest,
                  availableSchemas: Object.keys(schemaData?.components?.schemas || {}),
                }, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}