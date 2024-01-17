import { TypeOf, boolean, date, number, object, string, z } from "zod";
import { phoneNumberPattern } from "./pattern";
import { ObjectId } from "./userSchema";
const timeAsString = z
  .string()
  .refine((value) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(value), {
    message: "Invalid time format, expected HH:MM",
  });
const OpeningHoursSchema = object({
  opening: timeAsString.optional(),
  closing: timeAsString.optional(),
  close: boolean().optional(),
});
export const createBusinessSchema = object({
  body: object({
    businessName: string({
      required_error: "businessName is required",
    }),
    businessDescription: string({
      required_error: "businessDescription is required",
    }),
    businessPhoneNumber: string({
      required_error: "phoneNumber is required",
    }).regex(phoneNumberPattern, "invaild phone number"),
    address: object({
      city: string().optional(),
      street: string({
        required_error: "street is required",
      }),
      buildingNumber: number({
        required_error: "buildingNumber is required",
      }),
    }),
    businessEmail: string({
      required_error: "businessEmail is required",
    }).email("not a valid email"),
    businessImage: object({
      url: string({
        required_error: "business should have image",
      }).url("not an acceptable url"),
      alt: string({}).optional(),
    }),

    OpeningHours: object({
      Monday: OpeningHoursSchema,
      Tuesday: OpeningHoursSchema,
      Wednesday: OpeningHoursSchema,
      Thursday: OpeningHoursSchema,
      Friday: OpeningHoursSchema,
      Saturday: OpeningHoursSchema,
      Sunday: OpeningHoursSchema,
    }),
  }),
});
export const businessEmailChange = object({
  params: object({
    BusinessId: ObjectId,
  }),
  body: object({
    businessEmail: string().email("not a valid email"),
  }),
});
export const Business = object({
  params: object({
    BusinessId: ObjectId,
  }),
});
export const businessNameChange = object({
  params: object({
    BusinessId: ObjectId,
  }),
  body: object({
    businessName: string({
      required_error: "businessName is required",
    }),
  }),
});
export const businessPhoneChange = object({
  params: object({
    BusinessId: ObjectId,
  }),
  body: object({
    businessPhoneNumber: string({
      required_error: "phoneNumber is required",
    }).regex(phoneNumberPattern, "invaild phone number"),
  }),
});
export const businessDescriptionChange = object({
  params: object({
    BusinessId: ObjectId,
  }),
  body: object({
    businessDescription: string({
      required_error: "businessDescription is required",
    }),
  }),
});
