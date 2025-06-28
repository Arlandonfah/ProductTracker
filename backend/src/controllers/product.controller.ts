import { Request, Response } from "express";
import { Product } from "../models/product.model";
import { AppDataSource } from "../data-source";
import { imageUpload } from "../utils/image.util";

const productRepository = AppDataSource.getRepository(Product);

export const getProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const [products, total] = await productRepository.findAndCount({
      skip,
      take: limit,
      relations: ["reviews"],
    });

    const productsWithAvgRating = products.map((product) => {
      const ratings = product.reviews?.map((r) => r.rating) || [];
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
          : 0;

      return {
        ...product,
        averageRating: parseFloat(avgRating.toFixed(1)),
      };
    });

    res.json({
      data: productsWithAvgRating,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des produits" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await productRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ["reviews"],
    });

    if (!product) {
      res.status(404).json({ error: "Produit non trouvé" });
      return; // Ajout d'un return pour sortir de la fonction
    }

    const ratings = product.reviews?.map((r) => r.rating) || [];
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
        : 0;

    res.json({
      ...product,
      averageRating: parseFloat(avgRating.toFixed(1)),
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération du produit" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { title, description, price } = req.body;

    if (!req.file) {
      res.status(400).json({ error: "Image du produit requise" });
      return; // Ajout d'un return pour sortir de la fonction
    }

    const imageUrl = await imageUpload(req.file);

    const product = new Product();
    product.title = title;
    product.description = description;
    product.price = parseFloat(price);
    product.imageUrl = imageUrl;

    await productRepository.save(product);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création du produit" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    const { title, description, price } = req.body;

    const product = await productRepository.findOneBy({ id: productId });
    if (!product) {
      res.status(404).json({ error: "Produit non trouvé" });
      return; // Ajout d'un return pour sortir de la fonction
    }

    product.title = title || product.title;
    product.description = description || product.description;

    if (price) {
      product.price = parseFloat(price);
    }

    if (req.file) {
      product.imageUrl = await imageUpload(req.file);
    }

    await productRepository.save(product);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour du produit" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    const product = await productRepository.findOneBy({ id: productId });

    if (!product) {
      res.status(404).json({ error: "Produit non trouvé" });
      return; // Ajout d'un return pour sortir de la fonction
    }

    await productRepository.remove(product);
    res.status(204).end(); // Utilisation de .end() au lieu de .send()
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression du produit" });
  }
};
