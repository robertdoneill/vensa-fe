import { createFileRoute, redirect } from '@tanstack/react-router';
import { LoginForm } from '@/components/auth/login-form';
import { authService } from '@/lib/api/auth';

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    // Redirect to dashboard if already authenticated
    if (authService.isAuthenticated()) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  return <LoginForm />;
}