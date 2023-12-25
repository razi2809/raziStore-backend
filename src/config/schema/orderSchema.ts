import { array, number, object, string } from "zod";

export const createOrderSchema = object({
  params: object({
    BusinessId: string({
      required_error: "BusinessId is required",
    }),
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
