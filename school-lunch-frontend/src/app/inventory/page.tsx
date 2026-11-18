'use client';

import * as React from 'react';
import { PackageOpen, Plus, ArrowDownUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/empty-state';
import { useRole } from '@/lib/auth/roles';

export default function InventoryPage() {
  const { hasPermission } = useRole();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Inventory & Ingredient Stock Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time stock ledger, non-negative stock movements, and expiry alerts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {hasPermission('record_stock_movement') && (
            <Button variant="outline" leftIcon={<ArrowDownUp className="w-4 h-4" />}>
              Record Movement
            </Button>
          )}
          {hasPermission('manage_inventory') && (
            <Button leftIcon={<Plus className="w-4 h-4" />}>
              Add Ingredient
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <EmptyState
            icon={PackageOpen}
            title="Inventory Ledger Ready"
            description="Phase 1 routing active. Stock movement audit trail, base unit standardization (g/kg, ml/l), and low-stock detection are scheduled for Phase 6."
          />
        </CardContent>
      </Card>
    </div>
  );
}
