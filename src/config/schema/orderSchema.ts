import { array, number, object, string } from "zod";
import { ObjectId } from "./userSchema";

export const createOrderSchema = object({
  params: object({
    BusinessId: ObjectId,
  }),
  body: object({
    products: array(
      string({
        required_error: "must be at least one product",
      })
    ),
    price: number({ required_error: "price is required" }),
  }),
});
export const getOrderSchema = object({
  params: object({
    orderId: ObjectId,
  }),
});
