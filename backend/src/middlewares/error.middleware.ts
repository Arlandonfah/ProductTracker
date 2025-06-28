import { Request, Response } from "express";
import { ValidationError } from "express-validator";
import { MulterError } from "multer";

// Interface pour les erreurs personnalisées
interface AppError extends Error {
  statusCode?: number;
  errors?: ValidationError[];
}

// Middleware centralisé de gestion d'erreurs
export const errorHandler = (
  err: AppError | MulterError | any,
  req: Request,
  res: Response
) => {
  // 1. Removed unused 'next' parameter
  const statusCode = err.statusCode || (err instanceof MulterError ? 400 : 500);

  // Messages d'erreur par défaut
  let message = "Une erreur est survenue";
  let details: any = null;

  // Gestion des erreurs spécifiques
  if (err instanceof MulterError) {
    message = "Erreur de traitement de fichier";
    details = { field: err.field, code: err.code };
  } else if (err.name === "ValidationError") {
    message = "Erreur de validation des données";
    // 2. Correction pour ValidationError sans 'param'
    details = err.errors?.map((e: ValidationError) => ({
      field: (e as any).path || (e as any).param, // Utilisation de 'path' ou 'param'
      message: e.msg,
    }));
  } else if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    message = "Erreur de validation de base de données";
    details = err.errors?.map((e: any) => ({
      field: e.path,
      message: e.message,
    }));
  } else if (err.errors && Array.isArray(err.errors)) {
    // Erreurs de validation express-validator
    message = "Données d'entrée invalides";
    // 3. Correction pour ValidationError sans 'param'
    details = err.errors.map((e: ValidationError) => ({
      field: (e as any).path || (e as any).param, // Utilisation de 'path' ou 'param'
      message: e.msg,
    }));
  } else if (typeof err === "string") {
    message = err;
  } else if (err.message) {
    message = err.message;
  }

  // Journalisation des erreurs (en développement)
  if (process.env.NODE_ENV !== "production") {
    console.error(`[${new Date().toISOString()}] Erreur:`, {
      message: err.message,
      stack: err.stack,
      status: statusCode,
      path: req.path,
      method: req.method,
    });
  }

  // Réponse d'erreur structurée
  res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details }),
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// Middleware pour les routes non trouvées
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route non trouvée: ${req.method} ${req.originalUrl}`,
  });
};
