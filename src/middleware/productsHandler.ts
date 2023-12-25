import { RequestHandler } from "express";
import productServies from "../services/productServies";
import { myError } from "../errors/errorType";
import mongoose from "mongoose";

const productHandlers: {
  createproductHandler: RequestHandler;
  GetproductHandler: RequestHandler;
} = {
  createproductHandler: async (req, res, next) => {
    const body = req.body;
    const { businessId } = req.params;
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
};
export { productHandlers };
