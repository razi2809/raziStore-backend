import { RequestHandler } from "express";
import { jwtServices } from "../services/jwtServices";
import { myError } from "../errors/errorType";

const tokenHandlers: {
  tokenExtractor: RequestHandler;
} = {
  tokenExtractor: async (req, res, next) => {
    const TokenInfo = jwtServices.extractToken(req);
    // Fetch user details based on TokenInfo or requested UserId

    if (TokenInfo instanceof myError) {
      return next(TokenInfo);
    }
    if (!TokenInfo) {
      return next(new myError("token is missing", 403));
    }
    req.JWT = TokenInfo;

    return next();
  },
};
export { tokenHandlers };
