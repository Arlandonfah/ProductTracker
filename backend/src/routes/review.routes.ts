import { Router } from "express";
import {
  addReview,
  getProductReviews,
  getRatingDistribution,
} from "../controllers/review.controller";
import { body, param } from "express-validator";
import { validateRequest } from "../middlewares/validation.middleware";
import { authenticate } from "../middlewares/auth.middleware";


const router = Router();

// Validation des entrées pour les avis
const reviewValidation = [
  body("productId").notEmpty().withMessage("ID produit requis"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("La note doit être entre 1 et 5 étoiles"),
  body("comment")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Le commentaire ne doit pas dépasser 500 caractères"),
];

// Routes publiques
router.get(
  "/products/:id/reviews",
  validateRequest([
    param("id").isInt().withMessage("ID produit invalide"),
    param("sort")
      .optional()
      .isIn(["newest", "highest", "lowest"])
      .withMessage("Tri invalide"),
    param("search")
      .optional()
      .isString()
      .withMessage("Terme de recherche invalide"),
  ]),
  getProductReviews
);

router.get(
  "/products/:id/ratings/distribution",
  validateRequest([
    param("id").isInt().withMessage("ID produit invalide")
  ]),
  getRatingDistribution
);

// Route protégée pour ajouter un avis (CORRIGÉ)
router.post(
  "/reviews",
  authenticate,
  validateRequest(reviewValidation),
  addReview // Handler final sans appel direct
);

export default router;