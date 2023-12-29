import { RequestHandler } from "express";
import { userServices } from "../services/userServices";
import { sendEmail } from "../config/utils/mailer";
import { myError } from "../errors/errorType";
import log from "../config/utils/logger";
import mongoose, { ObjectId, Types } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { Request, Response, NextFunction } from "express";
import { passwodResetInput } from "../config/schema/userSchema";
import { jwtServices } from "../services/jwtServices";

const userHandlers: {
  createUserHandler: RequestHandler;
  verifyUserHandler: RequestHandler;
  userForgotPasswordHandler: RequestHandler;
  resetPasswordHadler: RequestHandler;
  getUsersHandler: RequestHandler;
  getUserHandler: RequestHandler;
  changeUserTheme: RequestHandler;
} = {
  createUserHandler: async (req, res, next) => {
    const body = req.body;
    try {
      const user = await userServices.createUser(body);
      await sendEmail({
        from: "razi289@outlook.com",
        to: user.email,
        subject: "please verify your account",
        text: `verification code ${user.verificationCode}. email:${user.email}`,
      });
      return res.status(200).send("User successfully created");
    } catch (e) {
      return next(e);
    }
  },
  verifyUserHandler: async (req, res, next) => {
    const { email } = req.params;
    const { verificationCode } = req.params;
    //find the user by id to check if already verified
    try {
      const user = await userServices.findUserByEmail(email);

      if (!user) {
        return next(new myError("user does not exist on data base", 404));
      }
      if (user.verified) {
        return res.status(300).send("user is already verified");
      }
      if (user.verificationCode === verificationCode) {
        user.verified = true;
        await user.save();
        return res.status(200).send("user verified");
      }
      return next(new myError("user verification code is wrong", 401));
    } catch (e) {
      return next(e);
    }
  },
  userForgotPasswordHandler: async (req, res, next) => {
    const { email } = req.body;
    const message =
      "if a user with that email is registerd you will receive a password rest email";
    try {
      const user = await userServices.findUserByEmail(email);
      if (!user) {
        log.info(`user with email ${email} does not exist`);
        return res.send(message);
      }
      if (!user.verified) {
        return next(new myError("User is not verified", 403));
      }
      const passwordResetCode = uuidv4();
      user.passwordResetCode = passwordResetCode;
      await user.save();
      await sendEmail({
        to: user.email,
        from: "razi289@outlook.com",
        subject: "reset your code",
        text: ` password reset code:${passwordResetCode}. email: ${user.email}`,
      });
      log.info(`password reset email sent to ${email}`);
      return res.send(message);
    } catch (e) {
      return next(e);
    }
  },
  resetPasswordHadler: async (req, res, next) => {
    const { email, passwodResetCode } = req.params;
    const { password } = req.body;
    const user = await userServices.findUserByEmail(email);
    if (
      !user ||
      !user.passwordResetCode ||
      user.passwordResetCode !== passwodResetCode
    ) {
      return next(new myError("could not reset password", 400));
    }
    user.passwordResetCode = null;
    user.password = password;
    await user.save();
    return res.status(200).send("password changed");
  },
  getUsersHandler: async (req, res, next) => {
    const users = await userServices.getUsers().lean();

    if (users.length === 0) {
      return next(new myError("problem fetching users", 404));
    }
    const usersWithoutPassword = users.map((user) => {
      const {
        password,
        verificationCode,
        validatePassword,
        verified,
        passwordResetCode,
        ...rest
      } = user;
      return rest;
    });
    res.status(200).json({
      message: "users fetch successfully",
      users: usersWithoutPassword,
    });
  },
  getUserHandler: async (req, res, next) => {
    const TokenInfo = jwtServices.extractToken(req);
    if (TokenInfo instanceof myError) {
      return next(TokenInfo);
    }
    if (!TokenInfo) {
      return next(new myError("token is missing", 403));
    }
    const { userId } = TokenInfo;
    try {
      const myUser = await userServices.findUserById(userId).lean();
      if (!myUser) {
        return next(new myError("could get your user", 500));
      }
      if (!myUser.isAdmin) {
        const {
          password,
          verificationCode,
          validatePassword,
          verified,
          passwordResetCode,
          ...rest
        } = myUser;
        return res
          .status(200)
          .json({ message: "user fetched successfully", user: rest });
      }
      const { UserId: askedUserId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(askedUserId)) {
        return next(new myError("Invalid User ID", 400));
      }
      const askedUser = await userServices.findUserById(askedUserId).lean();
      if (!askedUser) {
        return next(new myError("could get the asked user", 500));
      }
      const {
        password,
        verificationCode,
        validatePassword,
        verified,
        passwordResetCode,
        ...rest
      } = askedUser;
      return res
        .status(200)
        .json({ message: "user fetched successfully", user: rest });
    } catch (e) {
      return next(e);
    }
  },
  changeUserTheme: async (req, res, next) => {
    const TokenInfo = jwtServices.extractToken(req);
    const body = req.body;
    const { Theme } = body;
    if (TokenInfo instanceof myError) {
      return next(TokenInfo);
    }
    if (!TokenInfo) {
      return next(new myError("token is missing", 403));
    }
    const { userId } = TokenInfo;
    try {
      const myUser = await userServices.findUserById(userId);
      if (!myUser) {
        return next(new myError("could get your user", 500));
      }
      myUser.theme = Theme;
      myUser.save();
      return res.status(200).json({ message: `user theme is ${Theme}` });
    } catch (e) {
      return next(e);
    }
  },
};
export { userHandlers };
