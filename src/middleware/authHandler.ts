import { RequestHandler } from "express";
import { userServices } from "../services/userServices";
import { myError } from "../errors/errorType";
import { jwtServices } from "../services/jwtServices";
import log from "../config/utils/logger";
import { User } from "../config/dataBase/models/userModel";

const authHandlers: {
  logInHandler: RequestHandler;
  UserIsAdmin: RequestHandler;
  UserIsBusiness: RequestHandler;
  UserIsVerified: RequestHandler;
  UserIsNotVerified: RequestHandler;
} = {
  logInHandler: async (req, res, next) => {
    const message = "invalid email or password";
    const { email, password } = req.body;
    try {
      const user = await userServices.findUserByEmail(email);
      if (!user) {
        return next(new myError(message, 401));
      }
      if (!user.verified) {
        return next(new myError("please verify your email", 403));
      }
      const isValid = await user.validatePassword(password);
      if (!isValid) {
        return next(new myError(message, 401));
      }
      //create token
      const token = jwtServices.generateToken({
        email: user.email,
        userId: user._id,
      });
      return res.status(200).json({
        message: "login success",
        token: token,
      });
    } catch (e) {
      return next(e);
    }
  },
  UserIsAdmin: async (req, res, next) => {
    const TokenInfo = jwtServices.extractToken(req);
    if (TokenInfo instanceof myError) {
      return next(TokenInfo);
    }
    if (!TokenInfo) {
      return next(new myError("token is missing", 403));
    }
    const user = await userServices.findUserByEmail(TokenInfo.email);
    if (user?.isAdmin) {
      log.info("user auth level is admin");
      return next();
    }
    log.info("user auth level is none");
    return next(new myError("user is not permitted", 403));
  },
  UserIsBusiness: async (req, res, next) => {
    const TokenInfo = jwtServices.extractToken(req);
    if (TokenInfo instanceof myError) {
      return next(TokenInfo);
    }
    if (!TokenInfo) {
      return next(new myError("token is missing", 403));
    }
    const user = await userServices.findUserByEmail(TokenInfo.email);
    if (user?.isBusiness) {
      log.info("user auth level is business");
      return next();
    }
    log.info("user auth level is none");
    return next(new myError("user is not permitted", 403));
  },
  UserIsVerified: async (req, res, next) => {
    const TokenInfo = jwtServices.extractToken(req);
    if (TokenInfo instanceof myError) {
      return next(TokenInfo);
    }
    if (!TokenInfo) {
      return next(new myError("token is missing", 403));
    }
    const user = await userServices.findUserByEmail(TokenInfo.email);
    if (!user) {
      return next(new myError("user not found", 404));
    }
    if (user?.verified) {
      log.info("user is verified");
      req.JWT = TokenInfo;
      req.user = user;
      return next();
    }
    return next(new myError("user is not verified", 403));
  },
  UserIsNotVerified: async (req, res, next) => {
    const TokenInfo = jwtServices.extractToken(req);
    if (TokenInfo instanceof myError) {
      return next(TokenInfo);
    }
    if (!TokenInfo) {
      return next(new myError("token is missing", 403));
    }
    const user = await userServices.findUserByEmail(TokenInfo.email);
    if (!user?.verified) {
      log.info("user is not verified");
      req.JWT = TokenInfo;
      return next();
    }
    return next(new myError("user is already verified", 403));
  },
};
export { authHandlers };
