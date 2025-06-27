import { Request, Response } from "express";
import { Product } from "../models/product.model";
import { AppDataSource } from "../data-source";
import { imageUpload } from "../utils/image.util";

const productRepository = AppDataSource.getRepository(Product);

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { title, description, price } = req.body;
    const imageUrl = await imageUpload(req.file);

    const product = new Product();
    product.title = title;
    product.description = description;
    product.price = parseFloat(price);
    product.imageUrl = imageUrl;

    await productRepository.save(product);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await productRepository.findOneBy({
      id: parseInt(req.params.id),
    });
    if (!product) return res.status(404).json({ error: "Produit non trouvé" });

    await productRepository.remove(product);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const [products, total] = await productRepository.findAndCount({
    skip,
    take: limit,
  });

  res.json({
    data: products,
    meta: { total, page, last_page: Math.ceil(total / limit) },
  });
};
