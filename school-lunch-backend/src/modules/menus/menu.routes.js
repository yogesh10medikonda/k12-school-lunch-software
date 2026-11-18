import { Router } from 'express';
import { authenticate, permit, USER_ROLES } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import {
  menuCreateSchema,
  menuUpdateSchema,
  menuIdParamSchema,
  menuListQuerySchema,
  menuDuplicateSchema,
} from './menu.validation.js';
import * as menuController from './menu.controller.js';

const router = Router();

// Auth stub: allows all in development; real JWT enforcement in Phase 9.
router.use(authenticate);

// ─── Menu CRUD ─────────────────────────────────────────────────────────────────

router.post(
  '/',
  validate(menuCreateSchema),
  permit(...USER_ROLES),
  menuController.createMenu
);

router.get(
  '/',
  validate(menuListQuerySchema),
  permit(...USER_ROLES),
  menuController.listMenus
);

router.get(
  '/:id',
  validate(menuIdParamSchema),
  permit(...USER_ROLES),
  menuController.getMenu
);

router.put(
  '/:id',
  validate({ params: menuIdParamSchema.params, body: menuUpdateSchema.body }),
  permit(...USER_ROLES),
  menuController.updateMenu
);

router.delete(
  '/:id',
  validate(menuIdParamSchema),
  permit(...USER_ROLES),
  menuController.deleteMenu
);

// ─── Duplicate ──────────────────────────────────────────────────────────────────

router.post(
  '/:id/duplicate',
  validate({ params: menuIdParamSchema.params, body: menuDuplicateSchema.body }),
  permit(...USER_ROLES),
  menuController.duplicateMenu
);

export default router;