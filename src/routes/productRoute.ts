import {
  changeProductDescription,
  changeProductImage,
  changeProductName,
  changeProductQuantity,
  createProductSchema,
  ProductSchema,
} from "../config/schema/productSchema";
import { authHandlers } from "../middleware/authHandler";
import { productHandlers } from "../middleware/productsHandler";
import { Router } from "express";
import { validate } from "../middleware/validation";
import { tokenHandlers } from "../middleware/tokenHandler";
const router = Router();

router.post(
  "/newProduct/:businessId",
  validate(createProductSchema),
  tokenHandlers.tokenExtractor,
  authHandlers.UserIsBusiness,
  productHandlers.createproductHandler
);
router.get(
  "/:ProductId",
  validate(ProductSchema),
  tokenHandlers.tokenExtractor,
  authHandlers.UserIsBusiness,
  productHandlers.GetproductHandler
);
router.get(
  "/userLikes/:ProductId",
  validate(ProductSchema),
  tokenHandlers.tokenExtractor,
  authHandlers.UserIsBusiness,
  productHandlers.getProductLikes
);
router.patch(
  "/:ProductId",
  validate(ProductSchema),
  tokenHandlers.tokenExtractor,
  authHandlers.UserIsVerified,
  productHandlers.likeUnlikProductHandler
);
router.patch(
  "/name/:ProductId",
  validate(changeProductName),
  tokenHandlers.tokenExtractor,
  authHandlers.UserIsBusiness,
  productHandlers.changeProductName
);
router.patch(
  "/description/:ProductId",
  validate(changeProductDescription),
  tokenHandlers.tokenExtractor,
  authHandlers.UserIsBusiness,
  productHandlers.changeProductDescription
);
router.patch(
  "/image/:ProductId",
  validate(changeProductImage),
  tokenHandlers.tokenExtractor,
  authHandlers.UserIsBusiness,
  productHandlers.changeProductImage
);
router.patch(
  "/quantity/:ProductId",
  validate(changeProductQuantity),
  tokenHandlers.tokenExtractor,
  authHandlers.UserIsBusiness,
  productHandlers.changeProductQuantity
);

export { router as prodectRotue };
