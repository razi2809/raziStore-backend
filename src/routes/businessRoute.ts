import { Router } from "express";
import { authHandlers } from "../middleware/authHandler";
import {
  Business,
  createBusinessSchema,
} from "../config/schema/businessSchema";
import { validate } from "../middleware/validation";
import { businessHandlers } from "../middleware/businessHandler";

const router = Router();
router.post(
  "/newBussiness",
  validate(createBusinessSchema),
  authHandlers.UserIsAdmin,
  businessHandlers.createbusinessHandler
);
router.get("/", businessHandlers.findbusinessesHandler);
router.get(
  "/:BusinessId",
  validate(Business),
  businessHandlers.findbusinessHandler
);
router.patch(
  "/:BusinessId",
  validate(Business),
  authHandlers.UserIsVerified,
  businessHandlers.likeUnlikbusinessHandler
);
export { router as businessRotue };
