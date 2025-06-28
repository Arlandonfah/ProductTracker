import { AddReviewBody } from "../controllers/review.controller";

declare module "express-serve-static-core" {
  interface Request {
    body: AddReviewBody | any;
  }
}