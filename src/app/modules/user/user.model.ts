import bcrypt from "bcrypt";
import { Schema, model } from "mongoose";

import { GENDER_VALUES, normalizeGender, USER_ACCESSIBILITY, USER_ROLE } from "./user.constant";
import { TUser, UserModel } from "./user.interface";
import config from "../../config";

const TUserSchema = new Schema<TUser, UserModel>(
  {
    fullname: {
      type: String,
      required: [false, "user fullname is Required"],
    },

    password: { type: String, required: [false, "Password is Required"], select: 0 },
    email: {
      type: String,
      required: [false, "Email is Required"],
      trim: true,
      unique: true,
    },
    gender: {
      type: String,
      enum: {
        values: [...GENDER_VALUES],
        message: "{VALUE} is not a valid gender. Use Male, FeMale, Female, or Others",
      },
      set: (value: string) => {
        if (typeof value !== "string") return value;
        return normalizeGender(value) ?? value;
      },
      required: [false, "Gender is not required"],
    },



    verificationCode: {
      type: Number,
      required: [false, "verification Code is Required"],
    },
    isVerify: {
      type: Boolean,
      required: [false, "isVartify is not required"],
      default: false,
    },
    auth_type: {
      type: String,
      enum: ["email", "google", "apple"],
      default: "email",
    },
    specialty: {
      type: String,
    },
    role: {
      type: String,
      enum: {
        values: [USER_ROLE.buyer, USER_ROLE.consultant, USER_ROLE.admin],
        message: "{VALUE} is Not Required",
      },
      required: [true, "Role is Required"],
      default: USER_ROLE.buyer,
    },
    status: {
      type: String,
      enum: {
        values: [USER_ACCESSIBILITY.isProgress, USER_ACCESSIBILITY.blocked],
        message: "{VALUE} is not required",
      },
      required: [true, "Status is Required"],
      default: USER_ACCESSIBILITY.isProgress as any,
    },
    photo: {
      type: String,
      required: [false, "photo is not required"],
      default: null,
    },
    photoPublicId: {
      type: String,
      required: [false, "photoPublicId is not required"],
      default: null,
    },

    stripeAccountId: {
      type: String,
      required: false,
    },
    isStripeConnected: {
      type: Boolean,
      rquired: false,
      default: false,
    },
    address: {
      type: String,
      required: [false, "address is not required"],
    },
    phoneNumber: {
      type: String,
      required: [false, "phone number is not required"],
    },
    fcm: {
      type: String,
      required: [false, "fcm is not  required"],
      default: null,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    isDelete: {
      type: Boolean,
      required: [true, "isDeleted is Required"],
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

TUserSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret: any) {
    delete ret.password;
    return ret;
  },
});

// mongoose middleware
TUserSchema.pre("save", async function (next) {
  const user = this as any;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds)
    );
  }
  next();
});

// TUserSchema.post("save", function (doc, next) {
//   doc.password = "";
//   next();
// });

TUserSchema.pre("find", function (next) {
  this.where({ isDelete: { $ne: true } });
  next();
});

TUserSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDelete: { $ne: true } } });
  next();
});

TUserSchema.pre("findOne", function (next) {
  this.where({ isDelete: { $ne: true } });
  next();
});

TUserSchema.statics.isUserExistByCustomId = async function (id: string) {
  return await users.findOne({ id });
};

TUserSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashPassword: string
) {
  const password = await bcrypt.compare(plainTextPassword, hashPassword);
  return password;
};

TUserSchema.statics.isJWTIssuesBeforePasswordChange = async function (
  passwordChangeTimestamp: Date,
  jwtIssuesTime: number
) {
  const passwordChangeTime = new Date(passwordChangeTimestamp).getTime() / 1000;
  return passwordChangeTime > jwtIssuesTime;
};

const users = model<TUser, UserModel>("users", TUserSchema);

export default users;
