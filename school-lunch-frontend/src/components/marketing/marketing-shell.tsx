import Link from 'next/link';
import type { ReactNode } from 'react';
import { Leaf } from 'lucide-react';

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-emerald-900">
            <Leaf className="h-5 w-5" aria-hidden="true" />
            NutriKitchen OS
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/dashboard" className="text-slate-600 hover:text-slate-900">
              Open dashboard
            </Link>
            <Link
              href="/onboarding"
              className="rounded-lg bg-emerald-800 px-4 py-2 font-semibold text-white hover:bg-emerald-900"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>
      {children}
      <footer className="border-t border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-500">
          NutriKitchen OS: K-12 School Lunch Nutrition and Inventory Management.
          Student project demo, please use test data only.
        </div>
      </footer>
    </div>
  );
}