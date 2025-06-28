import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain } from "express-validator";
import { RequestHandler } from "express";

export const validateRequest = (
  validations: ValidationChain[]
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      errors: errors.array().map((err) => ({
        field: (err as any).path || (err as any).param,
        message: err.msg,
      })),
    });
  };
};
