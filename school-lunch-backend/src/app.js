
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

import { env } from './config/env.js';
import { authenticate } from './middleware/auth.js';
import { sanitize } from './middleware/sanitize.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

import onboardingRoutes from './modules/onboarding/onboarding.routes.js';
import studentRoutes from './modules/students/student.routes.js';
import vendorRoutes from './modules/vendors/vendor.routes.js';
import inventoryRoutes from './modules/inventory/inventory.routes.js';
import nutritionRoutes from './modules/nutrition/nutrition.routes.js';
import menuRoutes from './modules/menus/menu.routes.js';

const app = express();

// Trust the Render proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// CORS
app.use(cors({ origin: env.FRONTEND_ORIGIN }));

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    skip: () => process.env.NODE_ENV === 'test',
  })
);

app.use(express.json());
app.use(sanitize);
app.use(morgan('dev'));

// Health check
app.get('/api/health', (_req, res) => {
  return res.json({ success: true, message: 'Server healthy' });
});

// Public onboarding route (no authentication required)
app.use('/api/onboarding', onboardingRoutes);

// Protected application routes
app.use('/api/students', authenticate, studentRoutes);
app.use('/api/vendors', authenticate, vendorRoutes);
app.use('/api/inventory', authenticate, inventoryRoutes);
app.use('/api/nutrition', authenticate, nutritionRoutes);
app.use('/api/menus', authenticate, menuRoutes);

// 404 handler
app.use(notFound);

// Central error handler (must be last)
app.use(errorHandler);

export default app;
