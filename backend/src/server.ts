import "reflect-metadata";
import dotenv from "dotenv";
import app from "./app";
import { AppDataSource } from "./data-source";
import logger from "./utils/logger.util";

// Charger les variables d'environnement
dotenv.config();

const PORT = process.env.PORT || 5000;

// Initialiser la connexion à la base de données
AppDataSource.initialize()
  .then(async () => {
    logger.info("Base de données connectée avec succès");

    // Démarrer le serveur Express
    app.listen(PORT, () => {
      logger.info(`Serveur démarré sur le port ${PORT}`);
      logger.info(`Environnement: ${process.env.NODE_ENV || "développement"}`);
    });
  })
  .catch((error) => {
    logger.error("Erreur de connexion à la base de données:", error);
    process.exit(1);
  });

// Gestion propre des arrêts
process.on("SIGINT", () => {
  logger.info("Arrêt du serveur");
  process.exit(0);
});

process.on("uncaughtException", (error) => {
  logger.error("Exception non capturée:", error);
  process.exit(1);
});

// Correction : remplacement de 'promise' par '_'
process.on("unhandledRejection", (reason, _) => {
  logger.error("Rejet de promesse non géré:", reason);
  process.exit(1);
});