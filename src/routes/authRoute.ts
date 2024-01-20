import { Router } from "express";
import { validate } from "../middleware/validation";
import { loginSchema } from "../config/schema/authSchema";
import { authHandlers } from "../middleware/authHandler";

const router = Router();
router.post("/login", validate(loginSchema), authHandlers.logInHandler);

export { router as authRoter };
