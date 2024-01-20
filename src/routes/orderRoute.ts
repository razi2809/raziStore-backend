import { Router } from "express";
import { validate } from "../middleware/validation";
import {
  createOrderSchema,
  getOrderSchema,
} from "../config/schema/orderSchema";
import { authHandlers } from "../middleware/authHandler";
import { orderHandlers } from "../middleware/orderHandler";
import { tokenHandlers } from "../middleware/tokenHandler";
import { getUser } from "../config/schema/userSchema";

const router = Router();
router.post(
  "/newOrder/:BusinessId",
  validate(createOrderSchema),
  tokenHandlers.tokenExtractor,
  authHandlers.UserIsVerified,
  orderHandlers.createNewOrderHandler
);
router.get(
  "/:UserId",
  validate(getUser),
  tokenHandlers.tokenExtractor,
  authHandlers.UserIsVerified,
  orderHandlers.GetOrderHistoryHandler
);
router.get(
  "/getOrder/:orderId",
  validate(getOrderSchema),
  tokenHandlers.tokenExtractor,
  authHandlers.UserIsVerified,
  orderHandlers.GetOrderHandler
);
export { router as orderRouter };
