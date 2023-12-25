import { RequestHandler } from "express";
import { orderservices } from "../services/orderServices";
import { myError } from "../errors/errorType";
import mongoose from "mongoose";
import { userServices } from "../services/userServices";

const orderHandlers: {
  crateNewOrderHandler: RequestHandler;
  GetOrderHistoryHandler: RequestHandler;
  GetOrderHandler: RequestHandler;
} = {
  crateNewOrderHandler: async (req, res, next) => {
    const body = req.body;
    const { userId } = req.JWT!;
    const { BusinessId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(BusinessId)) {
      return next(new myError("Invalid Business ID", 400));
    }
    try {
      const order = await orderservices.createOrder(
        body.products,
        userId,
        BusinessId,
        body.price
      );
      if (order instanceof myError) {
        return next(order);
      }
      return res.status(200).send("order successfully created");
    } catch (e) {
      return next(e);
    }
  },
  GetOrderHistoryHandler: async (req, res, next) => {
    const { userId } = req.JWT!;
    try {
      const orderHistory = await orderservices.getUserOrderHistory(userId);
      if (orderHistory.length === 0) {
        return next(new myError("user has not ordered yet", 404));
      }
      return res.status(200).json({
        message: "user order history fetch successfully",
        orderHistory: orderHistory,
      });
    } catch (e) {
      return next(e);
    }
  },
  GetOrderHandler: async (req, res, next) => {
    const { userId } = req.JWT!;
    const { orderId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return next(new myError("Invalid order ID", 400));
    }
    const User = await userServices.findUserById(userId).lean();
    if (!User) {
      return next(new myError("could get your user", 500));
    }
    const order = await orderservices.getOrderById(orderId);
    if (!User.isAdmin) {
      if (order) {
        if (order.userId === userId) {
          return res.status(200).json({
            message: "your order fetched successfully",
            order: order,
          });
        }
        return res.status(404).json({
          message: "to get more detailed responde must be an admin",
        });
      }
    }
    if (!order) {
      return next(new myError("order not exist in database", 404));
    }
    return res.status(200).json({
      message: "the order fetched successfully",
      order: order,
    });
  },
};
export { orderHandlers };
