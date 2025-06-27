import { Request, Response } from "express";
import { Review } from "../models/review.model";
import { Product } from "../models/product.model";
import { AppDataSource } from "../data-source";

const reviewRepository = AppDataSource.getRepository(Review);
const productRepository = AppDataSource.getRepository(Product);

export const addReview = async (req: Request, res: Response) => {
  try {
    const { productId, rating, comment } = req.body;
    const product = await productRepository.findOneBy({
      id: parseInt(productId),
    });
    if (!product) return res.status(404).json({ error: "Produit non trouvé" });

    const review = new Review();
    review.rating = rating;
    review.comment = comment;
    review.product = product;

    await reviewRepository.save(review);
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'ajout" });
  }
};

export const getProductReviews = async (req: Request, res: Response) => {
  const productId = parseInt(req.params.id);
  const { sort = "newest", search = "" } = req.query;

  const query = reviewRepository
    .createQueryBuilder("review")
    .where("review.productId = :productId", { productId })
    .andWhere("review.comment ILIKE :search", { search: `%${search}%` });

  if (sort === "highest") query.orderBy("review.rating", "DESC");
  else if (sort === "lowest") query.orderBy("review.rating", "ASC");
  else query.orderBy("review.createdAt", "DESC");

  const reviews = await query.getMany();
  res.json(reviews);
};

export const getRatingDistribution = async (req: Request, res: Response) => {
  const productId = parseInt(req.params.id);
  const result = await reviewRepository
    .createQueryBuilder("review")
    .select("review.rating", "rating")
    .addSelect("COUNT(*)", "count")
    .where("review.productId = :productId", { productId })
    .groupBy("review.rating")
    .orderBy("review.rating")
    .getRawMany();

  const distribution = Array(5)
    .fill(0)
    .map((_, i) => ({
      rating: i + 1,
      count: parseInt(result.find((r) => r.rating === i + 1)?.count || 0),
    }));

  res.json(distribution);
};
