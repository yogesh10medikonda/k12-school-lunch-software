'use client';
import { usePathname } from 'next/navigation';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = pathname === '/' || pathname.startsWith('/onboarding');
  if (isPublic) return <>{children}</>;
  return <AppShellInner>{children}</AppShellInner>;
}

function AppShellInner({ children }: { children: React.ReactNode }) {
  // your ORIGINAL component body goes here, unchanged
}