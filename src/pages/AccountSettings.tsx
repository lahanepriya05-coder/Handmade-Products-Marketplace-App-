import { ReactNode, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Bell, Globe, LogOut, Save, Shield, Smartphone } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Switch } from '@/app/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { AccountLayout } from '@/components/AccountLayout';
import { getAccountSettings, saveAccountSettings } from '@/utils/accountStorage';

export function AccountSettings() {
  const { user, logout } = useAuth();
  const [settings, setSettings] = useState(() => getAccountSettings(user?.id));

  useEffect(() => {
    setSettings(getAccountSettings(user?.id));
  }, [user?.id]);

  const updateToggle = (key: keyof typeof settings, value: boolean | string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    if (!user?.id) {
      return;
    }

    saveAccountSettings(user.id, settings);
    toast.success('Account settings saved');
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    window.location.href = '/';
  };

  return (
    <AccountLayout title="Account Settings" description="Choose how Kinara contacts you, what updates you receive, and the preferences your account uses by default.">
      <Card className="rounded-2xl border-orange-100 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
          <p className="mt-1 text-sm text-gray-600">Pick the updates that matter most for your shopping or seller workflow.</p>
        </div>

        <div className="space-y-5">
          <SettingRow
            icon={<Bell className="h-5 w-5 text-orange-700" />}
            title="Order Updates"
            description="Receive important order confirmation and delivery milestones."
            checked={settings.orderUpdates}
            onCheckedChange={(checked) => updateToggle('orderUpdates', checked)}
          />
          <SettingRow
            icon={<Shield className="h-5 w-5 text-orange-700" />}
            title="Shipping Alerts"
            description="Get dispatch and shipping progress updates for active orders."
            checked={settings.shippingUpdates}
            onCheckedChange={(checked) => updateToggle('shippingUpdates', checked)}
          />
          <SettingRow
            icon={<Globe className="h-5 w-5 text-orange-700" />}
            title="Marketing Emails"
            description="Hear about artisan launches, festive collections, and curated drops."
            checked={settings.marketingEmails}
            onCheckedChange={(checked) => updateToggle('marketingEmails', checked)}
          />
          <SettingRow
            icon={<Smartphone className="h-5 w-5 text-orange-700" />}
            title="SMS Alerts"
            description="Get short shipping and delivery messages on your phone."
            checked={settings.smsAlerts}
            onCheckedChange={(checked) => updateToggle('smsAlerts', checked)}
          />
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-2xl border-orange-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900">Regional Preferences</h2>
          <div className="mt-6 space-y-5">
            <div className="space-y-2">
              <Label>Preferred Language</Label>
              <Select value={settings.preferredLanguage} onValueChange={(value) => updateToggle('preferredLanguage', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Hindi">Hindi</SelectItem>
                  <SelectItem value="Tamil">Tamil</SelectItem>
                  <SelectItem value="Telugu">Telugu</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Preferred Currency</Label>
              <Select value={settings.preferredCurrency} onValueChange={(value) => updateToggle('preferredCurrency', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">INR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border-orange-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900">Security Actions</h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-orange-50 p-4 text-sm text-gray-700">
              Keep your contact details current and log out from shared devices after using your account.
            </div>
            <Button type="button" variant="primaryBlack" className="w-full" onClick={handleSave}>
              <Save className="h-4 w-4" />
              Save Settings
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </Card>
      </div>
    </AccountLayout>
  );
}

interface SettingRowProps {
  icon: ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function SettingRow({ icon, title, description, checked, onCheckedChange }: SettingRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-orange-100 p-4">
      <div className="flex gap-3">
        <div className="mt-0.5">{icon}</div>
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
