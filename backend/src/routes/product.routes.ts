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
  validateRequest([ 
    param('page').optional().isInt({ gt: 0 }).withMessage('Numéro de page invalide')
  ]),
  getProducts
);

router.get(
  '/:id',
  validateRequest([ 
    param('id').isInt().withMessage('ID produit invalide')
  ]),
  getProductById
);

// Routes protégées (admin)
router.post(
  '/',
  authenticate,
  authorizeAdmin,
  upload.single('image'),
  validateRequest(productValidation), 
  createProduct
);

router.put(
  '/:id',
  authenticate,
  authorizeAdmin,
  upload.single('image'),
  validateRequest([ 
    param('id').isInt().withMessage('ID produit invalide'),
    ...productValidation
  ]),
  updateProduct
);

router.delete(
  '/:id',
  authenticate,
  authorizeAdmin,
  validateRequest([ 
    param('id').isInt().withMessage('ID produit invalide')
  ]),
  deleteProduct
);

export default router;