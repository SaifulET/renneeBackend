import { aboutus, privacypolicys, termsConditions, socalMediaLinks, WebsitePromotion, ProductPromotion, VendorsPromotion } from './settings.modal';
import httpStatus from 'http-status';
import { TAboutUs, TPrivacyPolicy, TTermsConditions, TSocalMediaLinks, TWebsitePromotion, TProductPromotion, TVendorsPromotion } from './settings.interface';
import AppError from '../../errors/AppError';
import { Model } from 'mongoose';
import users from '../user/user.model';
import { NotificationService } from '../notifications/notification.service';
import { USER_ROLE } from '../user/user.constant';

async function notifyAllUsers(title: string, message: string) {
  try {
    // Get all active users
    const allUsers = await users.find({ isDelete: { $ne: true } }, { _id: 1 });
    const userIds = allUsers.map(u => u._id.toString());
    
    if (userIds.length > 0) {
      // Don't await this so the response returns to the admin faster
      NotificationService.sendBulkNotifications(
        userIds,
        title,
        message,
        'system'
      ).catch(err => console.error("Bulk notification failed:", err));
    }
  } catch (error) {
    console.error("Failed to notify users about setting update:", error);
  }
}
const updateAboutUsIntoDb = async (payload: TAboutUs) => {
  try {
    const aboutText = payload.aboutUs?.trim() ?? '';

    if (!aboutText) {
      await aboutus.deleteMany();
      return { status: true, message: 'AboutUs content cleared successfully' };
    }
    const result = await aboutus.findOneAndUpdate(
      {},
      { aboutUs: aboutText, isDelete: payload.isDelete ?? false },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );


    if (result) {
       notifyAllUsers("About Us Updated", "The About Us information has been updated by an administrator.");
    }

    return result
      ? { status: true, message: 'AboutUs successfully saved' }
      : { status: false, message: 'Failed to save AboutUs' };
  } catch (error: any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to update AboutUs in DB',
      error,
    );
  }
};

const findByAboutUsIntoDb = async () => {
  try {
    const result = await aboutus
      .findOne()
      .select('-isDelete -createdAt -updatedAt');

    return result;
  } catch (error: any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to update about into db',
      error,
    );
  }
};

const privacyPolicysIntoDb = async (payload: TPrivacyPolicy) => {
  try {
    const privacyPolicyText = payload.PrivacyPolicy?.trim() ?? "";

    if (!privacyPolicyText) {
      await privacypolicys.deleteMany();
      return { status: true, message: "Privacy policy content cleared successfully" };
    }

    const result = await privacypolicys.findOneAndUpdate(
      {},
      { PrivacyPolicy: privacyPolicyText, isDelete: payload.isDelete ?? false },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    if (result) {
       notifyAllUsers("Privacy Policy Updated", "The Privacy Policy has been updated by an administrator.");
    }

    return result
      ? { status: true, message: "Privacy policy successfully saved" }
      : { status: false, message: "Failed to save privacy policy" };
  } catch (error: any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to save privacy policy into DB",
      error
    );
  }
};


const findByPrivacyPolicyssIntoDb = async () => {
  try {
    const result = await privacypolicys
      .findOne()
      .select('-isDelete -createdAt -updatedAt');

    return result;
  } catch (error: any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to update about into db',
      error,
    );
  }
};

// termsConditions


const termsConditionsIntoDb = async (payload: TTermsConditions) => {
  try {
    const termsConditionsText = payload.TermsConditions?.trim() ?? "";

    if (!termsConditionsText) {
      await termsConditions.deleteMany();
      return { status: true, message: "Terms and Conditions content cleared successfully" };
    }

    const result = await termsConditions.findOneAndUpdate(
      {},
      { TermsConditions: termsConditionsText, isDelete: payload.isDelete ?? false },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    if (result) {
       notifyAllUsers("Terms & Conditions Updated", "The Terms and Conditions have been updated by an administrator.");
    }

    return result
      ? { status: true, message: "Terms and Conditions successfully saved" }
      : { status: false, message: "Failed to save Terms and Conditions" };
  } catch (error: any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to save Terms and Conditions into DB",
      error
    );
  }
};


