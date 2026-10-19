import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";

export interface UserResponse {
  status: boolean;
  message: string;
}

export type TUser = {
  id: string;
  role: "buyer" | "consultant" | "admin" | "superAdmin";
  auth_type: "email" | "google" | "apple";
  specialty?: string;
  gender: "Male" | "Female" | "FeMale" | "Others";
  fullname: string;
  password?: string; // Made optional for social login
  email: string;
  verificationCode: number;
  isVerify: boolean;
  status: "isProgress" | "Blocked";
  photo?: string;
  photoPublicId?: string;
  stripeAccountId?: string;
  isStripeConnected?: boolean;
  fcm?: string;
  address?: string;
  phoneNumber?: string;
  isOnline: boolean;
  lastSeen: Date;
  isDelete: boolean;
};

export interface UserModel extends Model<TUser> {
  isUserExistByCustomId(id: string): Promise<TUser>;

  isPasswordMatched(
    userSendingPassword: string,
    existingPassword: string
  ): Promise<boolean>;
  isJWTIssuesBeforePasswordChange(
    passwordChangeTimestamp: Date,
    jwtIssuesTime: number
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;




// {
//   "email": "parvesmosarof32@gmail.com",
//   "auth_type": "email",
//   "createdAt": "2026-01-27T19:16:52.535+00:00",
//   "fcm": null,
//   "fullname": "Super Admin",
//   "isDelete": false,
//   "isStripeConnected": false,
//   "isVerify": true,
//   "password": "$2a$12$NjfyNKCKWgTotxcyGXCcwOwvmf91bHSxgYzGQK83pVDsi51mDA.OO",
//   "photo": null,
//   "photoPublicId": null,
//   "role": "admin",
//   "status": "isProgress",
//   "updatedAt": "2026-02-02T22:41:22.472+00:00",
//   "phoneNumber": "01722305054",
//   "address": "123 Main Street, New York, NY, USA",
//   "gender": "Male"
// }



// {
//   "email": "parvesmosarof32@gmail.com",
//   "auth_type": "email",
//   "createdAt": "2026-01-27T19:16:52.535+00:00",
//   "fcm": null,
//   "fullname": "Super Admin",
//   "isDelete": false,
//   "isStripeConnected": false,
//   "isVerify": true,
//   "password": "$2a$12$NjfyNKCKWgTotxcyGXCcwOwvmf91bHSxgYzGQK83pVDsi51mDA.OO",
//   "photo": null,
//   "photoPublicId": null,
//   "role": "consultant",
//   "status": "isProgress",
//   "updatedAt": "2026-02-02T22:41:22.472+00:00",
//   "phoneNumber": "01722305054",
//   "address": "123 Main Street, New York, NY, USA",
//   "gender": "Male"
// }
