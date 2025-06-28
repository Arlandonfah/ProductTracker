import { AuthenticatedRequest } from "@src/types/express";
import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: number;
  role: string;
}

export const authenticate: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      error: "Authentification requise. Veuillez vous connecter.",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "votre_secret_par_defaut"
    ) as JwtPayload;

    // Ajout des informations utilisateur à la requête
    (req as unknown as AuthenticatedRequest).user = {
      id: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res
        .status(401)
        .json({ error: "Session expirée. Veuillez vous reconnecter." });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res
        .status(401)
        .json({ error: "Token invalide. Authentification requise." });
      return;
    }

    res.status(401).json({ error: "Échec de l'authentification" });
  }
};

export const authorizeAdmin: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;

  if (!user || user.role !== "admin") {
    res.status(403).json({
      error: "Accès refusé. Autorisation administrateur requise.",
    });
    return;
  }

  next();
};
