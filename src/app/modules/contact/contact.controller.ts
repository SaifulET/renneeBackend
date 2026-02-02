import { RequestHandler } from "express";
import catchAsync from "../../utils/asyncCatch";
import contactServices from "./contact.services";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import users from '../user/user.model';
import AppError from '../../errors/AppError';

const createContact: RequestHandler = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;

      const { id } = decoded;
      const user = await users.findById(id);

      if (user) {
        req.body.name = user.fullname;
        req.body.email = user.email;
      }
    } catch (error) {
      // Token invalid or expired, proceed with body data or fail if missing
      console.error("Token verification failed in createContact", error);
    }
  }

  // If validation missed required fields because they were optional, we check here
  if (!req.body.name || !req.body.email) {
    throw new AppError(httpStatus.BAD_REQUEST, "Name and Email are required", "");
  }

  const result = await contactServices.createContactIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Successfully  Recorded ",
    data: result,
  });
});

const all_contact: RequestHandler = catchAsync(async (req, res) => {
  const result = await contactServices.all_contact_IntoDb(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully Find All Contact",
    data: result,
  });
});

const specificContact: RequestHandler = catchAsync(async (req, res) => {
  const result = await contactServices.specificContactIntoDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully Find Specific Contact",
    data: result,
  });
});

const updateContact: RequestHandler = catchAsync(async (req, res) => {
  const result = await contactServices.updateContactIntoDb(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully Update Contact",
    data: result,
  });
});

const deleteContact: RequestHandler = catchAsync(async (req, res) => {
  const result = await contactServices.deleteContactIntoDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully Delete Contact",
    data: result,
  });
});

const contactController = {
  createContact,
  all_contact,
  specificContact,
  updateContact,
  deleteContact
};
export default contactController;
