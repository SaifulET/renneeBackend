import express from 'express';

import { USER_ROLE } from '../user/user.constant';

import settingValidationSchema from './settings.validation';
import SettingController from './settings.controller';
import auth from '../../middlewares/auth';
import validationRequest from '../../middlewares/validationRequest';
import upload, { memoryUpload } from '../../utils/uploadFile';
import parseData from '../../middlewares/parseData';

const routes = express.Router();

routes.post(
  '/about',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validationRequest(settingValidationSchema.AboutValidationSchema),
  SettingController.updateAboutUs,
);

routes.get('/find_by_about_us', SettingController.findByAboutUs);


routes.post(
  '/privacy_policys',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validationRequest(settingValidationSchema.PrivacyPolicysValidationSchema),
  SettingController.privacyPolicys,
);
routes.get(
  '/find_by_privacy_policy',
  SettingController.findByPrivacyPolicyss,
);

routes.post(
  '/terms_conditions',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validationRequest(settingValidationSchema.TermsConditionsValidationSchema),
  SettingController.termsConditions,
);
routes.get(
  '/find_by_terms_conditions',
  SettingController.findByTermsConditions,
);

routes.get(
  '/get_socal_media_links_address_phone_email',
  SettingController.getSocalMediaLinks,
);

routes.get(
  '/website_promotion_option',
  SettingController.getWebsitePromotionOption,
);

routes.get(
  '/product_promotion_option',
  SettingController.getProductPromotionOption,
);

routes.post(
  '/website_promotion_option',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  memoryUpload.single('file'),
  parseData,
  validationRequest(settingValidationSchema.WebsitePromotionOptionValidationSchema),
  SettingController.websitePromotionOption,
);

routes.patch(
  '/website_promotion_option/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  memoryUpload.single('file'),
  parseData,
  SettingController.updateWebsitePromotion,
);

routes.delete(
  '/website_promotion_option/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  SettingController.deleteWebsitePromotion,
);

routes.post(
  '/product_promotion_option',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  memoryUpload.single('file'),
  parseData,
  validationRequest(settingValidationSchema.ProductPromotionOptionValidationSchema),
  SettingController.productPromotionOption,
);
routes.patch(
  '/product_promotion_option/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  memoryUpload.single('file'),
  parseData,
  SettingController.updateProductPromotion,
);
routes.delete(
  '/product_promotion_option/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  SettingController.deleteProductPromotion,
);

// Vendors Promotion Routes
routes.get(
  '/vendors_promotion_option',
  SettingController.getVendorsPromotionOption,
);
routes.post(
  '/vendors_promotion_option',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  memoryUpload.single('file'),
  parseData,
  validationRequest(settingValidationSchema.VendorsPromotionOptionValidationSchema),
  SettingController.vendorsPromotionOption,
);
routes.patch(
  '/vendors_promotion_option/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  memoryUpload.single('file'),
  parseData,
  SettingController.updateVendorsPromotion,
);
routes.delete(
  '/vendors_promotion_option/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  SettingController.deleteVendorsPromotion,
);

routes.post(
  '/socal_media_links_address_phone_email',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validationRequest(settingValidationSchema.SocalMediaLinksValidationSchema),
  SettingController.socalMediaLinks,
);

const SettingsRoutes = routes;

export default SettingsRoutes;