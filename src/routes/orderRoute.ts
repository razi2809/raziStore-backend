import { Router } from "express";
import { validate } from "../middleware/validation";
import { createOrderSchema } from "../config/schema/orderSchema";
import { authHandlers } from "../middleware/authHandler";
import { orderHandlers } from "../middleware/orderHandler";

const router = Router();
router.post(
  "/newOrder/:BusinessId",
  validate(createOrderSchema),
  authHandlers.UserIsVerified,
  orderHandlers.crateNewOrderHandler
);
router.get(
  "/",
  authHandlers.UserIsVerified,
  orderHandlers.GetOrderHistoryHandler
);
router.get(
  "/:orderId",
  authHandlers.UserIsVerified,
  orderHandlers.GetOrderHandler
);
export { router as orderRouter };
