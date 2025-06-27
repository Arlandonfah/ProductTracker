import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/product.routes";
import reviewRoutes from "./routes/review.routes";
import authRoutes from "./routes/auth.routes";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import { authenticate, authorizeAdmin } from "./middlewares/auth.middleware";

// Charger les variables d'environnement
dotenv.config();

const app = express();

// Middlewares de base
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes publiques
app.use("/api/auth", authRoutes);

// Routes protégées par authentification
app.use("/api/products", authenticate, productRoutes);

// Routes admin protégées
app.use("/admin/products", authenticate, authorizeAdmin, productRoutes);

app.use("/api/reviews", reviewRoutes);

// Middleware pour les routes non trouvées
app.use(notFoundHandler);

// Middleware centralisé de gestion d'erreurs
app.use(errorHandler);

export default app;
