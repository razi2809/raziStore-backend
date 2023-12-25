import { IUser } from "../config/schema/userSchema";

type JWTpayload = {
  email: string;
  iat?: string;
  userId: TypeExpressionOperatorReturningObjectId;
};
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      JWT?: JWTpayload;
    }
  }
}
export { JWTpayload };
