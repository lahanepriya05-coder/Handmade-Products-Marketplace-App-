import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card } from '@/app/components/ui/card';
import { cn } from '@/app/components/ui/utils';
import { MapPin, Settings, ShoppingBag, User } from 'lucide-react';

interface AccountLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

const navItems = [
  { to: '/profile', label: 'My Profile', icon: User },
  { to: '/orders', label: 'My Orders', icon: ShoppingBag },
  { to: '/addresses', label: 'My Addresses', icon: MapPin },
  { to: '/account', label: 'Account Settings', icon: Settings },
];

export function AccountLayout({ title, description, children }: AccountLayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-3xl bg-[#1f140d] px-8 py-10 text-white shadow-xl">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm uppercase tracking-[0.18em] text-orange-200">Account</p>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="mt-3 text-sm text-orange-100">{description}</p>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <Card className="h-fit rounded-2xl border-orange-100 p-4">
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.to;

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors',
                      active ? 'bg-black text-white' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-700'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </Card>

          <div className="space-y-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
