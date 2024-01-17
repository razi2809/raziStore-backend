import { RequestHandler } from "express";
import { userServices } from "../../services/userServices";
import { sendEmail } from "../../config/utils/mailer";
import { myError } from "../../errors/errorType";
import mongoose from "mongoose";
import { jwtServices } from "../../services/jwtServices";
import BusinessModel from "../../config/dataBase/models/businessModel";

const userHandlers: {
  createUserHandler: RequestHandler;
  getUsersHandler: RequestHandler;
  getUserHandler: RequestHandler;
  getLikedPlaces: RequestHandler;
} = {
  createUserHandler: async (req, res, next) => {
    // Handler to create a new user
    const body = req.body;
    try {
      // Create user and send verification email
      const user = await userServices.createUser(body);
      await sendEmail({
        from: "razi289@outlook.com",
        to: user.email,
        subject: "please verify your account",
        text: `verification code ${user.verificationCode}. email:${user.email}`,
      });
      return res.status(200).json({ message: "User successfully created" });
    } catch (e) {
      return next(e);
    }
  },
  getUsersHandler: async (req, res, next) => {
    // Handler to get all users (Admin access required)
    const users = await userServices.getUsers().lean();
    // Fetch all users and remove sensitive information before sending
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
    // Handler to get a specific user's details
    const TokenInfo = req.JWT!;

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

  getLikedPlaces: async (req, res, next) => {
    // Handler to get liked places of a user
    const TokenInfo = req.JWT!;
    const { userId } = TokenInfo;
    // Fetch liked places for the user or requested user (for Admins)
    try {
      const myUser = await userServices.findUserById(userId).lean();
      if (!myUser) {
        return next(new myError("could get your user", 500));
      }
      if (!myUser.isAdmin) {
        const likedBusinesses = await BusinessModel.find({
          likes: { $in: [userId] },
        });
        if (likedBusinesses.length === 0) {
          return res.status(400).json({
            message: "user has no liked places",
          });
        }
        return res.status(200).json({
          message: "user liked places fetched successfully",
          likedPlaces: likedBusinesses,
        });
      }
      const { userId: askedUserId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(askedUserId)) {
        return next(new myError("Invalid User ID", 400));
      }
      const likedBusinesses = await BusinessModel.find({
        likes: { $in: [askedUserId] },
      });
      if (likedBusinesses.length === 0) {
        return res.status(400).json({
          message: "user has no liked places",
        });
      }
      return res.status(200).json({
        message: "user liked places fetched successfully",
        likedPlaces: likedBusinesses,
      });
    } catch (e) {
      return next(e);
    }
  },
};
export { userHandlers };
