import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validate } from '../../middleware/validate.js';
import { createOnboardingSchema } from './onboarding.validation.js';
import { createRequest } from './onboarding.controller.js';

const router = Router();

const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
  message: { success: false, message: 'Too many requests. Please try again later.' },
});

router.post('/requests', submitLimiter, validate(createOnboardingSchema), createRequest);

export default router;