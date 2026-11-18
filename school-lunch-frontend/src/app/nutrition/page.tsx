'use client';

import * as React from 'react';
import { Apple, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/empty-state';
import { useRole } from '@/lib/auth/roles';

export default function NutritionPage() {
  const { hasPermission } = useRole();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Nutrition Management & Compliance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Nutritional analysis, guideline compliance checker, and macro breakdowns.
          </p>
        </div>

        {hasPermission('configure_guidelines') && (
          <Button variant="outline" leftIcon={<Settings2 className="w-4 h-4" />}>
            Configure Guidelines
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-6">
          <EmptyState
            icon={Apple}
            title="Nutrition Engine Ready"
            description="Phase 1 routing active. Configurable guidelines (calories, protein, fiber, sodium limits per jurisdiction and grade) will be implemented in Phase 5."
          />
        </CardContent>
      </Card>
    </div>
  );
}
