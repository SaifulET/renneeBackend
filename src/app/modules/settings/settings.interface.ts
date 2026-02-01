import { Model } from 'mongoose';

export interface TAboutUs {
  aboutUs: string;
  isDelete: boolean;
}

export interface TPrivacyPolicy {
  PrivacyPolicy: string;
  isDelete: boolean;
}

export interface TTermsConditions {
  TermsConditions: string;
  isDelete: boolean;
}

export interface AboutModel extends Model<TAboutUs> {
  // eslint-disable-next-line no-unused-vars
  isAboutCustomId(id: string): Promise<TAboutUs>;
}

export interface PrivacyPolicyModel extends Model<TPrivacyPolicy> {
  // eslint-disable-next-line no-unused-vars
  isPrivacyPolicyCustomId(id: string): Promise<TPrivacyPolicy>;
}

export interface TermsConditionsModel extends Model<TTermsConditions> {
  // eslint-disable-next-line no-unused-vars
  isTermsConditionsCustomId(id: string): Promise<TTermsConditions>;
}

export interface TSocalMediaLinks {
  facebook: { url: string, isActive: boolean}
  instagram: { url: string, isActive: boolean}
  twitter: { url: string, isActive: boolean}
  linkedin: { url: string, isActive: boolean}
  youtube: { url: string, isActive: boolean}
  tiktok: { url: string, isActive: boolean}
  whatsapp: { url: string, isActive: boolean}
  telegram: { url: string, isActive: boolean}
  snapchat: { url: string, isActive: boolean}
  address: { url: string, isActive: boolean}
  phone: { url: string, isActive: boolean}
  email: { url: string, isActive: boolean}
  website: { url: string, isActive: boolean}
  appName: { url: string, isActive: boolean}
}

export interface SocalMediaLinksModel extends Model<TSocalMediaLinks> {
  // eslint-disable-next-line no-unused-vars
  isSocalMediaLinksCustomId(id: string): Promise<TSocalMediaLinks>;
}