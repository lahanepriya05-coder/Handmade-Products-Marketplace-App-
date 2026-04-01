import { ChangeEvent, FormEvent, ReactNode, useEffect, useState } from 'react';
import { Package, IndianRupee, Boxes, Store, Loader2, Pencil, Trash2 } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import apiClient from '@/services/apiClient';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface SellerProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  price: number;
  stock: number;
  status: string;
}

interface DashboardData {
  seller: {
    name: string;
    email: string;
    shopName: string;
  };
  stats: {
    totalProducts: number;
    activeProducts: number;
    totalInventory: number;
    totalOrders: number;
    totalRevenue: number;
  };
  products: SellerProduct[];
}

const initialForm = {
  title: '',
  description: '',
  category: '',
  image: '',
  price: '',
  stock: '',
};

const imageHelpText = 'Upload a clear product photo. The original file will be saved for sharper marketplace images.';

export function SellerDashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/api/seller/dashboard');
      setDashboard(res.data);
    } catch (error: any) {
      console.error('Failed to load seller dashboard', error);
      toast.error('Could not load seller dashboard', {
        description: error.response?.data?.message || error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

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
      setForm((prev) => ({ ...prev, image: result }));
      toast.success('Image ready', {
        description: 'Your original image will be stored in full quality when you save the product.',
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.category || !form.price || !form.stock) {
      toast.error('Please complete all required product fields');
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      };

      if (editingProductId) {
        await apiClient.put(`/api/seller/products/${editingProductId}`, payload);
      } else {
        await apiClient.post('/api/seller/products', payload);
      }

      toast.success(editingProductId ? 'Product updated successfully' : 'Product added successfully');
      setForm(initialForm);
      setEditingProductId(null);
      await loadDashboard();
    } catch (error: any) {
      console.error('Failed to create product', error);
      toast.error('Product could not be created', {
        description: error.response?.data?.message || error.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (product: SellerProduct) => {
    setEditingProductId(product.id);
    setForm({
      title: product.title,
      description: product.description,
      category: product.category,
      image: product.image,
      price: String(product.price),
      stock: String(product.stock),
    });
  };

  const handleDelete = async (productId: string) => {
    try {
      await apiClient.delete(`/api/seller/products/${productId}`);
      toast.success('Product deleted');
      if (editingProductId === productId) {
        setEditingProductId(null);
        setForm(initialForm);
      }
      await loadDashboard();
    } catch (error: any) {
      console.error('Failed to delete product', error);
      toast.error('Product could not be deleted', {
        description: error.response?.data?.message || error.message,
      });
    }
  };

  const stats = dashboard?.stats ?? {
    totalProducts: 0,
    activeProducts: 0,
    totalInventory: 0,
    totalOrders: 0,
    totalRevenue: 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-100 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-3xl bg-[#1f140d] px-8 py-10 text-white shadow-xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
                <Store className="h-4 w-4" />
                Seller workspace
              </div>
              <h1 className="text-3xl font-bold">Welcome, {dashboard?.seller.shopName || user?.shopName || user?.name}</h1>
              <p className="mt-2 max-w-2xl text-sm text-orange-100">
                Manage your handmade catalog, track inventory, and prepare your store for orders from one place.
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 px-5 py-4 text-sm">
              <p className="text-orange-100">Logged in as</p>
              <p className="font-semibold">{dashboard?.seller.email || user?.email}</p>
            </div>
          </div>
        </section>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-gray-600">
            <Loader2 className="mr-3 h-5 w-5 animate-spin" />
            Loading seller dashboard...
          </div>
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-4">
              <StatCard label="Products" value={stats.totalProducts} icon={<Package className="h-5 w-5" />} />
              <StatCard label="Active Listings" value={stats.activeProducts} icon={<Store className="h-5 w-5" />} />
              <StatCard label="Inventory Units" value={stats.totalInventory} icon={<Boxes className="h-5 w-5" />} />
              <StatCard label="Revenue" value={`₹${stats.totalRevenue}`} icon={<IndianRupee className="h-5 w-5" />} />
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <Card className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold">Your Products</h2>
                  <p className="mt-1 text-sm text-gray-600">Products created from this dashboard will be tied to your seller account.</p>
                </div>

                <div className="mb-4">
                  <Link to="/seller/orders" className="text-sm font-medium text-orange-700 hover:text-orange-800">
                    View seller orders
                  </Link>
                </div>

                <div className="space-y-4">
                  {dashboard?.products.length ? (
                    dashboard.products.map((product) => (
                      <div key={product.id} className="rounded-2xl border border-orange-100 bg-orange-50/40 p-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div className="flex gap-4">
                            <div className="h-20 w-20 overflow-hidden rounded-xl bg-white border border-orange-100 shrink-0">
                              {product.image ? (
                                <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                                  No image
                                </div>
                              )}
                            </div>
                            <div>
                            <h3 className="font-semibold text-gray-900">{product.title}</h3>
                            <p className="mt-1 text-sm text-gray-600">{product.description}</p>
                            <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-600">
                              <span className="rounded-full bg-white px-3 py-1">Category: {product.category}</span>
                              <span className="rounded-full bg-white px-3 py-1">Stock: {product.stock}</span>
                              <span className="rounded-full bg-white px-3 py-1">Status: {product.status}</span>
                            </div>
                          </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-orange-700">₹{product.price}</p>
                            <div className="mt-3 flex justify-end gap-2">
                              <Button type="button" variant="outline" size="sm" onClick={() => startEdit(product)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </Button>
                              <Button type="button" variant="outline" size="sm" onClick={() => handleDelete(product.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/50 p-8 text-center text-sm text-gray-600">
                      No products yet. Add your first handmade item from the form on the right.
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold">{editingProductId ? 'Edit Product' : 'Add New Product'}</h2>
                  <p className="mt-1 text-sm text-gray-600">Start with the core details now and upload a product image directly from your device.</p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <Input
                    placeholder="Product title"
                    value={form.title}
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  />
                  <textarea
                    placeholder="Product description"
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    className="min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                  />
                  <Input
                    placeholder="Category"
                    value={form.category}
                    onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  />
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Product Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                    />
                    <p className="text-xs text-gray-500">{imageHelpText}</p>
                    <Input
                      placeholder="Or paste image URL (optional)"
                      value={form.image.startsWith('data:image') ? '' : form.image}
                      onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
                    />
                    {form.image && (
                      <div className="overflow-hidden rounded-xl border border-orange-100 bg-orange-50">
                        <img src={form.image} alt="Preview" className="h-48 w-full object-cover" />
                      </div>
                    )}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      type="number"
                      min="0"
                      placeholder="Price"
                      value={form.price}
                      onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                    />
                    <Input
                      type="number"
                      min="0"
                      placeholder="Stock"
                      value={form.stock}
                      onChange={(e) => setForm((prev) => ({ ...prev, stock: e.target.value }))}
                    />
                  </div>
                  <Button type="submit" variant="primaryBlack" className="w-full" disabled={isSaving}>
                    {isSaving ? 'Saving product...' : editingProductId ? 'Update product' : 'Add product'}
                  </Button>
                  {editingProductId && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setEditingProductId(null);
                        setForm(initialForm);
                      }}
                    >
                      Cancel editing
                    </Button>
                  )}
                </form>
              </Card>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: ReactNode }) {
  return (
    <Card className="rounded-2xl border-orange-100 p-5">
      <div className="mb-4 inline-flex rounded-full bg-orange-100 p-3 text-orange-700">{icon}</div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
    </Card>
  );
}
