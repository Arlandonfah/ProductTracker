import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Product } from "./product.model";

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  rating: number; // 1-5

  @Column({ type: "text", nullable: true }) 
  comment: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  userId: number; // ID de l'utilisateur qui a posté l'avis

  @ManyToOne(() => Product, (product) => product.reviews)
  product: Product;
}
