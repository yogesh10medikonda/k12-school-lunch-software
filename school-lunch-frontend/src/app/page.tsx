import Link from 'next/link';
import {
  ArrowRight, BarChart3, CalendarDays, HeartPulse, Package, Trash2, Truck, Users,
} from 'lucide-react';
import { MarketingShell } from '@/components/marketing/marketing-shell';

export const metadata = {
  title: 'NutriKitchen OS | K-12 School Lunch Nutrition & Inventory Management',
  description: 'Plan menus, check nutrition, control inventory and track food waste in one place.',
};

const FEATURES = [
  { icon: Users, title: 'Students and dietary safeguards', text: 'Keep rosters with allergy and dietary information in one record.' },
  { icon: CalendarDays, title: 'Menu planning', text: 'Plan daily or weekly menus and see the ingredients each one needs.' },
  { icon: HeartPulse, title: 'Nutrition analysis', text: 'Compare planned meals against guidelines that your school configures.' },
  { icon: Package, title: 'Inventory control', text: 'Track stock movements, with low-stock and expiry alerts.' },
  { icon: Truck, title: 'Vendors and purchase orders', text: 'Keep supplier prices together and order what is missing.' },
  { icon: Trash2, title: 'Food waste tracking', text: 'Record what was prepared, served and wasted, then spot patterns.' },
  { icon: BarChart3, title: 'Reports', text: 'See a summary of operations across the whole lunch program.' },
];

const STEPS = [
  'Set up your school and student groups',
  'Plan menus and check their nutrition',
  'Compare ingredient needs with your stock',
  'Order what is missing and track waste',
];

const FAQS = [
  { q: 'Who is it for?', a: 'School administrators, nutritionists, kitchen staff and inventory managers.' },
  { q: 'Can I set my own nutrition guidelines?', a: 'Yes. Guidelines are configurable by jurisdiction and grade group. No limits are fixed in advance.' },
  { q: 'Is student data protected?', a: 'Allergy and dietary data is treated as sensitive. Login and role-based access are planned for the next release, so please use test data for now.' },
];

export default function LandingPage() {
  return (
    <MarketingShell>
      <main>
        <section className="bg-gradient-to-b from-emerald-50 to-white">
          <div className="mx-auto max-w-4xl px-4 py-20 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              One place to run your school lunch program
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Plan menus, check nutrition, control inventory and track food waste,
              all connected in one system.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/onboarding" className="inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-6 py-3 font-semibold text-white hover:bg-emerald-900">
                Get started <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a href="#how-it-works" className="rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50">
                See how it works
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center text-2xl font-bold">Everything your lunch program needs</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <Icon className="h-6 w-6 text-emerald-700" aria-hidden="true" />
                <h3 className="mt-3 font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="bg-slate-50">
          <div className="mx-auto max-w-4xl px-4 py-16">
            <h2 className="text-center text-2xl font-bold">How it works</h2>
            <ol className="mt-8 space-y-4">
              {STEPS.map((step, i) => (
                <li key={step} className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-16">
          <h2 className="text-center text-2xl font-bold">Questions</h2>
          <div className="mt-8 space-y-3">
            {FAQS.map(({ q, a }) => (
              <details key={q} className="rounded-xl border border-slate-200 p-4">
                <summary className="cursor-pointer font-semibold">{q}</summary>
                <p className="mt-2 text-sm text-slate-600">{a}</p>
              </details>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/onboarding" className="inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-6 py-3 font-semibold text-white hover:bg-emerald-900">
              Set up your school <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}