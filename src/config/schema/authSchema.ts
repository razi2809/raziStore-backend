import { object, string } from "zod";
import { passwordPattern } from "./pattern";

export const loginSchema = object({
  body: object({
    email: string({
      required_error: "email is required",
    }).email(),
    password: string({
      required_error: "password is required",
    })
      .regex(
        passwordPattern,
        "password should be at least one special charcter and one upper case charcter"
      )
      .min(7, "password should be at least 7 charcters"),
  }),
});
