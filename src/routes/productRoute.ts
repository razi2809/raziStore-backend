import {
  createProductSchema,
  getProductSchema,
} from "../config/schema/productSchema";
import { authHandlers } from "../middleware/authHandler";
import { productHandlers } from "../middleware/productsHandler";
import { Router } from "express";
import { validate } from "../middleware/validation";
const router = Router();

router.post(
  "/newProduct/:businessId",
  validate(createProductSchema),
  authHandlers.UserIsBusiness,
  productHandlers.createproductHandler
);
router.get(
  "/:ProductId",
  validate(getProductSchema),
  productHandlers.GetproductHandler
);
export { router as prodectRotue };
