import {
  Severity,
  getModelForClass,
  modelOptions,
  prop,
} from "@typegoose/typegoose";
import { Image } from "./classes";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: { allowMixed: Severity.ALLOW },
})
export class Product {
  @prop({ required: true })
  productName: string;
  @prop({ required: true })
  description: string;
  @prop({ required: true })
  price: number;
  @prop()
  onSale: boolean;
  @prop()
  salePrice: number;
  @prop({ required: true, unique: false })
  productImage: Image;
  @prop({ required: true })
  businessId: string;
  @prop({ required: true, unique: false })
  categories: string[];
  @prop()
  likes: string[];
  @prop({ required: true })
  productQuantity: number;
  @prop({ required: true, default: 0 })
  howManyOrders: number;
}
const ProductModel = getModelForClass(Product);
export default ProductModel;
