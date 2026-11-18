import { apiClient, AppApiError } from '@/lib/api-client';

export interface OnboardingPayload {
  schoolName: string;
  country: string;
  schoolType: string;
  gradeRange: string;
  approxStudents: number;
  mealsPerDay: string;
  goals: string[];
  contactName: string;
  email: string;
  phone?: string;
  consent: boolean;
}

export async function submitOnboarding(payload: OnboardingPayload) {
  return apiClient<unknown>('/onboarding/requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export { AppApiError };