const findBytermsConditionsIntoDb = async () => {
  try {
    const result = await termsConditions
      .findOne()
      .select('-isDelete -createdAt -updatedAt');

    return result;
  } catch (error: any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to update  termsConditions into db',
      error,
    );
  }
};

const socalMediaLinksIntoDb = async (payload: TSocalMediaLinks) => {
  try {
    const result = await socalMediaLinks.findOneAndUpdate(
      {},
      payload,
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    if (result) {
       notifyAllUsers("Settings Updated", "General website settings and contact info have been updated.");
    }

    return result
      ? { status: true, message: "Social Media Links successfully saved" }
      : { status: false, message: "Failed to save Social Media Links" };
  } catch (error: any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to save Social Media Links into DB",
      error
    );
  }
};

const getSocalMediaLinksIntoDb = async () => {
  try {
    const result = await socalMediaLinks
      .findOne()
      .select('-createdAt -updatedAt -__v');

    return result;
  } catch (error: any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to get Social Media Links from db',
      error,
    );
  }
};

const SettingServices = {
  updateAboutUsIntoDb,
  findByAboutUsIntoDb,
  privacyPolicysIntoDb,
  findByPrivacyPolicyssIntoDb,
  termsConditionsIntoDb,
  findBytermsConditionsIntoDb,
  socalMediaLinksIntoDb,
  getSocalMediaLinksIntoDb,
  // Website Promotion
  websitePromotionOptionIntoDb: (payload: TWebsitePromotion) => createPromotion(WebsitePromotion, payload),
  getWebsitePromotionOptionFromDb: () => getPromotions(WebsitePromotion),
  updateWebsitePromotionIntoDb: (id: string, payload: Partial<TWebsitePromotion>) => updatePromotion(WebsitePromotion, id, payload),
  deleteWebsitePromotionFromDb: (id: string) => deletePromotion(WebsitePromotion, id),

  // Product Promotion
  productPromotionOptionIntoDb: (payload: TProductPromotion) => createPromotion(ProductPromotion, payload),
  getProductPromotionOptionFromDb: () => getPromotions(ProductPromotion),
  updateProductPromotionIntoDb: (id: string, payload: Partial<TProductPromotion>) => updatePromotion(ProductPromotion, id, payload),
  deleteProductPromotionFromDb: (id: string) => deletePromotion(ProductPromotion, id),

  // Vendors Promotion
  vendorsPromotionOptionIntoDb: (payload: TVendorsPromotion) => createPromotion(VendorsPromotion, payload),
  getVendorsPromotionOptionFromDb: () => getPromotions(VendorsPromotion),
  updateVendorsPromotionIntoDb: (id: string, payload: Partial<TVendorsPromotion>) => updatePromotion(VendorsPromotion, id, payload),
  deleteVendorsPromotionFromDb: (id: string) => deletePromotion(VendorsPromotion, id),
};

async function createPromotion<T>(model: Model<T>, payload: T) {
  const result = await model.create(payload);
  if (result) {
    notifyAllUsers("New Promotion Available", "A new promotion has been added to the website.");
  }
  return result;
}

async function getPromotions<T>(model: Model<T>) {
  return await model.find({ isDelete: { $ne: true } }).select('-isDelete -createdAt -updatedAt -__v');
}

async function updatePromotion<T>(model: Model<T>, id: string, payload: Partial<T>) {
  const result = await model.findByIdAndUpdate(id, payload, { new: true });
  if (result) {
    notifyAllUsers("Promotion Updated", "One of our promotions has been updated.");
  }
  return result;
}

async function deletePromotion<T>(model: Model<T>, id: string) {
  return await model.findByIdAndUpdate(id, { isDelete: true }, { new: true });
}

export default SettingServices;