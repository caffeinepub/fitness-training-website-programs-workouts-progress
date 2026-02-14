import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function RequireLoginNotice() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>Please sign in to access this feature</span>
        <Button onClick={login} disabled={isLoggingIn} size="sm" className="ml-4">
          {isLoggingIn ? 'Signing in...' : 'Sign In'}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
