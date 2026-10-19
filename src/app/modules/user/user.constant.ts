import config from "../../config";

//'admin' | 'user' | 'faculty'
export const USER_ROLE = {
  buyer: "buyer",
  consultant: "consultant",
  admin: "admin",
  superAdmin: "superAdmin"
} as const;

export const USER_ACCESSIBILITY = {
  isProgress: "isProgress",
  blocked: "blocked",
} as const;

// App signup sends "FeMale". "Female" stays valid for older records.
export const GENDER = {
  male: "Male",
  female: "Female",
  feMale: "FeMale",
  others: "Others",
} as const;

export const GENDER_VALUES = [
  GENDER.male,
  GENDER.female,
  GENDER.feMale,
  GENDER.others,
] as const;

export type TGender = (typeof GENDER_VALUES)[number];

export const normalizeGender = (value: string): TGender | null => {
  const trimmed = value.trim();
  const key = trimmed.toLowerCase();

  if (key === "male") return GENDER.male;
  if (key === "other" || key === "others") return GENDER.others;
  if (key === "female") {
    return trimmed.includes("M") && trimmed !== "Female" ? GENDER.feMale : GENDER.female;
  }

  return null;
};

export interface UserResponse {
  status: boolean;
  message: string;
}


export const superAdminCredentials = {

  fullname: "Super Admin",
  email: `${config.SUPER_ADMIN_EMAIL}`,
  password: "$2a$12$NjfyNKCKWgTotxcyGXCcwOwvmf91bHSxgYzGQK83pVDsi51mDA.OO",  // hashed 123456
  phoneNumber:"01722305054",
  isVerify: true,
}
