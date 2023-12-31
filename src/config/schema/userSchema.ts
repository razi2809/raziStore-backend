import { TypeOf, number, object, string, z } from "zod";
import { passwordPattern, phoneNumberPattern } from "./pattern";
import { Address, Image, Name } from "../dataBase/models/classes";

export const createUserValidition = object({
  body: object({
    name: object({
      firstName: string({
        required_error: "firstName is required",
      }),
      lastName: string({
        required_error: "lastName is required",
      }),
    }),
    address: object({
      city: string().optional(),
      street: string({
        required_error: "street is required",
      }),
      buildingNumber: number({
        required_error: "buildingNumber is required",
      }),
    }),
    image: object({
      url: string({
        required_error: "business should have image",
      }).url("not an acceptable url"),
      alt: string().optional(),
    }),
    password: string({
      required_error: "password is required",
    })
      .regex(
        passwordPattern,
        "password should be at least one special charcter and one upper case charcter"
      )
      .min(7, "password should be at least 7 charcters"),
    passwordConfirmation: string({
      required_error: "passworConfirmation is required",
    }),
    phoneNumber: string({
      required_error: "phoneNumber is required",
    }).regex(phoneNumberPattern, "invaild phone number"),
    email: string({
      required_error: "email is required",
    }).email("not a valid email"),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "passwords do not match",
    path: ["passworConfirmation"],
  }),
});
export interface IUser {
  email: string;
  name: Name;
  adsress: Address;
  image: Image;
  password: string;
  verificationCode: string;
  passwordResetCode: string | null;
  phoneNumber: string;
  verified: boolean;
  isAdmin: boolean;
  isBusiness: boolean;
  orders: string[];
  theme: string;
}
export const ObjectId = string().refine((id) => /^[a-f\d]{24}$/i.test(id), {
  message: "Invalid ObjectId",
});
const UUIDv4 = string().refine(
  (id) =>
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/i.test(
      id
    ),
  {
    message: "Invalid code",
  }
);
export const verifyUser = object({
  params: object({
    email: string().email("not a valid email"),
    verificationCode: UUIDv4,
  }),
});
export const getUser = object({
  params: object({
    UserId: ObjectId,
  }),
});
export const forgotPassword = object({
  body: object({
    email: string({
      required_error: "email is required",
    }).email("not a valid email"),
  }),
});
export const passwordReset = object({
  params: object({
    email: string().email("not a valid email"),
    passwodResetCode: string({
      required_error: "passwodResetCode is required",
    }),
  }),
  body: object({
    password: string({
      required_error: "password is required",
    }).min(6, "password is too short - should be min 6 chars"),
    passwordConfirmation: string({
      required_error: "passwordConfirmation is required",
    }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "passwords do not match",
    path: ["passwordConfirmation"],
  }),
});
export const Theme = object({
  body: object({
    Theme: z.enum(["dark", "light"]),
  }),
});
export type verifyUserInput = TypeOf<typeof verifyUser>["params"];
export type createUserValiditionInput = TypeOf<
  typeof createUserValidition
>["body"];
export type forgotPasswordInput = TypeOf<typeof forgotPassword>["body"];
export type passwodResetInput = TypeOf<typeof passwordReset>;
