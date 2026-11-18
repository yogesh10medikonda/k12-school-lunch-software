'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useToast } from '@/components/ui/toast';
import { MarketingShell } from '@/components/marketing/marketing-shell';
import { onboardingSchema, type OnboardingFormValues } from '@/features/onboarding/schemas';
import { submitOnboarding, AppApiError } from '@/features/onboarding/api';

const STEPS = ['School', 'Program', 'Contact'];
const STEP_FIELDS: (keyof OnboardingFormValues)[][] = [
  ['schoolName', 'country', 'schoolType'],
  ['gradeRange', 'approxStudents', 'mealsPerDay', 'goals'],
  ['contactName', 'email', 'phone', 'consent'],
];
const SCHOOL_TYPES = ['Public', 'Private', 'Charter', 'Other'];
const GRADE_RANGES = ['K-5', '6-8', '9-12', 'K-8', 'K-12'];
const MEALS = ['Lunch only', 'Breakfast and lunch', 'Breakfast, lunch and snacks'];
const GOALS = [
  'Plan menus faster',
  'Track nutrition',
  'Control inventory',
  'Reduce food waste',
  'Manage vendors and orders',
];

const DEFAULTS: OnboardingFormValues = {
  schoolName: '', country: '', schoolType: '', gradeRange: '', approxStudents: '',
  mealsPerDay: '', goals: [], contactName: '', email: '', phone: '', consent: false,
};

function extractFieldErrors(details: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (Array.isArray(details)) {
    for (const d of details as { path?: string; field?: string; message: string }[]) {
      const key = (d.path ?? d.field ?? '').split('.').pop();
      if (key && !out[key]) out[key] = d.message;
    }
  }
  return out;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-700">{label}</label>
      {children}
      {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
}

export default function OnboardingPage() {
  const toast = useToast();
  const [step, setStep] = React.useState(0);
  const {
    register, handleSubmit, trigger, setError, getValues,
    formState: { errors },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: DEFAULTS,
  });

  const mutation = useMutation({ mutationFn: submitOnboarding });

  const next = async () => {
    const ok = await trigger(STEP_FIELDS[step]);
    if (ok) setStep((s) => s + 1);
  };

  const onSubmit = async (v: OnboardingFormValues) => {
    try {
      await mutation.mutateAsync({
        schoolName: v.schoolName,
        country: v.country,
        schoolType: v.schoolType,
        gradeRange: v.gradeRange,
        approxStudents: Number(v.approxStudents),
        mealsPerDay: v.mealsPerDay,
        goals: v.goals,
        contactName: v.contactName,
        email: v.email,
        phone: v.phone || undefined,
        consent: v.consent,
      });
    } catch (error) {
      if (error instanceof AppApiError) {
        if (error.statusCode === 400) {
          const fields = extractFieldErrors(error.details);
          const keys = Object.keys(fields);
          if (keys.length) {
            keys.forEach((k) =>
              setError(k as keyof OnboardingFormValues, { type: 'server', message: fields[k] })
            );
            return;
          }
        }
        if (error.statusCode === 409) {
          setError('email', { type: 'server', message: error.message });
          return;
        }
        toast.error('Could not submit', error.message);
        return;
      }
      toast.error('Network error', 'Unable to reach the server. Please try again.');
    }
  };

  if (mutation.isSuccess) {
    return (
      <MarketingShell>
        <main className="mx-auto max-w-xl px-4 py-20 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-700" aria-hidden="true" />
          <h1 className="mt-4 text-2xl font-bold">Thank you, we received your request</h1>
          <p className="mt-2 text-slate-600">We will contact you at {getValues('email')}.</p>
          <Link href="/dashboard" className="mt-6 inline-block rounded-lg bg-emerald-800 px-6 py-3 font-semibold text-white hover:bg-emerald-900">
            Open dashboard
          </Link>
        </main>
      </MarketingShell>
    );
  }

  return (
    <MarketingShell>
      <main className="mx-auto max-w-xl px-4 py-12">
        <h1 className="text-2xl font-bold">Set up your school</h1>
        <p className="mt-1 text-sm text-slate-600">
          Step {step + 1} of {STEPS.length}: {STEPS[step]}. Please do not enter any student information.
        </p>
        <div className="mt-4 flex gap-2" aria-hidden="true">
          {STEPS.map((s, i) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-emerald-700' : 'bg-slate-200'}`} />
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          {step === 0 && (
            <>
              <Field label="School name *" error={errors.schoolName?.message}>
                <Input {...register('schoolName')} placeholder="e.g. Green Valley School" error={errors.schoolName?.message} />
              </Field>
              <Field label="Country or region *" error={errors.country?.message}>
                <Input {...register('country')} placeholder="e.g. India" error={errors.country?.message} />
              </Field>
              <Field label="School type *" error={errors.schoolType?.message}>
                <Select {...register('schoolType')} error={errors.schoolType?.message}>
                  <option value="" disabled>Select type</option>
                  {SCHOOL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </Select>
              </Field>
            </>
          )}

          {step === 1 && (
            <>
              <Field label="Grade range *" error={errors.gradeRange?.message}>
                <Select {...register('gradeRange')} error={errors.gradeRange?.message}>
                  <option value="" disabled>Select range</option>
                  {GRADE_RANGES.map((g) => <option key={g} value={g}>{g}</option>)}
                </Select>
              </Field>
              <Field label="Approximate number of students *" error={errors.approxStudents?.message}>
                <Input {...register('approxStudents')} inputMode="numeric" placeholder="e.g. 400" error={errors.approxStudents?.message} />
              </Field>
              <Field label="Meals served per day *" error={errors.mealsPerDay?.message}>
                <Select {...register('mealsPerDay')} error={errors.mealsPerDay?.message}>
                  <option value="" disabled>Select</option>
                  {MEALS.map((m) => <option key={m} value={m}>{m}</option>)}
                </Select>
              </Field>
              <Field label="Main goals *" error={errors.goals?.message}>
                <div className="space-y-2">
                  {GOALS.map((g) => (
                    <label key={g} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" value={g} {...register('goals')} className="h-4 w-4" />
                      {g}
                    </label>
                  ))}
                </div>
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <Field label="Contact name *" error={errors.contactName?.message}>
                <Input {...register('contactName')} error={errors.contactName?.message} />
              </Field>
              <Field label="Work email *" error={errors.email?.message}>
                <Input {...register('email')} type="email" error={errors.email?.message} />
              </Field>
              <Field label="Phone (optional)" error={errors.phone?.message}>
                <Input {...register('phone')} type="tel" error={errors.phone?.message} />
              </Field>
              <div className="space-y-1.5">
                <label className="flex items-start gap-2 text-sm">
                  <input type="checkbox" {...register('consent')} className="mt-1 h-4 w-4" />
                  I agree to be contacted about this request.
                </label>
                {errors.consent && <p className="text-xs font-medium text-rose-600">{errors.consent.message}</p>}
              </div>
            </>
          )}

          <div className="flex justify-between pt-2">
            <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>
              Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button type="button" onClick={next}>Next</Button>
            ) : (
              <Button type="submit" isLoading={mutation.isPending} loadingText="Submitting..." disabled={mutation.isPending}>
                Submit
              </Button>
            )}
          </div>
        </form>
      </main>
    </MarketingShell>
  );
}