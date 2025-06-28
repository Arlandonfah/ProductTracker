import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validation.middleware";
import { User } from "../models/user.model";
import { AppDataSource } from "../data-source";

const router = Router();

const loginValidation = validateRequest([
  body("username").trim().notEmpty().withMessage("Nom d'utilisateur requis"),
  body("password").notEmpty().withMessage("Mot de passe requis"),
]);

router.post(
  "/login",
  loginValidation,
  async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { username } });

      if (!user) {
        res.status(401).json({ error: "Identifiants invalides" }); 
        return; 
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({ error: "Identifiants invalides" }); 
        return; 
      }

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