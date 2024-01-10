import {
  DocumentType,
  Severity,
  getModelForClass,
  modelOptions,
  pre,
  prop,
} from "@typegoose/typegoose";
import { Address, Image, OpeningHours } from "./classes";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: { allowMixed: Severity.ALLOW },
})
export class Business {
  @prop({ lowercase: true, required: true, unique: true })
  businessEmail: string;
  @prop({ required: true, unique: true })
  businessPhoneNumber: string;
  @prop({ required: true, unique: true })
  businessName: string;
  @prop({ required: true, unique: true })
  businessDescription: string;
  @prop({ required: true })
  address: Address;
  @prop({ required: true, unique: false })
  businessImage: Image;
  @prop({ required: true, unique: false })
  OpeningHours: OpeningHours;
  @prop()
  products: string[];
  @prop()
  categories: string[];
  @prop()
  likes: string[];
  @prop()
  orders: string[];
}
const BusinessModel = getModelForClass(Business);
export default BusinessModel;
