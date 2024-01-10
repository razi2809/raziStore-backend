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
} = {
  createbusinessHandler: async (req, res, next) => {
    const body = req.body;
    try {
      const business = await BusinessServices.createBusiness(body);
      return res.status(200).send("Business successfully created");
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
        return res.status(200).send("Unliked business");
      } else {
        business.likes.push(userId);
        await business.save();
        return res.status(200).send("Liked business");
      }
    } catch (e) {
      return next(e);
    }
  },
};
export { businessHandlers };
