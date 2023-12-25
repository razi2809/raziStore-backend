import {
  Severity,
  getModelForClass,
  modelOptions,
  prop,
} from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: { allowMixed: Severity.ALLOW },
})
export class Product {
  @prop({ required: true, unique: true })
  productName: string;
  @prop({ required: true, unique: true })
  description: string;
  @prop({ required: true })
  price: number;
  @prop()
  onSale: boolean;
  @prop()
  salePrice: number;
  @prop({ required: true, unique: false })
  productImage: string;
  @prop({ required: true })
  businessId: string;
  @prop({ required: true, unique: false })
  categories: string[];
  @prop()
  likes: string[];
}
const ProductModel = getModelForClass(Product);
export default ProductModel;
