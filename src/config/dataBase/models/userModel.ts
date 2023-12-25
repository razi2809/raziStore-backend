import {
  DocumentType,
  Severity,
  getModelForClass,
  modelOptions,
  pre,
  prop,
} from "@typegoose/typegoose";
import bcrypt from "bcrypt";
import log from "../../utils/logger";
import { v4 as uuidv4 } from "uuid";
import { Address, Image, Name } from "./classes";

@pre<User>("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const hash = await bcrypt.hash(this.password, 12);
  this.password = hash;
  return;
})
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: { allowMixed: Severity.ALLOW },
})
export class User {
  @prop({ lowercase: true, required: true, unique: true })
  email: string;
  @prop({ required: true, unique: true })
  phoneNumber: string;
  @prop({ required: true })
  name: Name;
  @prop({ required: true })
  address: Address;
  @prop({ required: true, unique: false })
  image: Image;
  @prop({ required: true })
  password: string;
  @prop({ required: true, default: () => uuidv4() })
  verificationCode: string;
  @prop()
  passwordResetCode: string | null;
  @prop({ default: false })
  verified: boolean;
  async validatePassword(this: DocumentType<User>, candidPassword: string) {
    try {
      return await bcrypt.compare(candidPassword, this.password);
    } catch (e) {
      log.error(e, "could not validate password");
    }
  }
  @prop({ default: false })
  isAdmin: boolean;
  @prop({ default: false })
  isBusiness: boolean;
  @prop()
  orders: string[];
  @prop()
  theme: string;
}
const UserModel = getModelForClass(User);
export default UserModel;
