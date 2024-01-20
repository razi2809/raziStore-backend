import { RequestHandler } from "express";
import productServies from "../services/productServies";
import { myError } from "../errors/errorType";
import log from "../config/utils/logger";

const productHandlers: {
  createproductHandler: RequestHandler;
  GetproductHandler: RequestHandler;
  getProductLikes: RequestHandler;
  likeUnlikProductHandler: RequestHandler;
  changeProductName: RequestHandler;
  changeProductDescription: RequestHandler;
  changeProductImage: RequestHandler;
  changeProductQuantity: RequestHandler;
} = {
  createproductHandler: async (req, res, next) => {
    const body = req.body;
    const { businessId } = req.params;
    try {
      const product = await productServies.createProduct(body, businessId);
      return res.status(200).json({ message: "product successfully created" });
    } catch (e) {
      return next(e);
    }
  },
  GetproductHandler: async (req, res, next) => {
    const { ProductId } = req.params;

    try {
      const product = await productServies.findProductsById(ProductId);
      if (!product) {
        return next(
          new myError(
            "product dose not exist in data base mabye it got removed",
            404
          )
        );
      }
      return res
        .status(200)
        .json({ message: "product fetch successfully", product: product });
    } catch (e) {
      return next(e);
    }
  },
  getProductLikes: async (req, res, next) => {
    const { ProductId } = req.params;
    try {
      const users = await productServies.getUserLikes(ProductId);
      if (!users) {
        return next(new myError("product have no likes", 404));
      }
      return res
        .status(200)
        .json({ message: "user fetched successfully", users: users });
    } catch (e) {
      return next(e);
    }
  },
  likeUnlikProductHandler: async (req, res, next) => {
    const { ProductId } = req.params;
    const { userId } = req.JWT!;
    try {
      const product = await productServies.findProductsById(ProductId);
      if (!product) {
        return next(new myError("product not found in database", 404));
      }
      if (product.likes.includes(userId)) {
        product.likes = product.likes.filter((id) => id !== userId);
        await product.save();
        return res.status(200).json({ message: "Unliked product" });
      } else {
        product.likes.push(userId);
        await product.save();
        return res.status(200).json({ message: "Liked product" });
      }
    } catch (e) {
      return next(e);
    }
  },
  changeProductName: async (req, res, next) => {
    const { ProductId } = req.params;
    const { productName } = req.body;

    try {
      await productServies.updateName(ProductId, productName);
      return res.status(200).json({ message: "product name was updated" });
    } catch (e) {
      return next(e);
    }
  },
  changeProductDescription: async (req, res, next) => {
    const { ProductId } = req.params;
    const { productDescription } = req.body;

    try {
      await productServies.updateDescription(ProductId, productDescription);
      return res
        .status(200)
        .json({ message: "product description was updated" });
    } catch (e) {
      return next(e);
    }
  },
  changeProductImage: async (req, res, next) => {
    const { ProductId } = req.params;
    const { url } = req.body;
    log.info(url);
    try {
      await productServies.updateImage(ProductId, url);
      return res.status(200).json({ message: "product image was updated" });
    } catch (e) {
      return next(e);
    }
  },
  changeProductQuantity: async (req, res, next) => {
    const { ProductId } = req.params;
    const { productQuantity } = req.body;

    try {
      await productServies.updateQuantity(ProductId, productQuantity);
      return res.status(200).json({ message: "product quantity was updated" });
    } catch (e) {
      return next(e);
    }
  },
};
export { productHandlers };
