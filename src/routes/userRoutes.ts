import { Router } from "express";
import {
  Theme,
  createUserValidition,
  forgotPassword,
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
  "/resetPassword/:email/:passwodResetCode",
  validate(passwordReset),
  userHandlers.resetPasswordHadler
);
router.post("/theme", validate(Theme), userHandlers.changeUserTheme);
router.get("/", authHandlers.UserIsAdmin, userHandlers.getUsersHandler);
router.get("/:UserId", userHandlers.getUserHandler);
export { router as userRoter };
