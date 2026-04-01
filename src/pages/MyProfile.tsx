import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Camera, Mail, Phone, Save, ShieldCheck, Store, User } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { AccountLayout } from '@/components/AccountLayout';

export function MyProfile() {
  const { user, updateCurrentUser } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'buyer',
    phone: '',
    avatar: '',
    about: '',
    shopName: '',
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    setForm({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'buyer',
      phone: user.phone || '',
      avatar: user.avatar || '',
      about: user.about || '',
      shopName: user.shopName || '',
    });
  }, [user]);

  const handleProfilePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please choose a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setForm((prev) => ({ ...prev, avatar: result }));
      toast.success('Profile photo selected');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    try {
      await updateCurrentUser({
        name: form.name.trim(),
        phone: form.phone.trim(),
        avatar: form.avatar.trim(),
        about: form.about.trim(),
        shopName: form.role === 'seller' ? form.shopName.trim() : undefined,
      });

      toast.success('Profile updated', {
        description: 'Your account details were saved successfully.',
      });
    } catch (error: any) {
      toast.error('Profile update failed', {
        description: error.response?.data?.message || error.message,
      });
    }
  };

  const initials = form.name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <AccountLayout title="My Profile" description="Manage the personal details your Kinara account uses across orders, seller tools, and account screens.">
      <Card className="rounded-2xl border-orange-100 p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            {form.avatar ? (
              <img src={form.avatar} alt={form.name} className="h-20 w-20 rounded-full object-cover ring-4 ring-orange-100" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-2xl font-bold text-orange-700 ring-4 ring-orange-50">
                {initials || 'K'}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{form.name || 'Your account'}</h2>
              <p className="mt-1 text-sm text-gray-600">{form.email}</p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                {form.role === 'seller' ? 'Seller account' : 'Buyer account'}
              </div>
            </div>
          </div>
          <div className="md:ml-auto">
            <p className="text-sm text-gray-500">Member since</p>
            <p className="font-medium text-gray-900">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : 'Recently joined'}</p>
          </div>
        </div>
      </Card>

      <Card className="rounded-2xl border-orange-100 p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Full Name</Label>
              <Input
                id="profile-name"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-email">Email Address</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input id="profile-email" value={form.email} disabled className="bg-gray-50 pl-9" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-phone">Phone Number</Label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="profile-phone"
                  value={form.phone}
                  onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                  className="pl-9"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-avatar">Choose Profile Photo</Label>
              <label
                htmlFor="profile-avatar"
                className="flex cursor-pointer items-center gap-3 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition hover:bg-orange-50"
              >
                <Camera className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">{form.avatar ? 'Change selected photo' : 'Choose image from device'}</span>
              </label>
              <input
                id="profile-avatar"
                type="file"
                accept="image/*"
                onChange={handleProfilePhotoChange}
                className="hidden"
              />
              <p className="text-xs text-gray-500">Upload a profile image from your device.</p>
            </div>
            {form.role === 'seller' && (
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="profile-shop">Shop Name</Label>
                <div className="relative">
                  <Store className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="profile-shop"
                    value={form.shopName}
                    onChange={(event) => setForm((prev) => ({ ...prev, shopName: event.target.value }))}
                    className="pl-9"
                    placeholder="Enter your shop name"
                  />
                </div>
              </div>
            )}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="profile-about">About You</Label>
              <Textarea
                id="profile-about"
                value={form.about}
                onChange={(event) => setForm((prev) => ({ ...prev, about: event.target.value }))}
                placeholder="Share a short note about yourself or your handmade brand."
                className="min-h-32"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="primaryBlack">
              <Save className="h-4 w-4" />
              Save Profile
            </Button>
          </div>
        </form>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-2xl border-orange-100 p-6">
          <div className="flex items-start gap-3">
            <User className="mt-1 h-5 w-5 text-orange-700" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Account Overview</h3>
              <p className="mt-2 text-sm text-gray-600">
                Keep your contact details updated so orders, delivery updates, and seller activity stay tied to the right account.
              </p>
            </div>
          </div>
        </Card>
        <Card className="rounded-2xl border-orange-100 p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 h-5 w-5 text-orange-700" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Privacy Note</h3>
              <p className="mt-2 text-sm text-gray-600">
                Email stays read-only here to protect login access. You can update the rest of your display and profile information anytime.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AccountLayout>
  );
}
