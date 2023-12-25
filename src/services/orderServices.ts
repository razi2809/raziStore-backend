import OrderModel, { Order } from "../config/dataBase/models/orderModel";
import log from "../config/utils/logger";
import { myError } from "../errors/errorType";
import { BusinessServices } from "./businessServices";
import productServies from "./productServies";
import { userServices } from "./userServices";

const orderservices = {
  createOrder: async (
    productIds: string[],
    userId: string,
    businessId: string,
    price: number
  ) => {
    try {
      const businessdata = await BusinessServices.findBusinessById(businessId);
      const business = {
        businessId,
        businessName: businessdata?.businessName,
        businessImage: businessdata?.businessImage,
      };
      const products = await Promise.all(
        productIds.map(async (id) => {
          const productData = await productServies.findProductsById(id);
          if (!productData) {
            throw new myError(`Product not found in data base`, 404);
          }
          return {
            productId: productData?._id,
            productName: productData?.productName,
            productImage: productData?.productImage,
            productPrice: productData?.price,
          };
        })
      ).catch((error) => {
        throw error;
      });

      const order = await OrderModel.create({
        products,
        userId,
        business,
        price,
      });
      await BusinessServices.addOrderToBuisness(
        businessId,
        order._id.toString()
      );
      await userServices.addOrderToUser(userId, order._id.toString());
    } catch (e) {
      if (e instanceof myError) {
        return e;
      }
      return new myError("could not process purchase", 500);
    }
  },
  getUserOrderHistory(userId: string) {
    return OrderModel.find({ userId });
  },
  getOrderById(id: string) {
    return OrderModel.findById(id);
  },
};
export { orderservices };
