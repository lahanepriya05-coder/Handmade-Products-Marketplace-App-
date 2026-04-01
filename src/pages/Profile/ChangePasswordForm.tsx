import React, { useContext } from 'react';
import { ChangePasswordData } from '@/types';
import { ProfileContext } from '@/contexts/ProfileContext';
import { useForm } from '@/hooks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { validationRules, validateForm } from '@/utils/validators';
import { Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ChangePasswordFormProps {
  loading: boolean;
  onSuccess: (message: string) => void;
}

/**
 * ChangePasswordForm - Form for changing user password
 * Features:
 * - Current password verification
 * - New password validation
 * - Password strength requirements
 * - Confirmation matching
 * - Security best practices
 */
const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  loading,
  onSuccess,
}) => {
  const context = useContext(ProfileContext);

  if (!context) {
    return <p className="text-red-600">Context not available</p>;
  }

  const { changePassword } = context;

  // Form validation rules
  const passwordRules = {
    currentPassword: [validationRules.required()],
    newPassword: [
      validationRules.required(),
      validationRules.minLength(8),
    ],
    confirmPassword: [
      validationRules.required(),
      validationRules.match('newPassword'),
    ],
  };

  // Initialize form
  const form = useForm({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    onSubmit: async (values) => {
      try {
        const data: ChangePasswordData = {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        };

        await changePassword(data);
        form.resetForm();
        onSuccess('Password changed successfully! Please log in again.');
      } catch (error) {
        console.error('Error changing password:', error);
        // Error is handled by context
      }
    },
    validate: (values) => validateForm(values, passwordRules),
    validateOnChange: true,
    validateOnBlur: true,
  });

  return (
    <form onSubmit={form.handleSubmit} className="max-w-2xl mx-auto space-y-8">
      {/* Security Info Card */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex gap-4">
          <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900">Password Security</h3>
            <ul className="mt-2 space-y-1 text-sm text-blue-800">
              <li>✓ At least 8 characters long</li>
              <li>✓ Mix of uppercase and lowercase letters</li>
              <li>✓ Include numbers and special characters</li>
              <li>✓ Unique and easy to remember</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Current Password */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Current Password</h3>
        <div>
          <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
            Current Password
          </Label>
          <Input
            id="currentPassword"
            name="currentPassword"
            type="password"
            placeholder="Enter your current password"
            value={form.values.currentPassword}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            disabled={loading}
            className={form.errors.currentPassword ? 'border-red-500' : ''}
          />
          {form.errors.currentPassword && (
            <p className="mt-1 text-sm text-red-600">{form.errors.currentPassword}</p>
          )}
          <p className="mt-2 text-xs text-gray-500">
            We need your current password to verify your identity
          </p>
        </div>
      </Card>

      {/* New Password */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">New Password</h3>
        <div className="space-y-5">
          {/* New Password Field */}
          <div>
            <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
              New Password
            </Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="Enter your new password"
              value={form.values.newPassword}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              disabled={loading}
              className={form.errors.newPassword ? 'border-red-500' : ''}
            />
            {form.errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{form.errors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirm New Password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your new password"
              value={form.values.confirmPassword}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              disabled={loading}
              className={form.errors.confirmPassword ? 'border-red-500' : ''}
            />
            {form.errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{form.errors.confirmPassword}</p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
            <p className="font-medium text-gray-900">Password must contain:</p>
            <div className="space-y-2">
              <div className={form.values.newPassword.length >= 8 ? 'text-green-600' : 'text-gray-600'}>
                {form.values.newPassword.length >= 8 ? '✓' : '○'} At least 8 characters
              </div>
              <div className={/[A-Z]/.test(form.values.newPassword) ? 'text-green-600' : 'text-gray-600'}>
                {/[A-Z]/.test(form.values.newPassword) ? '✓' : '○'} One uppercase letter
              </div>
              <div className={/[a-z]/.test(form.values.newPassword) ? 'text-green-600' : 'text-gray-600'}>
                {/[a-z]/.test(form.values.newPassword) ? '✓' : '○'} One lowercase letter
              </div>
              <div className={/[0-9]/.test(form.values.newPassword) ? 'text-green-600' : 'text-gray-600'}>
                {/[0-9]/.test(form.values.newPassword) ? '✓' : '○'} One number
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Important Notice */}
      <Alert className="border-amber-200 bg-amber-50">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          After changing your password, you'll be logged out and need to sign in again with your new password for security.
        </AlertDescription>
      </Alert>

      {/* Form Actions */}
      <div className="flex gap-4 justify-end pb-8">
        <Button
          type="button"
          variant="outline"
          onClick={() => form.resetForm()}
          disabled={loading}
        >
          Reset
        </Button>
        <Button
          type="submit"
          disabled={loading || form.isSubmitting}
          className="min-w-[140px]"
        >
          {loading || form.isSubmitting ? (
            <>
              <span className="inline-block animate-spin mr-2">⟳</span>
              Changing...
            </>
          ) : (
            'Change Password'
          )}
        </Button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
