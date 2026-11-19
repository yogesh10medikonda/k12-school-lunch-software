'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Users, Package, AlertTriangle, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';

interface ListEnvelope {
  meta?: { total?: number };
}
interface Alerts {
  lowStock?: unknown[];
  expired?: unknown[];
  expiringSoon?: unknown[];
}
interface AlertsEnvelope {
  data?: Alerts;
}

async function fetchSummary() {
  const [students, ingredients, alertsRes] = await Promise.all([
    apiClient<ListEnvelope>('/students?page=1&limit=1'),
    apiClient<ListEnvelope>('/inventory/ingredients?page=1&limit=1'),
    apiClient<AlertsEnvelope>('/inventory/alerts?days=7'),
  ]);
  const alerts: Alerts = (alertsRes as AlertsEnvelope).data ?? (alertsRes as unknown as Alerts);
  return {
    students: students.meta?.total ?? 0,
    ingredients: ingredients.meta?.total ?? 0,
    lowStock: alerts.lowStock?.length ?? 0,
    expired: alerts.expired?.length ?? 0,
    expiringSoon: alerts.expiringSoon?.length ?? 0,
  };
}

export default function DashboardPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: fetchSummary,
  });

  const cards = [
    { label: 'Students', value: data?.students, href: '/students', icon: Users },
    { label: 'Ingredients', value: data?.ingredients, href: '/inventory', icon: Package },
    { label: 'Low stock', value: data?.lowStock, href: '/inventory', icon: AlertTriangle },
    { label: 'Expiring within 7 days', value: data?.expiringSoon, href: '/inventory', icon: Clock },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Live figures from your students and inventory records.
        </p>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
          Could not load the dashboard. Check that the backend is running.
          <button onClick={() => refetch()} className="ml-3 font-semibold underline">
            Try again
          </button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, href, icon: Icon }) => (
          <Link key={label} href={href} className="block">
            <Card>
              <CardContent className="flex items-center gap-4 p-5">
                <Icon className="h-6 w-6 text-emerald-700" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {isLoading ? '...' : (value ?? '-')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <p className="text-xs text-slate-500">
        Menus, purchase orders, nutrition compliance and food waste figures will appear here
        when those modules are connected.
      </p>
    </div>
  );
}