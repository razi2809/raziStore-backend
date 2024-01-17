import BusinessModel, {
  Business,
} from "../config/dataBase/models/businessModel";
import { v4 as uuidv4 } from "uuid";
import UserModel from "../config/dataBase/models/userModel";
import log from "../config/utils/logger";
import { userServices } from "./userServices";
import { myError } from "../errors/errorType";
import { orderservices } from "./orderServices";

/* export function createUser(input:Partial<User>){
    return UserModel.create(input)
} */
const BusinessServices = {
  createBusiness(input: Partial<Business>) {
    if (input.address) {
      input.address = {
        city: input.address.city,
        street: input.address.street,
        buildingNumber: input.address.buildingNumber,
        addressName: "default",
        state: "isreal",
        id: uuidv4(),
      };
    } else {
      input.address = {
        state: "Israel",
        id: uuidv4(),
        street: "Bograsov",
        city: "Tel-aviv",
        buildingNumber: 1,
        addressName: "default",
      };
    }
    return BusinessModel.create(input);
  },
  findBusinessById(id: string) {
    return BusinessModel.findById(id);
  },
  addCategoriesAndProducttoBusiness: async (
    id: string,
    categories: Array<string>,
    productId: string
  ) => {
    const business = await BusinessModel.findById(id);
    business?.products.push(productId);
    if (business && business.categories) {
      categories.forEach((category) => {
        if (!business.categories.includes(category)) {
          business.categories.push(category);
        }
      });
      await business.save();
    }
  },
  addOrderToBuisness: async (businessId: string, orderId: string) => {
    const business = await BusinessModel.findById(businessId);
    business?.orders.push(orderId);
    business?.save();
  },
  getUserLikes: async (businessId: string) => {
    try {
      const business = await BusinessModel.findById(businessId);
      if (!business || !business.likes) {
        throw new myError("business have no likes", 404);
      }
      const userPromises = business.likes.map(async (userId) => {
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
        throw new myError("business have no likes", 404);
      }
      return users.filter((u) => u);
    } catch (e) {
      throw e;
    }
  },
  getBusinessOrders: async (businessId: string) => {
    try {
      const business = await BusinessModel.findById(businessId);
      if (!business || !business.orders) {
        throw new myError("business have no orders yet", 404);
      }
      const orderPromises = business.orders.map(async (orderId) => {
        const order = await orderservices.getOrderById(orderId).lean();
        if (!order) return null;

        return order;
      });
      const orders = await Promise.all(orderPromises);
      if (orders.every((order) => order === null)) {
        throw new myError("business have no orders yet", 404);
      }
      return orders.filter((o) => o);
    } catch (err) {
      throw err;
    }
  },
  updateEmail: async (businessId: string, businessEmail: string) => {
    try {
      const updatedBusiness = await BusinessModel.findByIdAndUpdate(
        businessId,
        { businessEmail },
        { new: true }
      );
      if (!updatedBusiness) {
        throw new Error("business not found");
      }
      return updatedBusiness;
    } catch (error) {
      // Handle or throw the error as per your error handling strategy
      throw error;
    }
  },
  updateName: async (businessId: string, businessName: string) => {
    try {
      const updatedBusiness = await BusinessModel.findByIdAndUpdate(
        businessId,
        { businessName },
        { new: true }
      );
      if (!updatedBusiness) {
        throw new Error("business not found");
      }
      return updatedBusiness;
    } catch (error) {
      // Handle or throw the error as per your error handling strategy
      throw error;
    }
  },
  updatePhone: async (businessId: string, businessPhoneNumber: string) => {
    try {
      const updatedBusiness = await BusinessModel.findByIdAndUpdate(
        businessId,
        { businessPhoneNumber },
        { new: true }
      );
      if (!updatedBusiness) {
        throw new Error("business not found");
      }
      return updatedBusiness;
    } catch (error) {
      // Handle or throw the error as per your error handling strategy
      throw error;
    }
  },
  updateDescription: async (
    businessId: string,
    businessDescription: string
  ) => {
    try {
      const updatedBusiness = await BusinessModel.findByIdAndUpdate(
        businessId,
        { businessDescription },
        { new: true }
      );
      if (!updatedBusiness) {
        throw new Error("business not found");
      }
      return updatedBusiness;
    } catch (error) {
      // Handle or throw the error as per your error handling strategy
      throw error;
    }
  },
};
export { BusinessServices };
