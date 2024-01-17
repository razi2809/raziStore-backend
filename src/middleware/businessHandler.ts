import { RequestHandler } from "express";
import { BusinessServices } from "../services/businessServices";
import log from "../config/utils/logger";
import BusinessModel from "../config/dataBase/models/businessModel";
import { myError } from "../errors/errorType";
import productServies from "../services/productServies";
import mongoose from "mongoose";

const businessHandlers: {
  createbusinessHandler: RequestHandler;
  findbusinessesHandler: RequestHandler;
  findbusinessHandler: RequestHandler;
  likeUnlikbusinessHandler: RequestHandler;
  getBusinessLikes: RequestHandler;
  getBusinessOrders: RequestHandler;
  changeBusinessEmail: RequestHandler;
  changeBusinessName: RequestHandler;
  changeBusinessPhone: RequestHandler;
  changeBusinessDescription: RequestHandler;
} = {
  createbusinessHandler: async (req, res, next) => {
    const body = req.body;
    try {
      const business = await BusinessServices.createBusiness(body);
      return res.status(200).json({ message: "Business successfully created" });
    } catch (e) {
      return next(e);
    }
  },
  findbusinessesHandler: async (req, res, next) => {
    try {
      const businesses = await BusinessModel.find().lean();
      if (businesses.length === 0) {
        return next(
          new myError("at the moment there is no active businesses", 404)
        );
      }
      return res.status(200).json({
        message: "business fetched successfully",
        businesses: businesses,
      });
    } catch (e) {
      return next(e);
    }
  },
  findbusinessHandler: async (req, res, next) => {
    const { BusinessId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(BusinessId)) {
      return next(new myError("Invalid Business ID", 400));
    }
    try {
      const business = await BusinessServices.findBusinessById(BusinessId);
      if (!business) {
        return next(new myError("businees not found in database", 404));
      }
      const businessProduct = await productServies.findProductsByBussinessId(
        business._id.toString()
      );
      if (!businessProduct) {
        return next(new myError("businees still has no products to show", 404));
      }
      return res.status(200).json({
        message: "business feched successfully",
        business: business,
        products: businessProduct,
      });
    } catch (e) {
      return next(e);
    }
  },
  likeUnlikbusinessHandler: async (req, res, next) => {
    const { BusinessId } = req.params;
    const { userId } = req.JWT!;
    try {
      const business = await BusinessServices.findBusinessById(BusinessId);
      if (!business) {
        return next(new myError("business not found in database", 404));
      }
      if (business.likes.includes(userId)) {
        business.likes = business.likes.filter((id) => id !== userId);
        await business.save();
        return res.status(200).json({ message: "Unliked business" });
      } else {
        business.likes.push(userId);
        await business.save();
        return res.status(200).json({ message: "Liked business" });
      }
    } catch (e) {
      return next(e);
    }
  },
  getBusinessLikes: async (req, res, next) => {
    const { BusinessId } = req.params;
    try {
      const users = await BusinessServices.getUserLikes(BusinessId);
      if (!users) {
        return next(new myError("business have no likes", 404));
      }
      return res
        .status(200)
        .json({ message: "user fetched successfully", users: users });
    } catch (e) {
      return next(e);
    }
  },
  getBusinessOrders: async (req, res, next) => {
    const { BusinessId } = req.params;
    try {
      const orders = await BusinessServices.getBusinessOrders(BusinessId);
      if (!orders) {
        return next(new myError("business have no orders yet", 404));
      }
      return res
        .status(200)
        .json({ message: "orders fetched successfully", orders: orders });
    } catch (e) {
      return next(e);
    }
  },
  changeBusinessEmail: async (req, res, next) => {
    const { BusinessId } = req.params;
    const { businessEmail } = req.body;

    try {
      await BusinessServices.updateEmail(BusinessId, businessEmail);
      return res.status(200).json({ message: "business email  was updated" });
    } catch (e) {
      return next(e);
    }
  },
  changeBusinessName: async (req, res, next) => {
    const { BusinessId } = req.params;
    const { businessName } = req.body;

    try {
      await BusinessServices.updateName(BusinessId, businessName);
      return res.status(200).json({ message: "business name was updated" });
    } catch (e) {
      return next(e);
    }
  },
  changeBusinessPhone: async (req, res, next) => {
    const { BusinessId } = req.params;
    const { businessPhoneNumber } = req.body;

    try {
      await BusinessServices.updatePhone(BusinessId, businessPhoneNumber);
      return res.status(200).json({ message: "business phone was updated" });
    } catch (e) {
      return next(e);
    }
  },
  changeBusinessDescription: async (req, res, next) => {
    const { BusinessId } = req.params;
    const { businessDescription } = req.body;

    try {
      await BusinessServices.updateDescription(BusinessId, businessDescription);
      return res
        .status(200)
        .json({ message: "business description was updated" });
    } catch (e) {
      return next(e);
    }
  },
};
export { businessHandlers };
