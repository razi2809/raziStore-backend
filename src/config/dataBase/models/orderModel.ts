import {
  Severity,
  getModelForClass,
  modelOptions,
  prop,
} from "@typegoose/typegoose";
import { Address, Image } from "./classes";

class business {
  @prop()
  businessId: string;
  @prop()
  businessName: string;
  @prop({ required: true, unique: false })
  businessImage: Image;
}
class product {
  @prop()
  productId: string;
  @prop()
  productName: string;
  @prop({ required: true })
  productImage: Image;
  @prop({ required: true })
  productPrice: string;
  @prop({ required: true })
  productQuantity: number;
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: { allowMixed: Severity.ALLOW },
})
export class Order {
  @prop({ required: true })
  products: Array<product>;
  @prop({ required: true })
  business: business;
  @prop({ required: true })
  userId: string;
  @prop({ required: true })
  price: number;
  @prop({ required: true })
  address: Address;
}
const OrderModel = getModelForClass(Order);
export default OrderModel;
