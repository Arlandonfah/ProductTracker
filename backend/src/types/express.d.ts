import { User } from "../models/user";
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    role: string;
  };
}
