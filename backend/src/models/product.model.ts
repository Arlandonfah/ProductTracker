import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Review } from "./review.model";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column("text")
  description: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @Column()
  imageUrl: string;

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];
}
