'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';

export function LayoutSwitch({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isPublic = pathname === '/' || pathname.startsWith('/onboarding');
  if (isPublic) return <>{children}</>;
  return <AppLayout>{children}</AppLayout>;
}