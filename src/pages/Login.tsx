import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Store } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card } from '@/app/components/ui/card';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface LoginProps {
  mode?: UserRole;
}

export function Login({ mode = 'buyer' }: LoginProps) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSellerMode = mode === 'seller';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Login] form submitted');
    setIsSubmitting(true);

    // Basic validation
    if (!email) {
      toast.error('Please enter your email');
      setIsSubmitting(false);
      return;
    }

    if (!password) {
      toast.error('Please enter your password');
      setIsSubmitting(false);
      return;
    }

    console.log('[Login] calling API', { email });

    try {
      const user = await login(email, password, mode);

      toast.success('Login successful!', {
        description: isSellerMode ? 'Welcome back to your seller dashboard!' : 'Welcome back!',
      });
      navigate(user.role === 'seller' ? '/seller/dashboard' : '/');
    } catch (error: any) {
      console.error('[Login] API error', error);
      const description = error.message || 'Login failed';
      toast.error('Login failed', { description });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          {isSellerMode ? (
            <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
              <Store className="h-3.5 w-3.5" />
              Seller Access
            </div>
          ) : null}
          <h1 className="text-2xl font-bold">{isSellerMode ? 'Seller Login' : 'Welcome Back'}</h1>
          <p className="text-gray-600 mt-2">
            {isSellerMode ? 'Access your shop dashboard and manage products' : 'Login to your ArtisanConnect account'}
          </p>
        </div>

        {!isSellerMode && (
          <div className="mb-6 rounded-xl border border-orange-200 bg-orange-50 p-4">
            <p className="text-sm font-semibold text-orange-900">Are you a seller?</p>
            <p className="mt-1 text-sm text-orange-800">Login to manage your shop, products, and orders.</p>
            <Link
              to="/seller/login"
              className="mt-3 inline-flex items-center text-sm font-semibold text-orange-700 hover:text-orange-800"
            >
              <Store className="mr-2 h-4 w-4" />
              Go to seller login
            </Link>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="rounded mr-2" />
              <span className="text-sm">Remember me</span>
            </label>
            <Link to="#" className="text-sm text-orange-600 hover:text-orange-700">
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primaryBlack"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">OR</span>
          </div>
        </div>

        {/* Social Login */}
        <Button variant="outline" className="w-full mb-4" onClick={() => {
          console.info('Google login coming soon');
          toast('Google login coming soon');
        }}>
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
          </svg>
          Continue with Google
        </Button>

        {/* Sign Up Link */}
        <p className="text-center text-gray-600">
          Don't have an account?{' '}
          <Link to={isSellerMode ? '/seller/signup' : '/signup'} className="text-orange-600 hover:text-orange-700 font-semibold">
            {isSellerMode ? 'Create seller account' : 'Sign up'}
          </Link>
        </p>

        {isSellerMode && (
          <p className="mt-3 text-center text-sm text-gray-600">
            Shopping as a customer?{' '}
            <Link to="/login" className="font-semibold text-orange-600 hover:text-orange-700">
              Buyer login
            </Link>
          </p>
        )}

        {/* Demo Notice */}
        <div className="mt-6 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
          <p className="font-semibold mb-1">Demo Credentials:</p>
          {isSellerMode ? (
            <>
              <p>Email: seller@example.com</p>
              <p>Password: seller123</p>
            </>
          ) : (
            <>
              <p>Email: demo@example.com</p>
              <p>Password: demo123</p>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
