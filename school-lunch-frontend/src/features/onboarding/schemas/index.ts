import { z } from 'zod';

export const onboardingSchema = z.object({
  schoolName: z.string().trim().min(2, 'School name is required'),
  country: z.string().trim().min(2, 'Country or region is required'),
  schoolType: z.string().min(1, 'Select a school type'),
  gradeRange: z.string().min(1, 'Select a grade range'),
  approxStudents: z
    .string()
    .regex(/^\d+$/, 'Enter a whole number')
    .refine((v) => Number(v) >= 1, 'Must be at least 1'),
  mealsPerDay: z.string().min(1, 'Select meals per day'),
  goals: z.array(z.string()).min(1, 'Pick at least one goal'),
  contactName: z.string().trim().min(2, 'Contact name is required'),
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
  phone: z.string().trim().optional(),
  consent: z.boolean().refine((v) => v === true, 'Consent is required'),
});

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;