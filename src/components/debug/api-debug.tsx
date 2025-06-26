import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/lib/api/config';

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
      // First, check if there are any workpapers available
      console.log('Checking for existing workpapers...');
      const workpapersResponse = await fetch(`${API_BASE_URL}/api/audit/workpapers/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      let workpaperId = null;
      if (workpapersResponse.ok) {
        const workpapers = await workpapersResponse.json();
        console.log('Available workpapers:', workpapers);
        
        if (workpapers.length > 0) {
          workpaperId = workpapers[0].id;
          console.log(`Using existing workpaper ID: ${workpaperId}`);
        } else {
          // Try to create a workpaper first
          console.log('No workpapers found, creating one...');
          const createWorkpaperResponse = await fetch(`${API_BASE_URL}/api/audit/workpapers/`, {
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

          if (createWorkpaperResponse.ok) {
            const newWorkpaper = await createWorkpaperResponse.json();
            workpaperId = newWorkpaper.id;
            console.log(`Created new workpaper ID: ${workpaperId}`);
          } else {
            const error = await createWorkpaperResponse.text();
            console.log('Failed to create workpaper:', error);
            toast.error('Failed to create workpaper for testing');
            return;
          }
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

      const response = await fetch(`${API_BASE_URL}/api/audit/control-tests/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(controlTestData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Control test creation failed:', errorText);
        try {
          const errorJson = JSON.parse(errorText);
          toast.error(`Error: ${JSON.stringify(errorJson)}`);
        } catch {
          toast.error(`Error: ${response.status} - ${errorText}`);
        }
      } else {
        const result = await response.json();
        toast.success('Control test created successfully!');
        console.log('Success:', result);
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