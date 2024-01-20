import { Router } from "express";
import { authHandlers } from "../middleware/authHandler";
import {
  Business,
  businessDescriptionChange,
  businessEmailChange,
  businessImageChange,
  businessNameChange,
  businessPhoneChange,
  createBusinessSchema,
} from "../config/schema/businessSchema";
import { validate } from "../middleware/validation";
import { businessHandlers } from "../middleware/businessHandler";
import { tokenHandlers } from "../middleware/tokenHandler";

const router = Router();
router.post(
  "/newBussiness",
  validate(createBusinessSchema),
  tokenHandlers.tokenExtractor,
  authHandlers.UserIsAdmin,
  businessHandlers.createbusinessHandler
);
router.get("/", businessHandlers.findbusinessesHandler);
router.get(
  "/:BusinessId",
  validate(Business),
  businessHandlers.findbusinessHandler
);
router.get(
  "/userLikes/:BusinessId",
  validate(Business),
  tokenHandlers.tokenExtractor,
  authHandlers.UserIsBusiness,
  businessHandlers.getBusinessLikes
);
router.get(
  "/purchases/:BusinessId",
  validate(Business),
  tokenHandlers.tokenExtractor,
  authHandlers.UserIsBusiness,
  businessHandlers.getBusinessOrders
);

router.patch(
  "/:BusinessId",
  validate(Business),
  tokenHandlers.tokenExtractor,
  authHandlers.UserIsVerified,
  businessHandlers.likeUnlikbusinessHandler
);
router.patch(
  "/email/:BusinessId",
  validate(businessEmailChange),
  tokenHandlers.tokenExtractor,
  authHandlers.UserIsBusiness,
  businessHandlers.changeBusinessEmail
);
router.patch(
  "/name/:BusinessId",
  validate(businessNameChange),
  tokenHandlers.tokenExtractor,
  authHandlers.UserIsBusiness,
  businessHandlers.changeBusinessName
);
router.patch(
  "/phone/:BusinessId",
  validate(businessPhoneChange),
  tokenHandlers.tokenExtractor,
  authHandlers.UserIsBusiness,
  businessHandlers.changeBusinessPhone
);
router.patch(
  "/description/:BusinessId",
  validate(businessDescriptionChange),
  tokenHandlers.tokenExtractor,
  authHandlers.UserIsBusiness,
  businessHandlers.changeBusinessDescription
);
router.patch(
  "/image/:BusinessId",
  validate(businessImageChange),
  tokenHandlers.tokenExtractor,
  authHandlers.UserIsBusiness,
  businessHandlers.changeBusinessImage
);
export { router as businessRotue };
