import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from './ui/button';
import { FileText, List } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function Header() {
  const navigate = useNavigate();
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button
              onClick={() => navigate({ to: '/' })}
              className="flex items-center gap-3 text-xl font-bold text-foreground hover:text-primary transition-colors"
            >
              <img 
                src="/assets/generated/md-suhel-logo.dim_256x256.png" 
                alt="MD SUHEL Logo" 
                className="h-10 w-10 object-contain"
              />
              <span>MD SUHEL</span>
            </button>
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => navigate({ to: '/' })}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <FileText className="h-4 w-4" />
                Apply for Certificate
              </button>
              <button
                onClick={() => navigate({ to: '/my-applications' })}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <List className="h-4 w-4" />
                My Applications
              </button>
            </nav>
          </div>
          <Button
            onClick={handleAuth}
            disabled={isLoggingIn}
            variant={isAuthenticated ? 'outline' : 'default'}
            size="sm"
          >
            {isLoggingIn ? 'Signing in...' : isAuthenticated ? 'Sign Out' : 'Sign In'}
          </Button>
        </div>
      </div>
    </header>
  );
}
