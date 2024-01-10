import { TypeOf, array, boolean, number, object, string } from "zod";
import { ObjectId } from "./userSchema";

export const createProductSchema = object({
  params: object({
    businessId: ObjectId,
  }),
  body: object({
    productName: string({
      required_error: "productName is required",
    }),
    description: string({
      required_error: "product should have a description",
    }),
    price: number({
      required_error: "price is required",
    }),
    onSale: boolean().optional(),
    salePrice: number().optional(),
    productImage: object({
      url: string({
        required_error: "business should have image",
      }).url("not an acceptable url"),
      alt: string({}).optional(),
    }),
    categories: array(string()),
    productQuantity: number({ required_error: "productQuantity is required" }),
  }),
});
export const ProductSchema = object({
  params: object({
    ProductId: ObjectId,
  }),
});
