import { Schema, model } from 'mongoose';
import {
  AboutModel,
  PrivacyPolicyModel,
  TAboutUs,
  TermsConditionsModel,
  TPrivacyPolicy,
  TTermsConditions,
  TSocalMediaLinks,
  SocalMediaLinksModel,
  TWebsitePromotion,
  TProductPromotion,
  TVendorsPromotion,
  WebsitePromotionModel,
  ProductPromotionModel,
  VendorsPromotionModel,
} from './settings.interface';

const AboutUsSchema = new Schema<TAboutUs, AboutModel>(
  {
    aboutUs: {
      type: String,
      required: [true, 'About Us content is required'],
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);
const PrivacyPolicySchema = new Schema<TPrivacyPolicy, PrivacyPolicyModel>(
  {
    PrivacyPolicy: {
      type: String,
      required: [true, 'PrivacyPolicy content is required'],
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const TermsConditionSchema = new Schema<TTermsConditions, TermsConditionsModel>(
  {
    TermsConditions: {
      type: String,
      required: [true, 'TermsConditionsy content is required'],
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

AboutUsSchema.statics.isAboutCustomId = async function (id: string) {
  return this.findById(id);
};
PrivacyPolicySchema.statics.isPrivacyPolicyCustomId = async function (
  id: string,
) {
  return this.findById(id);
};

TermsConditionSchema.statics.isTermsConditionsCustomId = async function (
  id: string,
) {
  return this.findById(id);
};

AboutUsSchema.pre('find', function (next) {
  this.find({ isDelete: { $ne: true } });
  next();
});
AboutUsSchema.pre('findOne', function (next) {
  this.findOne({ isDelete: { $ne: true } });
  next();
});
AboutUsSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDelete: { $ne: true } } });
  next();
});

PrivacyPolicySchema.pre('find', function (next) {
  this.find({ isDelete: { $ne: true } });
  next();
});
PrivacyPolicySchema.pre('findOne', function (next) {
  this.findOne({ isDelete: { $ne: true } });
  next();
});
PrivacyPolicySchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDelete: { $ne: true } } });
  next();
});

TermsConditionSchema.pre('find', function (next) {
  this.find({ isDelete: { $ne: true } });
  next();
});
TermsConditionSchema.pre('findOne', function (next) {
  this.findOne({ isDelete: { $ne: true } });
  next();
});
TermsConditionSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDelete: { $ne: true } } });
  next();
});

export const aboutus = model<TAboutUs, AboutModel>('aboutus', AboutUsSchema);
export const privacypolicys = model<TPrivacyPolicy, PrivacyPolicyModel>(
  'privacypolicys',
  PrivacyPolicySchema,
);

export const termsConditions = model<TTermsConditions, TermsConditionsModel>(
  'termsConditions',
  TermsConditionSchema,
);

const SocalMediaLinksSchema = new Schema<TSocalMediaLinks, SocalMediaLinksModel>(
  {
    facebook: {
      url: { type: String, default: "" },
      isActive: { type: Boolean, default: false }
    },
    instagram: {
      url: { type: String, default: "" },
      isActive: { type: Boolean, default: false }
    },
    twitter: {
      url: { type: String, default: "" },
      isActive: { type: Boolean, default: false }
    },
    linkedin: {
      url: { type: String, default: "" },
      isActive: { type: Boolean, default: false }
    },
    youtube: {
      url: { type: String, default: "" },
      isActive: { type: Boolean, default: false }
    },
    tiktok: {
      url: { type: String, default: "" },
      isActive: { type: Boolean, default: false }
    },
    whatsapp: {
      url: { type: String, default: "" },
      isActive: { type: Boolean, default: false }
    },
    telegram: {
      url: { type: String, default: "" },
      isActive: { type: Boolean, default: false }
    },
    snapchat: {
      url: { type: String, default: "" },
      isActive: { type: Boolean, default: false }
    },
    address: {
      url: { type: String, default: "" },
      isActive: { type: Boolean, default: false }
    },
    phone: {
      url: { type: String, default: "" },
      isActive: { type: Boolean, default: false }
    },
    email: {
      url: { type: String, default: "" },
      isActive: { type: Boolean, default: false }
    },
    website: {
      url: { type: String, default: "" },
      isActive: { type: Boolean, default: false }
    },
    appName: {
      url: { type: String, default: "" },
      isActive: { type: Boolean, default: false }
    },
  },
  {
    timestamps: true,
  },
);

SocalMediaLinksSchema.statics.isSocalMediaLinksCustomId = async function (id: string) {
  return this.findById(id);
};

export const socalMediaLinks = model<TSocalMediaLinks, SocalMediaLinksModel>(
  'socalMediaLinks',
  SocalMediaLinksSchema,
);

const PromotionSchema = new Schema<TWebsitePromotion>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String, required: true },
  img: { type: String, required: true },
  isDelete: { type: Boolean, default: false },
}, { timestamps: true });

PromotionSchema.pre('find', function (next) {
  this.find({ isDelete: { $ne: true } });
  next();
});
PromotionSchema.pre('findOne', function (next) {
  this.findOne({ isDelete: { $ne: true } });
  next();
});
PromotionSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDelete: { $ne: true } } });
  next();
});

export const WebsitePromotion = model<TWebsitePromotion, WebsitePromotionModel>(
  'WebsitePromotion',
  PromotionSchema,
);

export const ProductPromotion = model<TProductPromotion, ProductPromotionModel>(
  'ProductPromotion',
  PromotionSchema,
);

export const VendorsPromotion = model<TVendorsPromotion, VendorsPromotionModel>(
  'VendorsPromotion',
  PromotionSchema,
);