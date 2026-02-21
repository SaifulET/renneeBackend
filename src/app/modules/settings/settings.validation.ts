import { z } from 'zod';

const AboutValidationSchema = z.object({
  body: z.object({
    aboutUs: z.string({ message: 'about us is required' }),
  }),
});

const PrivacyPolicysValidationSchema = z.object({
  body: z.object({
    PrivacyPolicy: z.string({ message: '  PrivacyPolicy us is required' }),
  }),
});

//   TermsConditions:

const TermsConditionsValidationSchema = z.object({
  body: z.object({
    TermsConditions: z.string({ message: '  TermsConditions us is required' }),
  }),
});

const SocialMediaLinkSchema = z.object({
  url: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

const SocalMediaLinksValidationSchema = z.object({
  body: z.object({
    facebook: SocialMediaLinkSchema.optional(),
    instagram: SocialMediaLinkSchema.optional(),
    twitter: SocialMediaLinkSchema.optional(),
    linkedin: SocialMediaLinkSchema.optional(),
    youtube: SocialMediaLinkSchema.optional(),
    tiktok: SocialMediaLinkSchema.optional(),
    whatsapp: SocialMediaLinkSchema.optional(),
    telegram: SocialMediaLinkSchema.optional(),
    snapchat: SocialMediaLinkSchema.optional(),
    address: SocialMediaLinkSchema.optional(),
    phone: SocialMediaLinkSchema.optional(),
    email: SocialMediaLinkSchema.optional(),
    website: SocialMediaLinkSchema.optional(),
    appName: SocialMediaLinkSchema.optional(),
  }),
});

const PromotionValidationSchema = z.object({
  body: z.object({
    title: z.string({ message: 'Title is required' }),
    description: z.string({ message: 'Description is required' }),
    link: z.string({ message: 'Link is required' }),
    img: z.string().optional(),
  }),
});

const WebsitePromotionOptionValidationSchema = PromotionValidationSchema;
const ProductPromotionOptionValidationSchema = PromotionValidationSchema;
const VendorsPromotionOptionValidationSchema = PromotionValidationSchema;

const settingValidationSchema = {
  AboutValidationSchema,
  PrivacyPolicysValidationSchema,
  TermsConditionsValidationSchema,
  SocalMediaLinksValidationSchema,
  WebsitePromotionOptionValidationSchema,
  ProductPromotionOptionValidationSchema,
  VendorsPromotionOptionValidationSchema,
};

export default settingValidationSchema;