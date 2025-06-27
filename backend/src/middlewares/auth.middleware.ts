import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Interface pour le payload JWT
interface JwtPayload {
  userId: number;
  role: string;
}

// Middleware d'authentification
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  // Vérifier la présence du header d'autorisation
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Authentification requise. Veuillez vous connecter.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "votre_secret_par_defaut"
    ) as JwtPayload;

    // Ajouter les informations utilisateur à la requête
    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    // Gestion des différents types d'erreurs JWT
    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(401)
        .json({ error: "Session expirée. Veuillez vous reconnecter." });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(401)
        .json({ error: "Token invalide. Authentification requise." });
    }

    return res.status(401).json({ error: "Échec de l'authentification" });
  }
};

// Middleware d'autorisation admin
export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      error: "Accès refusé. Autorisation administrateur requise.",
    });
  }

  next();
};
