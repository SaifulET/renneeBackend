import { z } from "zod";
import { GENDER_VALUES, normalizeGender, USER_ACCESSIBILITY, USER_ROLE } from "./user.constant";

const createUserZodSchema = z.object({
  body: z.object({
    fullname: z
      .string({ message: "fullname is Required" })
      .min(1, { error: "min  1  character needed" })
      .max(100, { error: "max 100 character accepted" }),

    password: z.string({ message: "Password is Required" }),

    email: z
      .string({ message: "Email is Required" })
      .email("Invalid email format")
      .refine(
        (email) => {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        {
          message: "Invalid email format",
        }
      ),


    role: z
      .nativeEnum(USER_ROLE, {
        message: "Invalid role value",
      })
      .default(USER_ROLE.buyer),

    status: z
      .nativeEnum(USER_ACCESSIBILITY, {
        message: "Invalid status value",
      })
      .default(USER_ACCESSIBILITY.isProgress),

    photo: z.string({ message: "photo is not required" }).optional(),
    address: z.string({ message: "address is not required" }).optional(),
    gender: z
      .string()
      .optional()
      .transform((value) => (value ? normalizeGender(value) ?? value : value))
      .refine((value) => value === undefined || GENDER_VALUES.includes(value as (typeof GENDER_VALUES)[number]), {
        message: "Gender must be Male, FeMale, Female, or Others",
      }),
  }),
});

const verificationCodeField = z
  .union([
    z.number(),
    z.string().trim().regex(/^\d{6}$/, "Verification code must be 6 digits"),
  ])
  .transform((value) => (typeof value === "string" ? Number(value) : value))
  .refine((value) => Number.isInteger(value) && value >= 100000 && value <= 999999, {
    message: "Verification code must be 6 digits",
  });

const UserVerification = z.object({
  body: z
    .object({
      verificationCode: verificationCodeField.optional(),
      otp: verificationCodeField.optional(),
      code: verificationCodeField.optional(),
    })
    .refine((body) => body.verificationCode || body.otp || body.code, {
      message: "Verification code is required",
    }),
});

const ChnagePasswordSchema = z.object({
  body: z.object({
    newpassword: z
      .string({ message: "new password is required" })
      .min(6, { message: "min 6 characters accepted" }),
    oldpassword: z
      .string({ message: "old password is required" })
      .min(6, { message: "min 6 characters accepted" }),
  }),
});

const UpdateUserProfileSchema = z.object({
  body: z.object({
    username: z
      .string({ message: "user name is required" })
      .min(3, { message: "min 3 characters accepted" })
      .max(15, { message: "max 15 characters accepted" })
      .optional(),


    address: z.string({ message: "address is not required" }).optional(),
    photo: z.string({ message: "optional photo" }).url().optional(),
  }),
});

const ForgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .string({ message: "Email is Required" })
      .email("Invalid email format")
      .refine(
        (email) => {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        {
          message: "Invalid email format",
        }
      ),
  }),
});

const verificationCodeSchema = z.object({
  body: z.object({
    verificationCode: verificationCodeField,
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    password: z.string({ message: "password is required" }),
  }),
});

const UserValidationSchema = {
  createUserZodSchema,
  UserVerification,
  ChnagePasswordSchema,
  UpdateUserProfileSchema,
  ForgotPasswordSchema,
  verificationCodeSchema,
  resetPasswordSchema,
};

export default UserValidationSchema;
