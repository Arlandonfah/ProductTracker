import { Router } from 'express';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware';
import { upload } from '../utils/image.util';
import { 
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller';
import { body, param } from 'express-validator';
import { validateRequest } from '../middlewares/validation.middleware';

const router = Router();

// Validation des entrées
const productValidation = [
  body('title').trim().notEmpty().withMessage('Le titre est requis'),
  body('description').trim().notEmpty().withMessage('La description est requise'),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Le prix doit être un nombre positif')
];

// Routes publiques
router.get(
  '/',
  [
    param('page').optional().isInt({ gt: 0 }).withMessage('Numéro de page invalide')
  ],
  validateRequest,
  getProducts
);

router.get(
  '/:id',
  [
    param('id').isInt().withMessage('ID produit invalide')
  ],
  validateRequest,
  getProductById
);

// Routes protégées (admin)
router.post(
  '/',
  authenticate,
  authorizeAdmin,
  upload.single('image'),
  productValidation,
  validateRequest,
  createProduct
);

router.put(
  '/:id',
  authenticate,
  authorizeAdmin,
  upload.single('image'),
  [
    param('id').isInt().withMessage('ID produit invalide'),
    ...productValidation
  ],
  validateRequest,
  updateProduct
);

router.delete(
  '/:id',
  authenticate,
  authorizeAdmin,
  [
    param('id').isInt().withMessage('ID produit invalide')
  ],
  validateRequest,
  deleteProduct
);

export default router;