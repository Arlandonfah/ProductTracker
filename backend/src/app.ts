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

// Middleware de sécurité HTTP
app.use(helmet());

// Configuration CORS
app.use(
  cors({
    origin: "http://localhost:3000", // autorise uniquement le frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // permet les cookies et headers sécurisés
  })
);

// Compression des réponses
app.use(compression());

// Logging des requêtes HTTP
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
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message:
    "Trop de requêtes depuis cette adresse IP, veuillez réessayer plus tard",
});
app.use(limiter);

// Traitement du corps des requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes principales
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);

// Route de santé
app.get("/health", (_, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

// Middleware pour route non trouvée
app.use(notFoundHandler);

// Middleware global de gestion d’erreur
app.use(errorHandler);

export default app;
