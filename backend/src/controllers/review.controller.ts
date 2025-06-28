import { Request, Response } from "express";
import { Review } from "../models/review.model";
import { Product } from "../models/product.model";
import { AppDataSource } from "../data-source";

const reviewRepository = AppDataSource.getRepository(Review);
const productRepository = AppDataSource.getRepository(Product);

export const addReview = async (req: Request, res: Response) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = (req as any).user.id; // Récupéré du middleware d'authentification

    // Vérifier si le produit existe
    const product = await productRepository.findOneBy({
      id: parseInt(productId),
    });
    if (!product) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    // Créer le nouvel avis
    const review = new Review();
    review.rating = rating;
    review.comment = comment;
    review.product = product;
    review.userId = userId;

    await reviewRepository.save(review);

    res.status(201).json({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'avis:", error);
    res.status(500).json({ error: "Erreur lors de l'ajout de l'avis" });
  }
};

export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    const { sort = "newest", search = "" } = req.query;

    // Vérifier si le produit existe
    const productExists = await productRepository.exist({
      where: { id: productId },
    });
    if (!productExists) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    // Construire la requête avec les filtres
    const query = reviewRepository
      .createQueryBuilder("review")
      .where("review.productId = :productId", { productId })
      .andWhere("review.comment ILIKE :search", { search: `%${search}%` });

    // Appliquer le tri
    if (sort === "highest") {
      query.orderBy("review.rating", "DESC");
    } else if (sort === "lowest") {
      query.orderBy("review.rating", "ASC");
    } else {
      query.orderBy("review.createdAt", "DESC");
    }

    const reviews = await query.getMany();

    res.json(
      reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        userId: r.userId,
      }))
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des avis:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des avis" });
  }
};

export const getRatingDistribution = async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);

    // Vérifier si le produit existe
    const productExists = await productRepository.exist({
      where: { id: productId },
    });
    if (!productExists) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    // Récupérer la distribution des notes
    const result = await reviewRepository
      .createQueryBuilder("review")
      .select("review.rating", "rating")
      .addSelect("COUNT(*)", "count")
      .where("review.productId = :productId", { productId })
      .groupBy("review.rating")
      .orderBy("review.rating")
      .getRawMany();

    // Formater les résultats pour inclure toutes les notes possibles
    const distribution = Array(5)
      .fill(0)
      .map((_, i) => {
        const rating = i + 1;
        const ratingData = result.find((r) => r.rating === rating);
        return {
          rating,
          count: ratingData ? parseInt(ratingData.count) : 0,
        };
      });

    res.json(distribution);
  } catch (error) {
    console.error("Erreur lors de la récupération de la distribution:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération de la distribution" });
  }
};
