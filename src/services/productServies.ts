import ProductModel, { Product } from "../config/dataBase/models/productModel";
import { myError } from "../errors/errorType";
import { BusinessServices } from "./businessServices";
import { userServices } from "./userServices";

const productServies = {
  createProduct: async (input: Partial<Product>, businessId: string) => {
    const product = await ProductModel.create({ ...input, businessId });
    BusinessServices.addCategoriesAndProducttoBusiness(
      businessId,
      product.categories,
      product._id.toString()
    );
    return product.save();
  },
  findProductsByBussinessId(businessId: string) {
    return ProductModel.find({ businessId });
  },
  findProductsById(Id: string) {
    return ProductModel.findById(Id);
  },
  getUserLikes: async (productId: string) => {
    try {
      const product = await ProductModel.findById(productId);
      if (!product || !product.likes) {
        throw new myError("product have no likes", 404);
      }
      const userPromises = product.likes.map(async (userId) => {
        const user = await userServices.findUserById(userId).lean();
        if (!user) return null;
        const {
          password,
          verificationCode,
          validatePassword,
          verified,
          passwordResetCode,
          ...rest
        } = user;
        return rest;
      });
      const users = await Promise.all(userPromises);
      if (users.every((user) => user === null)) {
        throw new myError("product have no likes", 404);
      }
      return users.filter((u) => u);
    } catch (e) {
      throw e;
    }
  },
  updateName: async (productId: string, productName: string) => {
    try {
      const updatedproduct = await ProductModel.findByIdAndUpdate(
        productId,
        { productName },
        { new: true }
      );
      if (!updatedproduct) {
        throw new Error("product not found");
      }
      return updatedproduct;
    } catch (error) {
      throw error;
    }
  },
  updateDescription: async (productId: string, productDescription: string) => {
    try {
      const updatedproduct = await ProductModel.findByIdAndUpdate(
        productId,
        { description: productDescription },
        { new: true }
      );
      if (!updatedproduct) {
        throw new Error("product not found");
      }
      return updatedproduct;
    } catch (error) {
      throw error;
    }
  },
  updateImage: async (productId: string, url: string) => {
    try {
      const updatedproduct = await ProductModel.findByIdAndUpdate(
        productId,
        { productImage: { url } },
        { new: true }
      );
      if (!updatedproduct) {
        throw new Error("product not found");
      }
      return updatedproduct;
    } catch (error) {
      throw error;
    }
  },
  updateQuantity: async (productId: string, productQuantity: number) => {
    try {
      const updatedproduct = await ProductModel.findByIdAndUpdate(
        productId,
        { productQuantity },
        { new: true }
      );
      if (!updatedproduct) {
        throw new Error("product not found");
      }
      return updatedproduct;
    } catch (error) {
      throw error;
    }
  },
};
export default productServies;
