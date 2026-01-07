import mongoose from "mongoose";
import users from "../user/user.model";
import { USER_ACCESSIBILITY, USER_ROLE } from "../user/user.constant";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { jwtHelpers } from "../../helper/jwtHelpers";
import config from "../../config";
import { ProfileUpdateResponse, RequestWithFile } from "./auth.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import { user_search_filed } from "./auth.constant";
import {
  deleteFromCloudinary,
  uploadImageToCloudinary,
} from "../../utils/cloudinary";
import fs from "fs";

const loginUserIntoDb = async (payload: {
  email: string;
  password: string;
  fcm?: string;
}) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const isUserExist = await users.findOne(
      {
        $and: [
          { email: payload.email },
          { isVerify: true },
          { status: USER_ACCESSIBILITY.isProgress },
          { isDelete: false },
        ],
      },
      { password: 1, _id: 1, isVerify: 1, email: 1, role: 1 },
      { session }
    );

    if (!isUserExist) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found", "");
    }

    const checkedFcm = await users.findOneAndUpdate(
      { email: payload.email },
      {
        $set: {
          fcm: payload?.fcm,
        },
      },
      { new: true, upsert: true, session }
    );

    if (!checkedFcm) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "issues by the fcm token updatation",
        ""
      );
    }

    if (
      !(await users.isPasswordMatched(payload?.password, isUserExist.password))
    ) {
      throw new AppError(httpStatus.FORBIDDEN, "This Password Not Matched", "");
    }

    const jwtPayload = {
      id: isUserExist.id,
      role: isUserExist.role,
      email: isUserExist.email,
    };

    let accessToken: string | null = null;
    let refreshToken: string | null = null;

    if (isUserExist.isVerify) {
      accessToken = jwtHelpers.generateToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.expires_in as string
      );

      refreshToken = jwtHelpers.generateToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.refresh_expires_in as string
      );
    }
    await session.commitTransaction();

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const refreshTokenIntoDb = async (token: string) => {
  try {
    const decoded = jwtHelpers.verifyToken(
      token,
      config.jwt_refresh_secret as string
    );

    const { id } = decoded;

    const isUserExist = await users.findOne(
      {
        $and: [
          { _id: id },
          { isVerify: true },
          { status: USER_ACCESSIBILITY.isProgress },
          { isDelete: false },
        ],
      },
      { _id: 1, isVerify: 1, email: 1 }
    );

    if (!isUserExist) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found", "");
    }
    let accessToken: string | null = null;
    if (isUserExist.isVerify) {
      const jwtPayload = {
        id: isUserExist.id,
        role: isUserExist.role,
        email: isUserExist.email,
      };
      accessToken = jwtHelpers.generateToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.expires_in as string
      );
    }

    return {
      accessToken,
    };
  } catch (error: any) {
    throw new AppError(
      httpStatus.SERVICE_UNAVAILABLE,
      "refresh Token generator error",
      error
    );
  }
};

const myprofileIntoDb = async (id: string) => {
  try {
    return await users
      .findById(id)
      .select("fullname email  address photo phoneNumber role");
  } catch (error: any) {
    throw new AppError(
      httpStatus.SERVICE_UNAVAILABLE,
      "issues by the get my profile section server  error",
      error
    );
  }
};

/**
 * @param req
 * @param id
 * @returns
 */
