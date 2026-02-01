import express from 'express';

import { USER_ROLE } from '../user/user.constant';

import settingValidationSchema from './settings.validation';
import SettingController from './settings.controller';
import auth from '../../middlewares/auth';
import validationRequest from '../../middlewares/validationRequest';

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

routes.post(
  '/socal_media_links_address_phone_email',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validationRequest(settingValidationSchema.SocalMediaLinksValidationSchema),
  SettingController.socalMediaLinks,
);

const SettingsRoutes = routes;

export default SettingsRoutes;