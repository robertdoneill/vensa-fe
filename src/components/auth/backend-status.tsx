import { useState } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { API_BASE_URL } from '@/lib/api/config';

export function BackendStatus() {
  const [isChecking, setIsChecking] = useState(false);
  const [status, setStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');
  const [lastChecked, setLastChecked] = useState<string | null>(null);

  const checkBackendStatus = async () => {
    setIsChecking(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/schema/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        setStatus('connected');
      } else {
        setStatus('disconnected');
      }
    } catch (error) {
      setStatus('disconnected');
    } finally {
      setIsChecking(false);
      setLastChecked(new Date().toLocaleTimeString());
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'default';
      case 'disconnected': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = () => {
    if (isChecking) return <RefreshCw className="h-4 w-4 animate-spin" />;
    return status === 'connected' ? 
      <Wifi className="h-4 w-4" /> : 
      <WifiOff className="h-4 w-4" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Backend Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>API Endpoint:</span>
          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
            {API_BASE_URL}
          </code>
        </div>
        
        <div className="flex items-center justify-between">
          <span>Status:</span>
          <Badge variant={getStatusColor()}>
            {status === 'unknown' ? 'Unknown' : 
             status === 'connected' ? 'Connected' : 'Disconnected'}
          </Badge>
        </div>

        {lastChecked && (
          <div className="flex items-center justify-between">
            <span>Last Checked:</span>
            <span className="text-sm text-muted-foreground">{lastChecked}</span>
          </div>
        )}

        <Button 
          onClick={checkBackendStatus} 
          disabled={isChecking}
          variant="outline" 
          size="sm"
          className="w-full"
        >
          {isChecking ? 'Checking...' : 'Check Connection'}
        </Button>

        {status === 'disconnected' && (
          <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded border border-amber-200">
            <strong>Backend not accessible:</strong>
            <ul className="mt-1 ml-4 list-disc text-xs">
              <li>Make sure your Django backend is running</li>
              <li>Check that it's accessible at {API_BASE_URL}</li>
              <li>Verify CORS settings allow frontend connections</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}