import { prop } from "@typegoose/typegoose";

export class Address {
  @prop({ default: "Israel" })
  state: string;

  @prop({ default: "Bograsov" })
  street: string;

  @prop({ default: "Tel-aviv" })
  city: string;

  @prop({ default: 1 })
  buildingNumber: Number;
}
export class OpeningHoursInDay {
  @prop()
  opening: string;
  @prop()
  closing: string;
  @prop()
  close: boolean;
}
export class OpeningHours {
  @prop({ required: true })
  Monday: OpeningHoursInDay;
  @prop({ required: true })
  Tuesday: OpeningHoursInDay;
  @prop({ required: true })
  Wednesday: OpeningHoursInDay;
  @prop({ required: true })
  Thursday: OpeningHoursInDay;
  @prop({ required: true })
  Friday: OpeningHoursInDay;
  @prop({ required: true })
  Saturday: OpeningHoursInDay;
  @prop({ required: true })
  Sunday: OpeningHoursInDay;
}
export class Name {
  @prop({ required: true })
  firstName: string;
  @prop({ required: true })
  lastName: string;
}
export class Image {
  @prop({ required: true })
  url: string;
  @prop()
  alt: string;
}
