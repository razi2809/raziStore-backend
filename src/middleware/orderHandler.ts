import { RequestHandler } from "express";
import { orderservices } from "../services/orderServices";
import { myError } from "../errors/errorType";
import mongoose from "mongoose";
import { userServices } from "../services/userServices";
import log from "../config/utils/logger";

const orderHandlers: {
  createNewOrderHandler: RequestHandler;
  GetOrderHistoryHandler: RequestHandler;
  GetOrderHandler: RequestHandler;
} = {
  createNewOrderHandler: async (req, res, next) => {
    // Handler for creating a new order
    const body = req.body;
    const { userId } = req.JWT!;
    const { BusinessId } = req.params;
    // Validate BusinessId
    if (!mongoose.Types.ObjectId.isValid(BusinessId)) {
      return next(new myError("Invalid Business ID", 400));
    }
    try {
      // Create a new order
      const order = await orderservices.createOrder(
        body.products,
        userId,
        BusinessId,
        body.price
      );
      // Check for errors in order creation
      if (order instanceof myError) {
        return next(order);
      }
      // Send successful response
      return res
        .status(200)
        .json({ message: "order successfully created", orderId: order._id });
    } catch (e) {
      return next(e); // Pass errors to the error handler
    }
  },
  GetOrderHistoryHandler: async (req, res, next) => {
    // Handler for getting a user's order history
    const { userId } = req.JWT!;
    const user = req.user!;
    try {
      // If user is not admin, fetch their own order history
      if (!user.isAdmin) {
        const orderHistory = await orderservices.getUserOrderHistory(userId);
        if (orderHistory.length === 0) {
          return next(new myError("user has not ordered yet", 404));
        }
        // Return the user's order history
        return res.status(200).json({
          message: "user order history fetch successfully",
          orderHistory: orderHistory,
        });
      }
      // Admins can fetch any user's order history
      const { userId: askedUserId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(askedUserId)) {
        return next(new myError("Invalid User ID", 400));
      }
      const orderHistory = await orderservices.getUserOrderHistory(askedUserId);
      if (orderHistory.length === 0) {
        return next(new myError("user has not ordered yet", 404));
      }
      return res.status(200).json({
        message: "user order history fetch successfully",
        orderHistory: orderHistory,
      });
    } catch (e) {
      return next(e); // Pass errors to the error handler
    }
  },
  GetOrderHandler: async (req, res, next) => {
    // Handler for getting details of a specific order
    const { userId } = req.JWT!;
    const { orderId } = req.params;
    log.info(orderId);
    // Validate orderId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return next(new myError("Invalid order ID", 400));
    }
    // Find the user associated with the request
    const User = req.user;
    if (!User) {
      return next(new myError("could get your user", 500));
    }
    // Fetch the order details
    const order = await orderservices.getOrderById(orderId);
    if (!User.isAdmin) {
      if (order) {
        // Regular users can only fetch their own orders
        if (order.userId === userId) {
          return res.status(200).json({
            message: "your order fetched successfully",
            order: order,
          });
        }
        return res.status(404).json({
          message: "to get more detailed response must be an admin",
        });
      }
    }
    if (!order) {
      return next(new myError("order not exist in database", 404));
    } // Return the order details

    return res.status(200).json({
      message: "the order fetched successfully",
      order: order,
    });
  },
};
export { orderHandlers };
