import { RequestHandler } from "express";
import httpStatus from "http-status";
import UserServices from "./user.service";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/asyncCatch";
import { NotificationService } from "../notifications/notification.service";
import users from "./user.model";
import { USER_ROLE } from "./user.constant";

const createUser: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserServices.createUserIntoDb(req.body);
  
  // Send notification to all super admins when a new account is created
  try {
    const superAdmins = await users.find({
      role: USER_ROLE.superAdmin
    });

    if (superAdmins.length > 0) {
      const superAdminIds = superAdmins.map(admin => admin._id.toString());
      
      await NotificationService.sendBulkNotifications(
        superAdminIds,
        "New Account Created",
        `A new ${(result as any).role} account has been created: ${(result as any).fullname} (${(result as any).email})`,
        "system",
        {
          priority: "medium",
          relatedId: (result as any)._id?.toString(),
          metadata: {
            userRole: (result as any).role,
            userEmail: (result as any).email,
            userName: (result as any).fullname
          }
        }
      );
    }
  } catch (notificationError) {
    // Log error but don't fail the user creation
    console.error("Failed to send notification to super admins:", notificationError);
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Created Successfully",
    data: result,
  });
});
const userVarification: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserServices.userVarificationIntoDb(
    req.body.verificationCode
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Varified Your Account",
    data: result,
  });
});

const chnagePassword: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserServices.chnagePasswordIntoDb(req.body, req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Change Password",
    data: result,
  });
});

const forgotPassword: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserServices.forgotPasswordIntoDb(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Send Email",
    data: result,
  });
});

const verificationForgotUser: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserServices.verificationForgotUserIntoDb(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Verify User",
    data: result,
  });
});

const resetPassword: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserServices.resetPasswordIntoDb({ ...req.body, userId: req.user.id });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Reset Password",
    data: result,
  });
});


const getUserGrowth: RequestHandler = catchAsync(async (req, res) => {

  const result = await UserServices.getUserGrowthIntoDb(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully  Find User Growth",
    data: result,
  });

});

const recently_joined_user: RequestHandler = catchAsync(async (req, res) => {

  const result = await UserServices.recently_joined_user_IntoDb(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully  Find  Recent Joined User",
    data: result,
  });


});

const getAllConsult: RequestHandler = catchAsync(async (req, res) => {
  const { meta, data } = await UserServices.getAllConsultIntoDb(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Retrieved Consultants",
    meta,
    data,
  });
});

const deleteAllTypesOfUser: RequestHandler = catchAsync(async (req, res) => {

  const result = await UserServices.deleteAllTypesOfUserIntoDb(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Delete  ",
    data: result,
  });
})

const UserController = {
  createUser,
  userVarification,
  chnagePassword,
  forgotPassword,
  verificationForgotUser,
  resetPassword,
  getUserGrowth,
  recently_joined_user,
  deleteAllTypesOfUser,
  getAllConsult,
};

export default UserController;
