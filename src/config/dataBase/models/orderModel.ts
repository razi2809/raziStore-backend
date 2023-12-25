import {
  Severity,
  getModelForClass,
  modelOptions,
  prop,
} from "@typegoose/typegoose";

class business {
  @prop()
  businessId: string;
  @prop()
  businessName: string;
  @prop({ required: true, unique: false })
  businessImage: string;
}
class product {
  @prop()
  productId: string;
  @prop()
  productName: string;
  @prop({ required: true })
  productImage: string;
  @prop({ required: true })
  productPrice: string;
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
}
const OrderModel = getModelForClass(Order);
export default OrderModel;
