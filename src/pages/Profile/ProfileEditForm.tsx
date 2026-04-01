import React, { useState, useContext } from 'react';
import { User, ProfileUpdateData } from '@/types';
import { ProfileContext } from '@/contexts/ProfileContext';
import { useForm } from '@/hooks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { validators, validationRules, validateForm } from '@/utils/validators';
import { uploadProfileImage } from '@/services/userService';
import { Upload, X, Loader2 } from 'lucide-react';

interface ProfileEditFormProps {
  user: User;
  loading: boolean;
  onSuccess: (message: string) => void;
  onCancel: () => void;
}

/**
 * ProfileEditForm - Form for editing user profile
 * Features:
 * - Edit name, phone, address
 * - Profile image upload with preview
 * - Form validation
 * - Loading states
 * - Error handling
 */
const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  user,
  loading,
  onSuccess,
  onCancel,
}) => {
  const context = useContext(ProfileContext);
  const [imagePreview, setImagePreview] = useState<string | null>(user.avatar || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  if (!context) {
    return <p className="text-red-600">Context not available</p>;
  }

  const { updateProfile } = context;

  // Form validation rules
  const validationRules_form = {
    name: [validationRules.required(), validationRules.minLength(2)],
    phone: [validationRules.minLength(10)],
  };

  // Initialize form
  const form = useForm({
    initialValues: {
      name: user.name || '',
      phone: user.phone || '',
      street: user.address?.street || '',
      city: user.address?.city || '',
      state: user.address?.state || '',
      postalCode: user.address?.postalCode || '',
      pincode: (user.address as any)?.pincode || '',
      country: user.address?.country || 'India',
    },
    onSubmit: async (values) => {
      try {
        let avatarUrl = user.avatar;

        // Upload image if changed
        if (imageFile) {
          setImageLoading(true);
          avatarUrl = await uploadProfileImage(imageFile);
          setImageLoading(false);
        }

        const updateData: ProfileUpdateData = {
          name: values.name,
          phone: values.phone || undefined,
          avatar: avatarUrl,
          address: {
            street: values.street,
            city: values.city,
            state: values.state,
            postalCode: values.postalCode,
            pincode: values.pincode || undefined,
            country: values.country,
          },
        };

        await updateProfile(updateData);
        onSuccess('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating profile:', error);
        // Error is handled by context
      }
    },
    validate: (values) => validateForm(values, validationRules_form),
    validateOnChange: true,
    validateOnBlur: true,
  });

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      form.setFieldError('avatar', 'Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      form.setFieldError('avatar', 'Image must be less than 5MB');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Remove image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <form onSubmit={form.handleSubmit} className="max-w-2xl mx-auto space-y-8">
      {/* Profile Image Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h3>
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Avatar Preview */}
          <Avatar className="h-24 w-24">
            <AvatarImage src={imagePreview || undefined} alt={user.name} />
            <AvatarFallback>
              {user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Upload Controls */}
          <div className="flex-1">
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="image-upload"
                  className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
                >
                  <Upload className="w-4 h-4" />
                  <span className="font-medium">
                    {imageFile ? 'Change Image' : 'Upload Image'}
                  </span>
                </Label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={imageLoading}
                  className="hidden"
                />
              </div>

              {imageFile && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{imageFile.name}</span>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={imageLoading}
                    className="p-1 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              )}

              <p className="text-xs text-gray-500">
                PNG, JPG or GIF. Max 5MB.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Personal Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
        <div className="space-y-5">
          {/* Name Field */}
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={form.values.name}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              disabled={loading || imageLoading}
              className={form.errors.name ? 'border-red-500' : ''}
            />
            {form.errors.name && (
              <p className="mt-1 text-sm text-red-600">{form.errors.name}</p>
            )}
          </div>

          {/* Email Field (Read-only) */}
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={user.email}
              disabled
              className="bg-gray-50 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">
              Email cannot be changed for security reasons
            </p>
          </div>

          {/* Phone Field */}
          <div>
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Phone Number
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={form.values.phone}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              disabled={loading || imageLoading}
              className={form.errors.phone ? 'border-red-500' : ''}
            />
            {form.errors.phone && (
              <p className="mt-1 text-sm text-red-600">{form.errors.phone}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Address Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Address</h3>
        <div className="space-y-5">
          {/* Street */}
          <div>
            <Label htmlFor="street" className="text-sm font-medium text-gray-700">
              Street Address
            </Label>
            <Input
              id="street"
              name="street"
              type="text"
              placeholder="House no., street name"
              value={form.values.street}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              disabled={loading || imageLoading}
            />
          </div>

          {/* City and State */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                City
              </Label>
              <Input
                id="city"
                name="city"
                type="text"
                placeholder="City"
                value={form.values.city}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                disabled={loading || imageLoading}
              />
            </div>
            <div>
              <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                State
              </Label>
              <Input
                id="state"
                name="state"
                type="text"
                placeholder="State"
                value={form.values.state}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                disabled={loading || imageLoading}
              />
            </div>
          </div>

          {/* Postal Code, Pincode and Country */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
                Postal Code
              </Label>
              <Input
                id="postalCode"
                name="postalCode"
                type="text"
                placeholder="Postal code"
                value={form.values.postalCode}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                disabled={loading || imageLoading}
              />
            </div>
            <div>
              <Label htmlFor="pincode" className="text-sm font-medium text-gray-700">
                Pincode
              </Label>
              <Input
                id="pincode"
                name="pincode"
                type="text"
                placeholder="Pincode (optional)"
                value={form.values.pincode}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                disabled={loading || imageLoading}
              />
            </div>
            <div>
              <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                Country
              </Label>
              <Input
                id="country"
                name="country"
                type="text"
                placeholder="Country"
                value={form.values.country}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                disabled={loading || imageLoading}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Form Actions */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading || imageLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading || imageLoading || form.isSubmitting}
          className="min-w-[140px]"
        >
          {loading || imageLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProfileEditForm;
