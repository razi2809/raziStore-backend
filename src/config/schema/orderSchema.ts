import { array, number, object, string } from "zod";
import { ObjectId } from "./userSchema";
const Product = object({
  productId: ObjectId,
  productQuantity: number({
    required_error: "productQuantity is required",
  }),
});
export const createOrderSchema = object({
  params: object({
    BusinessId: ObjectId,
  }),
  body: object({
    products: array(Product),
    price: number({ required_error: "price is required" }),
  }),
});
export const getOrderSchema = object({
  params: object({
    orderId: ObjectId,
  }),
});
