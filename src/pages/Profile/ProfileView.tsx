import React from 'react';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatPhone, formatAddress } from '@/utils/formatters';
import { Mail, Phone, MapPin, Calendar, Shield, Edit2 } from 'lucide-react';

interface ProfileViewProps {
  user: User;
  onEdit: () => void;
}

/**
 * ProfileView - Read-only display of user profile
 * Shows all user information in a formatted, read-only view
 * Allows user to transition to edit mode
 */
const ProfileView: React.FC<ProfileViewProps> = ({ user, onEdit }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Profile Header Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-24"></div>
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 relative z-10">
            {/* Avatar */}
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-lg">
                {user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Header Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="capitalize">
                  {user.role}
                </Badge>
                <Badge variant="outline" className="uppercase text-green-600">
                  Active
                </Badge>
                <span className="text-sm text-gray-600">
                  Member since {user.createdAt ? formatDate(user.createdAt, 'MMM yyyy') : 'N/A'}
                </span>
              </div>
            </div>

            {/* Edit Button */}
            <Button onClick={onEdit} className="w-full sm:w-auto">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </Card>

      {/* Basic Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
        <div className="space-y-4">
          {/* Email */}
          <div className="flex items-start gap-4">
            <Mail className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <p className="text-gray-900 break-all">{user.email || 'Not added'}</p>
              <p className="text-xs text-gray-500 mt-1">
                This email is used for login and cannot be changed
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-4">
            <Phone className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <p className="text-gray-900">
                {user.phone ? formatPhone(user.phone) : 'Not added'}
              </p>
            </div>
          </div>

          {/* Member since */}
          <div className="flex items-start gap-4">
            <Calendar className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Member Since
              </label>
              <p className="text-gray-900">
                {user.createdAt ? formatDate(user.createdAt, 'PPP') : 'Not added'}
              </p>
            </div>
          </div>

          {/* Account status */}
          <div className="flex items-start gap-4">
            <Shield className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Status
              </label>
              <p className="text-gray-900">Active</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Address Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Address</h2>
        <div className="flex items-start gap-4">
          <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
          <div className="flex-1">
            {user.address ? (
              <div className="space-y-1 text-gray-900">
                <p>{formatAddress(user.address)}</p>
                <p>
                  Phone: {user.phone ? formatPhone(user.phone) : 'Not added'}
                </p>
                <p>Country: {user.address.country || 'Not added'}</p>
              </div>
            ) : (
              <p className="text-gray-600">No address saved</p>
            )}
          </div>
        </div>
      </Card>

      {/* Account Security */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Account Security
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Password</p>
              <p className="text-sm text-gray-600">Change your password regularly</p>
            </div>
            <Button variant="outline" size="sm">
              Change Password
            </Button>
          </div>
          <div className="border-t pt-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Last Updated</p>
              <p className="text-sm text-gray-600">
                {formatDate(user.updatedAt, 'PPP')}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Account Metadata */}
      <Card className="p-6 bg-gray-50">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Account Created</p>
            <p className="font-medium text-gray-900">
              {formatDate(user.createdAt, 'PPP')}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Last Updated</p>
            <p className="font-medium text-gray-900">
              {formatDate(user.updatedAt, 'PPP')}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfileView;
