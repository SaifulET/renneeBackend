import { aboutus, privacypolicys, termsConditions, socalMediaLinks, WebsitePromotion, ProductPromotion, VendorsPromotion } from './settings.modal';
import httpStatus from 'http-status';
import { TAboutUs, TPrivacyPolicy, TTermsConditions, TSocalMediaLinks, TWebsitePromotion, TProductPromotion, TVendorsPromotion } from './settings.interface';
import AppError from '../../errors/AppError';
import { Model } from 'mongoose';


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
  return await model.create(payload);
}

async function getPromotions<T>(model: Model<T>) {
  return await model.find().select('-isDelete -createdAt -updatedAt -__v');
}

async function updatePromotion<T>(model: Model<T>, id: string, payload: Partial<T>) {
  return await model.findByIdAndUpdate(id, payload, { new: true });
}

async function deletePromotion<T>(model: Model<T>, id: string) {
  return await model.findByIdAndUpdate(id, { isDelete: true }, { new: true });
}

export default SettingServices;