import { Router } from "express";
import {
  Theme,
  addAdressSchema,
  createUserValidition,
  forgotPassword,
  getUser,
  image,
  nameChange,
  passwordReset,
  phoneChange,
  userEmailChange,
  verifyUser,
} from "../config/schema/userSchema";
import { userHandlers } from "../middleware/userRelatedHandlers/userHandler";
import { validate } from "../middleware/validation";
import { authHandlers } from "../middleware/authHandler";
import { updateUserHandlers } from "../middleware/userRelatedHandlers/updateUserHandler";
import { tokenHandlers } from "../middleware/tokenHandler";
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
  updateUserHandlers.verifyUserHandler
);
router.post(
  "/forgotpassword",
  validate(forgotPassword),
  updateUserHandlers.userForgotPasswordHandler
);
router.post(
  "/resetPassword/:email/:passwordResetCode",
  validate(passwordReset),
  updateUserHandlers.resetPasswordHadler
);
router.post(
  "/theme",
  validate(Theme),
  tokenHandlers.tokenExtractor,
  updateUserHandlers.changeUserThemeHandler
);
router.get(
  "/",
  tokenHandlers.tokenExtractor,
  authHandlers.UserIsAdmin,
  userHandlers.getUsersHandler
);
router.get(
  "/:UserId",
  validate(getUser),
  tokenHandlers.tokenExtractor,
  userHandlers.getUserHandler
);
router.get(
  "/likes/likedplaces/:userId",
  tokenHandlers.tokenExtractor,
  authHandlers.UserIsVerified,
  userHandlers.getLikedPlaces
);
router.patch(
  "/address/addNew",
  validate(addAdressSchema),
  authHandlers.UserIsVerified,
  updateUserHandlers.addUserAdressHandler
);
router.delete(
  "/:UserId",
  validate(getUser),
  tokenHandlers.tokenExtractor,
  updateUserHandlers.deleteUserHandler
);
router.patch(
  "/image/:UserId",
  validate(image),
  tokenHandlers.tokenExtractor,
  updateUserHandlers.changeUserProfilePicHandler
);
router.patch(
  "/name/:UserId",
  validate(nameChange),
  tokenHandlers.tokenExtractor,
  updateUserHandlers.changeUserNameHandler
);
router.patch(
  "/email/:UserId",
  validate(userEmailChange),
  tokenHandlers.tokenExtractor,
  updateUserHandlers.changeUserEmailHandler
);
router.patch(
  "/phone/:UserId",
  validate(phoneChange),
  tokenHandlers.tokenExtractor,
  updateUserHandlers.changeUserPhoneHandler
);
export { router as userRoter };
