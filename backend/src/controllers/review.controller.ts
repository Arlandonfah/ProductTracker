import { Request, Response } from "express";
import { Review } from "../models/review.model";
import { Product } from "../models/product.model";
import { AppDataSource } from "../data-source";
//import { AuthenticatedRequest } from "../types/express";

const reviewRepository = AppDataSource.getRepository(Review);
const productRepository = AppDataSource.getRepository(Product);

interface AddReviewBody {
  productId: string;
  rating: number;
  comment?: string;
}

export const addReview = async (req: Request, res: Response) => {
  try {
    const body = req.body as unknown as AddReviewBody;
    const { productId, rating, comment } = body;

    if (!req.user) {
      res.status(401).json({ error: "Authentification requise" });
      return;
    }

    const userId = req.user.id;

    const product = await productRepository.findOneBy({
      id: parseInt(productId),
    });
    if (!product) {
      res.status(404).json({ error: "Produit non trouvé" });
      return;
    }

    const review = new Review();
    review.rating = rating;
    review.comment = comment || "";
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

// Ajout des fonctions manquantes qui étaient utilisées dans les routes
export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    const sort = (req.query.sort as string) || "newest";
    const search = (req.query.search as string) || "";

    const product = await productRepository.findOneBy({ id: productId });
    if (!product) {
      res.status(404).json({ error: "Produit non trouvé" });
      return;
    }

    const query = reviewRepository
      .createQueryBuilder("review")
      .where("review.productId = :productId", { productId })
      .andWhere("review.comment ILIKE :search", { search: `%${search}%` });

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

    const product = await productRepository.findOneBy({ id: productId });
    if (!product) {
      res.status(404).json({ error: "Produit non trouvé" });
      return;
    }

    const result = await reviewRepository
      .createQueryBuilder("review")
      .select("review.rating", "rating")
      .addSelect("COUNT(*)", "count")
      .where("review.productId = :productId", { productId })
      .groupBy("review.rating")
      .orderBy("review.rating")
      .getRawMany();

    const distribution = [1, 2, 3, 4, 5].map((rating) => {
      const ratingData = result.find((r) => parseInt(r.rating) === rating);
      return {
        rating,
        count: ratingData ? parseInt(ratingData.count) : 0,
      };
    });

    res.json(distribution);
  } catch (error) {
    console.error("Erreur lors de la récupération de la distribution:", error);
    res.status(500).json({
      error: "Erreur lors de la récupération de la distribution",
    });
  }
};
