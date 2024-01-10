import { Router } from "express";
import { validate } from "../middleware/validation";
import {
  createOrderSchema,
  getOrderSchema,
} from "../config/schema/orderSchema";
import { authHandlers } from "../middleware/authHandler";
import { orderHandlers } from "../middleware/orderHandler";

const router = Router();
router.post(
  "/newOrder/:BusinessId",
  validate(createOrderSchema),
  authHandlers.UserIsVerified,
  orderHandlers.createNewOrderHandler
);
router.get(
  "/:userId",
  authHandlers.UserIsVerified,
  orderHandlers.GetOrderHistoryHandler
);
router.get(
  "/:orderId",
  validate(getOrderSchema),
  authHandlers.UserIsVerified,
  orderHandlers.GetOrderHandler
);
export { router as orderRouter };
