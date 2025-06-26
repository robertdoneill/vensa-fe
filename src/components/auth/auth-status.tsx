import { LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth/auth-context';

export function AuthStatus() {
  const { isAuthenticated, user, logout, token } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Authentication Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Status:</span>
          <Badge variant={isAuthenticated ? 'default' : 'destructive'}>
            {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          </Badge>
        </div>
        
        {token && (
          <div className="space-y-2">
            <span className="text-sm font-medium">Token (first 50 chars):</span>
            <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
              {token.substring(0, 50)}...
            </p>
          </div>
        )}

        {user && (
          <div className="space-y-2">
            <span className="text-sm font-medium">User Info:</span>
            <div className="text-sm space-y-1">
              <p>Username: {user.username}</p>
              <p>Email: {user.email}</p>
              <p>Name: {user.first_name} {user.last_name}</p>
            </div>
          </div>
        )}

        {isAuthenticated && (
          <Button 
            onClick={logout} 
            variant="outline" 
            size="sm"
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        )}
      </CardContent>
    </Card>
  );
}