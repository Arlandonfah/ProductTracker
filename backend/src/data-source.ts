import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Product } from "./models/product.model";
import { Review } from "./models/review.model";
import { User } from "./models/user.model";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "products",
  synchronize: true,
  logging: false,
  entities: [Product, Review, User],
  migrations: [],
  subscribers: [],
});
