import {
  createProductSchema,
  ProductSchema,
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
  validate(ProductSchema),
  productHandlers.GetproductHandler
);
router.patch(
  "/:ProductId",
  validate(ProductSchema),
  authHandlers.UserIsVerified,
  productHandlers.likeUnlikbusinessHandler
);
export { router as prodectRotue };
