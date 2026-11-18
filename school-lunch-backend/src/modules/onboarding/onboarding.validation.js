import { z } from 'zod';

export const createOnboardingSchema = {
  body: z.object({
    schoolName: z.string().trim().min(2).max(150),
    country: z.string().trim().min(2).max(100),
    schoolType: z.enum(['Public', 'Private', 'Charter', 'Other']),
    gradeRange: z.enum(['K-5', '6-8', '9-12', 'K-8', 'K-12']),
    approxStudents: z.number().int().min(1).max(100000),
    mealsPerDay: z.enum(['Lunch only', 'Breakfast and lunch', 'Breakfast, lunch and snacks']),
    goals: z.array(z.string().trim().min(1).max(100)).min(1).max(10),
    contactName: z.string().trim().min(2).max(100),
    email: z.string().trim().toLowerCase().email().max(200),
    phone: z.string().trim().max(30).optional(),
    consent: z.boolean().refine((v) => v === true, 'Consent is required'),
  }),
};