import { RequestHandler } from "express";

import httpStatus from "http-status";
import catchAsync from "../../utils/asyncCatch";
import sendResponse from "../../utils/sendResponse";
import SettingServices from "./settings.services";
import { uploadImageToCloudinary, uploadBufferToCloudinary } from "../../utils/cloudinary";

const updateAboutUs: RequestHandler = catchAsync(async (req, res) => {
  const result = await SettingServices.updateAboutUsIntoDb(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully  Updated ",
    data: result,
  });
});

const findByAboutUs: RequestHandler = catchAsync(async (req, res) => {
  const result = await SettingServices.findByAboutUsIntoDb();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Find AboutUs",
    data: result,
  });
});

const privacyPolicys: RequestHandler = catchAsync(async (req, res) => {
  const result = await SettingServices.privacyPolicysIntoDb(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully  Recorded",
    data: result,
  });
});

const findByPrivacyPolicyss: RequestHandler = catchAsync(async (req, res) => {
  const result = await SettingServices.findByPrivacyPolicyssIntoDb();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Find By Privacy Policy ",
    data: result,
  });
});

const termsConditions: RequestHandler = catchAsync(async (req, res) => {
  const result = await SettingServices.termsConditionsIntoDb(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully  Recorded",
    data: result,
  });
});

const findByTermsConditions: RequestHandler = catchAsync(async (req, res) => {
  const result = await SettingServices.findBytermsConditionsIntoDb();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Find By Terms Conditions ",
    data: result,
  });
});

const getSocalMediaLinks: RequestHandler = catchAsync(async (req, res) => {
  const result = await SettingServices.getSocalMediaLinksIntoDb();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Find Social Media Links",
    data: result,
  });
});

const socalMediaLinks: RequestHandler = catchAsync(async (req, res) => {
  const result = await SettingServices.socalMediaLinksIntoDb(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Updated Social Media Links",
    data: result,
  });
});

const SettingController = {
  updateAboutUs,
  findByAboutUs,
  privacyPolicys,
  findByPrivacyPolicyss,
  termsConditions,
  findByTermsConditions,
  getSocalMediaLinks,
  socalMediaLinks,
  // Website Promotion
  websitePromotionOption: catchAsync(async (req, res) => {
    if (req.file) {
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer, 'promotion');
      req.body.img = uploadResult.secure_url;
    }
    const result = await SettingServices.websitePromotionOptionIntoDb(req.body);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Promotion created", data: result });
  }),
  getWebsitePromotionOption: catchAsync(async (req, res) => {
    const result = await SettingServices.getWebsitePromotionOptionFromDb();
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Promotions found", data: result });
  }),
  updateWebsitePromotion: catchAsync(async (req, res) => {
    if (req.file) {
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer, 'promotion');
      req.body.img = uploadResult.secure_url;
    }
    const result = await SettingServices.updateWebsitePromotionIntoDb(req.params.id, req.body);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Promotion updated", data: result });
  }),
  deleteWebsitePromotion: catchAsync(async (req, res) => {
    const result = await SettingServices.deleteWebsitePromotionFromDb(req.params.id);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Promotion deleted", data: result });
  }),

  // Product Promotion
  productPromotionOption: catchAsync(async (req, res) => {
    if (req.file) {
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer, 'promotion');
      req.body.img = uploadResult.secure_url;
    }
    const result = await SettingServices.productPromotionOptionIntoDb(req.body);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Promotion created", data: result });
  }),
  getProductPromotionOption: catchAsync(async (req, res) => {
    const result = await SettingServices.getProductPromotionOptionFromDb();
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Promotions found", data: result });
  }),
  updateProductPromotion: catchAsync(async (req, res) => {
    if (req.file) {
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer, 'promotion');
      req.body.img = uploadResult.secure_url;
    }
    const result = await SettingServices.updateProductPromotionIntoDb(req.params.id, req.body);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Promotion updated", data: result });
  }),
  deleteProductPromotion: catchAsync(async (req, res) => {
    const result = await SettingServices.deleteProductPromotionFromDb(req.params.id);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Promotion deleted", data: result });
  }),

  // Vendors Promotion
  vendorsPromotionOption: catchAsync(async (req, res) => {
    if (req.file) {
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer, 'promotion');
      req.body.img = uploadResult.secure_url;
    }
    const result = await SettingServices.vendorsPromotionOptionIntoDb(req.body);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Promotion created", data: result });
  }),
  getVendorsPromotionOption: catchAsync(async (req, res) => {
    const result = await SettingServices.getVendorsPromotionOptionFromDb();
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Promotions found", data: result });
  }),
  updateVendorsPromotion: catchAsync(async (req, res) => {
    if (req.file) {
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer, 'promotion');
      req.body.img = uploadResult.secure_url;
    }
    const result = await SettingServices.updateVendorsPromotionIntoDb(req.params.id, req.body);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Promotion updated", data: result });
  }),
  deleteVendorsPromotion: catchAsync(async (req, res) => {
    const result = await SettingServices.deleteVendorsPromotionFromDb(req.params.id);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Promotion deleted", data: result });
  }),
};

export default SettingController;
