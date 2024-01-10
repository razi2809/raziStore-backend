import { Router } from "express";
import {
  Theme,
  addAdressSchema,
  createUserValidition,
  forgotPassword,
  getUser,
  passwordReset,
  verifyUser,
} from "../config/schema/userSchema";
import { userHandlers } from "../middleware/userHandler";
import { validate } from "../middleware/validation";
import { authHandlers } from "../middleware/authHandler";
//TODO:add register by google services
const router = Router();
router.post(
  "/register",
  validate(createUserValidition),
  userHandlers.createUserHandler
);
router.post(
  "/verify/:email/:verificationCode",
  validate(verifyUser),
  userHandlers.verifyUserHandler
);
router.post(
  "/forgotpassword",
  validate(forgotPassword),
  userHandlers.userForgotPasswordHandler
);
router.post(
  "/resetPassword/:email/:passwordResetCode",
  validate(passwordReset),
  userHandlers.resetPasswordHadler
);
router.post("/theme", validate(Theme), userHandlers.changeUserTheme);
router.get("/", authHandlers.UserIsAdmin, userHandlers.getUsersHandler);
router.get(
  "/:UserId",
  validate(getUser),

  userHandlers.getUserHandler
);
router.get(
  "/likes/likedplaces/:userId",
  authHandlers.UserIsVerified,
  userHandlers.getLikedPlaces
);
router.patch(
  "/address/addNew",
  validate(addAdressSchema),
  authHandlers.UserIsVerified,
  userHandlers.addUserAdress
);
export { router as userRoter };
