import { RequestHandler } from "express";
import { userServices } from "../../services/userServices";
import { myError } from "../../errors/errorType";
import { sendEmail } from "../../config/utils/mailer";
import log from "../../config/utils/logger";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const updateUserHandlers: {
  verifyUserHandler: RequestHandler;
  userForgotPasswordHandler: RequestHandler;
  resetPasswordHadler: RequestHandler;
  changeUserThemeHandler: RequestHandler;
  deleteUserHandler: RequestHandler;
  addUserAdressHandler: RequestHandler;
  changeUserProfilePicHandler: RequestHandler;
  changeUserNameHandler: RequestHandler;
  changeUserEmailHandler: RequestHandler;
  changeUserPhoneHandler: RequestHandler;
} = {
  verifyUserHandler: async (req, res, next) => {
    // Handler to verify a user's email
    const { email } = req.params;
    const { verificationCode } = req.params;
    //find the user by id to check if already verified
    try {
      const user = await userServices.findUserByEmail(email);

      if (!user) {
        return next(new myError("user does not exist on data base", 404));
      }
      if (user.verified) {
        return res.status(300).json({ message: "user is already verified" });
      }
      if (user.verificationCode === verificationCode) {
        user.verified = true;
        await user.save();
        return res.status(200).json({ message: "user verified" });
      }
      return next(new myError("user verification code is wrong", 401));
    } catch (e) {
      return next(e);
    }
  },
  userForgotPasswordHandler: async (req, res, next) => {
    // Handler for user's forgot password request
    const { email } = req.body;
    const message =
      "if a user with that email is registerd you will receive a password rest email";
    try {
      // Process forgot password request and send email if user exists
      const user = await userServices.findUserByEmail(email);
      if (!user) {
        log.info(`user with email ${email} does not exist`);
        return res.json({ message: message });
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
      return res.json({ message: message });
    } catch (e) {
      return next(e);
    }
  },
  resetPasswordHadler: async (req, res, next) => {
    // Handler to reset a user's password
    const { email, passwordResetCode } = req.params;
    const { password } = req.body;
    // Validate reset code and update password
    try {
      const user = await userServices.findUserByEmail(email);
      if (
        !user ||
        !user.passwordResetCode ||
        user.passwordResetCode !== passwordResetCode
      ) {
        return next(new myError("could not reset password", 400));
      }
      user.passwordResetCode = null;
      user.password = password;
      await user.save();
      return res.status(200).json({ message: "password changed" });
    } catch (e) {
      return next(e);
    }
  },
  changeUserThemeHandler: async (req, res, next) => {
    // Handler to change a user's theme preference

    const body = req.body;
    const { Theme } = body;
    const TokenInfo = req.JWT!;

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
  addUserAdressHandler: async (req, res, next) => {
    // Handler to add a new address fomr a user
    const { address } = req.body;
    // Add new address to user's profile
    const TokenInfo = req.JWT!;
    const { userId } = TokenInfo;
    try {
      const addAddress = await userServices.addAddressToUser(userId, address);
      if (addAddress === "address exist") {
        return next(new myError("address already exists", 403));
      }
      return res.status(200).json({ message: "address saved successfully" });
    } catch (e) {
      return next(e);
    }
  },
  deleteUserHandler: async (req, res, next) => {
    const TokenInfo = req.JWT!;
    const { userId } = TokenInfo;
    try {
      const myUser = await userServices.findUserById(userId).lean();
      if (!myUser) {
        return next(new myError("could get your user", 500));
      }
      if (!myUser.isAdmin) {
        await userServices.deleteUser(userId);
        return res.status(200).json({ message: "your user was deleted" });
      }
      const { UserId: askedUserId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(askedUserId)) {
        return next(new myError("Invalid User ID", 400));
      }
      await userServices.deleteUser(askedUserId);
      return res.status(200).json({ message: "the user was deleted" });
    } catch (e) {
      return next(e);
    }
  },
  changeUserProfilePicHandler: async (req, res, next) => {
    const TokenInfo = req.JWT!;

    const { userId } = TokenInfo;
    const { image } = req.body;
    try {
      const myUser = await userServices.findUserById(userId).lean();
      if (!myUser) {
        return next(new myError("could get your user", 500));
      }
      if (!myUser.isAdmin) {
        await userServices.updateProfilePicture(userId, image);
        return res.status(200).json({ message: "your profilePic was updated" });
      }
      const { UserId: askedUserId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(askedUserId)) {
        return next(new myError("Invalid User ID", 400));
      }
      await userServices.updateProfilePicture(askedUserId, image);
      return res
        .status(200)
        .json({ message: "the user profilePic was updated" });
    } catch (e) {
      return next(e);
    }
  },
  changeUserNameHandler: async (req, res, next) => {
    const TokenInfo = req.JWT!;

    const { userId } = TokenInfo;
    const { name } = req.body;
    try {
      const myUser = await userServices.findUserById(userId).lean();
      if (!myUser) {
        return next(new myError("could get your user", 500));
      }
      if (!myUser.isAdmin) {
        await userServices.updateName(userId, name);
        return res.status(200).json({ message: "your name was updated" });
      }
      const { UserId: askedUserId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(askedUserId)) {
        return next(new myError("Invalid User ID", 400));
      }
      await userServices.updateName(askedUserId, name);
      return res.status(200).json({ message: "the user name was updated" });
    } catch (e) {
      return next(e);
    }
  },
  changeUserEmailHandler: async (req, res, next) => {
    const TokenInfo = req.JWT!;
    const { userId } = TokenInfo;
    const { email } = req.body;
    try {
      const myUser = await userServices.findUserById(userId).lean();
      if (!myUser) {
        return next(new myError("could get your user", 500));
      }
      if (!myUser.isAdmin) {
        await userServices.updateEmail(userId, email);
        return res.status(200).json({ message: "your email was updated" });
      }
      const { UserId: askedUserId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(askedUserId)) {
        return next(new myError("Invalid User ID", 400));
      }
      await userServices.updateEmail(askedUserId, email);
      return res.status(200).json({ message: "the user email  was updated" });
    } catch (e) {
      return next(e);
    }
  },
  changeUserPhoneHandler: async (req, res, next) => {
    const TokenInfo = req.JWT!;
    const { userId } = TokenInfo;
    const { phoneNumber } = req.body;
    try {
      const myUser = await userServices.findUserById(userId).lean();
      if (!myUser) {
        return next(new myError("could get your user", 500));
      }
      if (!myUser.isAdmin) {
        await userServices.updatePhone(userId, phoneNumber);
        return res.status(200).json({ message: "your phone was updated" });
      }
      const { UserId: askedUserId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(askedUserId)) {
        return next(new myError("Invalid User ID", 400));
      }
      await userServices.updatePhone(askedUserId, phoneNumber);
      return res.status(200).json({ message: "the user phone  was updated" });
    } catch (e) {
      return next(e);
    }
  },
};
export { updateUserHandlers };
