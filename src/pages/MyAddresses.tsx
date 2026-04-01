import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Edit3, Home, MapPin, Plus, Star, Trash2 } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { AccountLayout } from '@/components/AccountLayout';
import { SavedAddress, getSavedAddresses, saveAddresses } from '@/utils/accountStorage';

const initialForm = {
  id: '',
  fullName: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
  landmark: '',
  label: 'Home',
};

export function MyAddresses() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    setAddresses(getSavedAddresses(user.id));
  }, [user?.id]);

  const persistAddresses = (nextAddresses: SavedAddress[]) => {
    if (!user?.id) {
      return;
    }

    setAddresses(nextAddresses);
    saveAddresses(user.id, nextAddresses);
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!form.fullName || !form.phone || !form.line1 || !form.city || !form.state || !form.pincode) {
      toast.error('Please complete the address form');
      return;
    }

    const address: SavedAddress = {
      id: editingId || `${Date.now()}`,
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      line1: form.line1.trim(),
      line2: form.line2.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      pincode: form.pincode.trim(),
      landmark: form.landmark.trim(),
      label: form.label.trim() || 'Home',
      isDefault: addresses.length === 0 || addresses.every((item) => item.id !== editingId && !item.isDefault),
    };

    const nextAddresses = editingId
      ? addresses.map((item) => (item.id === editingId ? { ...address, isDefault: item.isDefault } : item))
      : [address, ...addresses];

    persistAddresses(nextAddresses);
    toast.success(editingId ? 'Address updated' : 'Address added');
    resetForm();
  };

  const handleEdit = (address: SavedAddress) => {
    setEditingId(address.id);
    setForm({
      id: address.id,
      fullName: address.fullName,
      phone: address.phone,
      line1: address.line1,
      line2: address.line2 || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      landmark: address.landmark || '',
      label: address.label,
    });
  };

  const handleDelete = (addressId: string) => {
    const nextAddresses = addresses.filter((item) => item.id !== addressId);
    const hasDefault = nextAddresses.some((item) => item.isDefault);
    const normalized = hasDefault ? nextAddresses : nextAddresses.map((item, index) => ({ ...item, isDefault: index === 0 }));
    persistAddresses(normalized);
    if (editingId === addressId) {
      resetForm();
    }
    toast.success('Address removed');
  };

  const setDefaultAddress = (addressId: string) => {
    const nextAddresses = addresses.map((item) => ({
      ...item,
      isDefault: item.id === addressId,
    }));
    persistAddresses(nextAddresses);
    toast.success('Default address updated');
  };

  return (
    <AccountLayout title="My Addresses" description="Save delivery addresses for faster checkout and keep your default shipping location ready for upcoming orders.">
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="space-y-4">
          {addresses.length ? (
            addresses.map((address) => (
              <Card key={address.id} className="rounded-2xl border-orange-100 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">{address.label}</span>
                      {address.isDefault && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                          <Star className="h-3 w-3 fill-current" />
                          Default
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{address.fullName}</h3>
                      <p className="mt-1 text-sm text-gray-600">{address.phone}</p>
                    </div>
                    <div className="text-sm text-gray-700">
                      <p>{address.line1}</p>
                      {address.line2 ? <p>{address.line2}</p> : null}
                      <p>{address.city}, {address.state} - {address.pincode}</p>
                      {address.landmark ? <p>Landmark: {address.landmark}</p> : null}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!address.isDefault && (
                      <Button type="button" variant="outline" onClick={() => setDefaultAddress(address.id)}>
                        <Star className="h-4 w-4" />
                        Set Default
                      </Button>
                    )}
                    <Button type="button" variant="outline" onClick={() => handleEdit(address)}>
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button type="button" variant="outline" onClick={() => handleDelete(address.id)}>
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="rounded-2xl border-dashed border-orange-200 p-8 text-center">
              <MapPin className="mx-auto h-10 w-10 text-orange-600" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900">No saved addresses yet</h3>
              <p className="mt-2 text-sm text-gray-600">Add your first address to make checkout much faster next time.</p>
            </Card>
          )}
        </div>

        <Card className="rounded-2xl border-orange-100 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">{editingId ? 'Edit Address' : 'Add New Address'}</h2>
            <p className="mt-1 text-sm text-gray-600">Store multiple delivery locations for home, work, or gifting.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="address-label">Address Label</Label>
              <Input id="address-label" value={form.label} onChange={(event) => setForm((prev) => ({ ...prev, label: event.target.value }))} placeholder="Home, Work, Studio" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address-name">Full Name</Label>
              <Input id="address-name" value={form.fullName} onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address-phone">Phone</Label>
              <Input id="address-phone" value={form.phone} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address-line1">Address Line 1</Label>
              <Input id="address-line1" value={form.line1} onChange={(event) => setForm((prev) => ({ ...prev, line1: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address-line2">Address Line 2</Label>
              <Input id="address-line2" value={form.line2} onChange={(event) => setForm((prev) => ({ ...prev, line2: event.target.value }))} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="address-city">City</Label>
                <Input id="address-city" value={form.city} onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address-state">State</Label>
                <Input id="address-state" value={form.state} onChange={(event) => setForm((prev) => ({ ...prev, state: event.target.value }))} />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="address-pincode">Pincode</Label>
                <Input id="address-pincode" value={form.pincode} onChange={(event) => setForm((prev) => ({ ...prev, pincode: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address-landmark">Landmark</Label>
                <Input id="address-landmark" value={form.landmark} onChange={(event) => setForm((prev) => ({ ...prev, landmark: event.target.value }))} />
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="submit" variant="primaryBlack" className="flex-1">
                {editingId ? (
                  <>
                    <Edit3 className="h-4 w-4" />
                    Update Address
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Add Address
                  </>
                )}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>

          <div className="mt-6 rounded-2xl bg-orange-50 p-4 text-sm text-orange-900">
            <div className="flex items-start gap-2">
              <Home className="mt-0.5 h-4 w-4" />
              <p>During checkout, your default address will be the quickest option to choose.</p>
            </div>
          </div>
        </Card>
      </div>
    </AccountLayout>
  );
}
