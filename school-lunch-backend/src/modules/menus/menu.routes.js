import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import {
  createMenuSchema, updateMenuSchema, idParamSchema,
  duplicateMenuSchema, listMenuQuerySchema,
} from './menu.validation.js';
import {
  createMenu, listMenus, getMenu, updateMenu, deleteMenu, duplicateMenu,
} from './menu.controller.js';

const router = Router();

router.post('/', validate(createMenuSchema), createMenu);
router.get('/', validate(listMenuQuerySchema), listMenus);
router.get('/:id', validate(idParamSchema), getMenu);
router.put('/:id', validate(updateMenuSchema), updateMenu);
router.delete('/:id', validate(idParamSchema), deleteMenu);
router.post('/:id/duplicate', validate(duplicateMenuSchema), duplicateMenu);

export default router;