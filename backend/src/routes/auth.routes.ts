import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validation.middleware";
import User from "../models/user.model";

const router = Router();

router.post(
  "/login",
  [
    body("username").trim().notEmpty().withMessage("Nom d'utilisateur requis"),
    body("password").notEmpty().withMessage("Mot de passe requis"),
  ],
  validateRequest,
  async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ where: { username } });

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

      res.json({ token });
    } catch (error) {
      console.error("Erreur de connexion:", error);
      res.status(500).json({ error: "Erreur de serveur" });
    }
  }
);

export default router;
