import { Router, Request, Response } from "express"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validation.middleware";
import { User } from "../models/user.model";
import { AppDataSource } from "../data-source"; 

const router = Router();

// Correction : Création du middleware de validation séparément
const loginValidation = validateRequest([
  body("username").trim().notEmpty().withMessage("Nom d'utilisateur requis"),
  body("password").notEmpty().withMessage("Mot de passe requis"),
]);

router.post(
  "/login",
  loginValidation,
  // Correction du typage pour le handler
  async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
      // Correction : Utilisation du repository pour accéder à findOne
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { username } });

      if (!user) {
        return res.status(401).json({ error: "Identifiants invalides" });
      }

      // Vérification du mot de passe
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ error: "Identifiants invalides" });
      }

      // Génération du token JWT
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET || "votre_secret_par_defaut",
        { expiresIn: "1h" }
      );

      // Correction : Ajout du return pour le type de retour
      return res.json({ token });
    } catch (error) {
      console.error("Erreur de connexion:", error);
      // Correction : Ajout du return
      return res.status(500).json({ error: "Erreur de serveur" });
    }
  }
);

export default router;