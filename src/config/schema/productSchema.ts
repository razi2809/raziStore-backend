import { TypeOf, array, boolean, number, object, string } from "zod";

export const createProductSchema = object({
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
    productImage: string({
      required_error: "product should have image",
    }).url("not an acceptable url"),
    categories: array(string()),
  }),
});
export const getProductSchema = object({
  params: object({
    ProductId: string({
      required_error: "ProductId is required",
    }),
  }),
});
