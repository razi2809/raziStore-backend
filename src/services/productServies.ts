import ProductModel, { Product } from "../config/dataBase/models/productModel";
import log from "../config/utils/logger";
import { BusinessServices } from "./businessServices";

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
};
export default productServies;