const changeMyProfileIntoDb = async (
  req: RequestWithFile,
  id: string
): Promise<ProfileUpdateResponse> => {
  try {
    const file = req.file;
    const { fullname, gender, address, phoneNumber } = req.body as {
      fullname?: string;
      gender?: string;
      address?: string;
      phoneNumber?: string;
    };

    const updateData: {
      fullname?: string;
      gender?: string;
      photo?: string;
      photoPublicId?: string;
      address?: string;
      phoneNumber?: string;
    } = {};

    if (fullname) updateData.fullname = fullname;
    if (gender) updateData.gender = gender;
    if (address) updateData.address = address;
    if (phoneNumber || phoneNumber === "") {
      updateData.phoneNumber = phoneNumber;
    }

    if (file) {
      const filePath = file.path.replace(/\\/g, "/");
      const existingUser = await users.findById(id).select("photoPublicId");
      const uploaded = await uploadImageToCloudinary(
        filePath,
        "profiles",
        "high"
      );

      updateData.photo = uploaded.secure_url;
      updateData.photoPublicId = uploaded.public_id;

      try {
        fs.unlinkSync(file.path);
      } catch {}

      try {
        if (existingUser?.photoPublicId) {
          await deleteFromCloudinary(existingUser.photoPublicId);
        }
      } catch {}
    }

    if (Object.keys(updateData).length === 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "No data provided for update",
        ""
      );
    }

    const result = await users.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!result) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found", "");
    }

    return {
      status: true,
      message: "Successfully updated profile",
    };
  } catch (error: any) {
    if (error instanceof AppError) throw error;

    throw new AppError(
      httpStatus.SERVICE_UNAVAILABLE,
      "Profile update failed",
      error.message
    );
  }
};

const findByAllUsersAdminIntoDb = async (query: Record<string, unknown>) => {
  try {
    const allUsersdQuery = new QueryBuilder(
      users
        .find()
        .select(
          "_id fullname email phoneNumber role isVerify photo status createdAt"
        ),
      query
    )
      .search(user_search_filed)
      .filter()
      .sort()
      .paginate()
      .fields();

    const all_users = await allUsersdQuery.modelQuery;
    const meta = await allUsersdQuery.countTotal();

    return { meta, all_users };
  } catch (error: any) {
    throw new AppError(
      httpStatus.SERVICE_UNAVAILABLE,
      "find By All User Admin IntoDb server unavailable",
      error
    );
  }
};

const deleteAccountIntoDb = async (id: string) => {
  try {
    return id;
  } catch (error: any) {
    throw new AppError(
      httpStatus.SERVICE_UNAVAILABLE,
      "delete Account Into Db server unavailable",
      error
    );
  }
};

const isBlockAccountIntoDb = async (
  id: string,
  payload: { status: boolean }
) => {
  try {
    const status = payload?.status
      ? USER_ACCESSIBILITY.isProgress
      : USER_ACCESSIBILITY.blocked;

    const result = await users.findByIdAndUpdate(
      id,
      { status: status },
      { new: true, upsert: true }
    );

    return result ? { status: true, message: `successfully ${status} ` } : "";
  } catch (error: any) {
    throw new AppError(
      httpStatus.SERVICE_UNAVAILABLE,
      " is block account into db server unavailable",
      error
    );
  }
};

const find_by_all_admin_IntoDb = async (
  adminId: string,
  query: Record<string, unknown>
) => {
  try {
    const allAdminQuery = new QueryBuilder(
      users
        .find({
          $or: [{ role: USER_ROLE.admin }, { role: USER_ROLE.superAdmin }],
        })
        .select(
          "_id fullname email phoneNumber role isVerify photo  status"
        ),
      query
    )
      .search(user_search_filed)
      .filter()
      .sort()
      .paginate()
      .fields();

    const all_admin = await allAdminQuery.modelQuery;
    const meta = await allAdminQuery.countTotal();

    return { meta, all_admin };
  } catch (error: any) {
    throw new AppError(
      httpStatus.SERVICE_UNAVAILABLE,
      "issues by the find by all admin into db server unavailable",
      error
    );
  }
};

const AuthServices = {
  loginUserIntoDb,
  refreshTokenIntoDb,
  myprofileIntoDb,
  changeMyProfileIntoDb,
  findByAllUsersAdminIntoDb,
  deleteAccountIntoDb,
  isBlockAccountIntoDb,
  find_by_all_admin_IntoDb,
};

export default AuthServices;
