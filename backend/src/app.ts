import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import productRoutes from "./routes/product.routes";
import reviewRoutes from "./routes/review.routes";
import authRoutes from "./routes/auth.routes";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import logger from "./utils/logger.util";
import rateLimit from "express-rate-limit";

const app = express();

// Middlewares de sécurité
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Compression des réponses
app.use(compression());

// Logging des requêtes
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  })
);

// Limitation du taux de requêtes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par fenêtre
  standardHeaders: true,
  legacyHeaders: false,
  message:
    "Trop de requêtes depuis cette adresse IP, veuillez réessayer plus tard",
});

app.use(limiter);

// Traitement des requêtes JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);

// Route de santé
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

// Middleware pour les routes non trouvées
app.use(notFoundHandler);

// Middleware centralisé de gestion d'erreurs
app.use(errorHandler);

export default app;
