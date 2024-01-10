import { RequestHandler } from "express";
import productServies from "../services/productServies";
import { myError } from "../errors/errorType";
import mongoose from "mongoose";

const productHandlers: {
  createproductHandler: RequestHandler;
  GetproductHandler: RequestHandler;
  likeUnlikbusinessHandler: RequestHandler;
} = {
  createproductHandler: async (req, res, next) => {
    const body = req.body;
    const { businessId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(businessId)) {
      return next(new myError("Invalid business ID", 400));
    }
    try {
      const product = await productServies.createProduct(body, businessId);
      return res.status(200).send("product successfully created");
    } catch (e) {
      return next(e);
    }
  },
  GetproductHandler: async (req, res, next) => {
    const { ProductId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(ProductId)) {
      return next(new myError("Invalid product ID", 400));
    }
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
  likeUnlikbusinessHandler: async (req, res, next) => {
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
        return res.status(200).send("Unliked product");
      } else {
        product.likes.push(userId);
        await product.save();
        return res.status(200).send("Liked product");
      }
    } catch (e) {
      return next(e);
    }
  },
};
export { productHandlers };
