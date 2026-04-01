import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Store } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card } from '@/app/components/ui/card';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SignupProps {
  mode?: UserRole;
}

export function Signup({ mode = 'buyer' }: SignupProps) {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    shopName: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSellerMode = mode === 'seller';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name) {
      toast.error('Please enter your name');
      return;
    }

    if (!formData.email) {
      toast.error('Please enter your email');
      return;
    }

    if (isSellerMode && !formData.shopName) {
      toast.error('Please enter your shop name');
      return;
    }

    if (!formData.password) {
      toast.error('Please enter your password');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    console.log('[Signup] payload', { name: formData.name, email: formData.email });

    try {
      const user = await signup(
        formData.email,
        formData.password,
        formData.name,
        mode,
        formData.shopName
      );

      toast.success('Account created successfully!', {
        description: isSellerMode ? 'Your seller account is ready.' : 'Welcome to ArtisanConnect!',
      });
      navigate(user.role === 'seller' ? '/seller/dashboard' : '/');
    } catch (error: any) {
      console.error('[Signup] error', error);
      toast.error('Signup failed', {
        description: error.message || 'Please try again',
      });
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
          <h1 className="text-2xl font-bold">{isSellerMode ? 'Create Seller Account' : 'Create Account'}</h1>
          <p className="text-gray-600 mt-2">
            {isSellerMode ? 'Open your storefront and start listing handmade products' : 'Join ArtisanConnect and discover handmade treasures'}
          </p>
        </div>

        {!isSellerMode && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-900">Want to sell handmade products?</p>
            <p className="mt-1 text-sm text-amber-800">Create a seller account and open your storefront.</p>
            <Link
              to="/seller/signup"
              className="mt-3 inline-flex items-center text-sm font-semibold text-amber-700 hover:text-amber-800"
            >
              <Store className="mr-2 h-4 w-4" />
              Create seller account
            </Link>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="pl-10"
                required
              />
            </div>
          </div>

          {isSellerMode && (
            <div>
              <label className="block text-sm font-medium mb-2">Shop Name</label>
              <div className="relative">
                <Store className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  name="shopName"
                  placeholder="Threads of Tradition"
                  value={formData.shopName}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
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
            <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Terms & Conditions */}
          <label className="flex items-start">
            <input type="checkbox" className="rounded mt-1 mr-2" required />
            <span className="text-sm">
              I agree to the{' '}
              <Link to="#" className="text-orange-600 hover:text-orange-700">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="#" className="text-orange-600 hover:text-orange-700">
                Privacy Policy
              </Link>
            </span>
          </label>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primaryBlack"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
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

        {/* Social Signup */}
        <Button variant="outline" className="w-full mb-4" onClick={() => {
          console.info('Google signup coming soon');
          toast('Google signup coming soon');
        }}>
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
          </svg>
          Continue with Google
        </Button>

        {/* Login Link */}
        <p className="text-center text-gray-600">
          Already have an account?{' '}
          <Link to={isSellerMode ? '/seller/login' : '/login'} className="text-orange-600 hover:text-orange-700 font-semibold">
            {isSellerMode ? 'Seller login' : 'Log in'}
          </Link>
        </p>
      </Card>
    </div>
  );
}
