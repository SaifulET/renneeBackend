import { Document, Model } from "mongoose";
import { Request } from "express";

export interface ICollection extends Document {
  id: string;
  name: string;
  slug: string;
  image_url?: string;
  imagePublicId?: string;
  products?: string[];
  isDelete?: boolean;
}

export interface RequestWithFile extends Request {
  file?: Express.Multer.File;
  body: any;
}

export type CollectionModel = {
  isCollectionCustomId: (id: string) => Promise<ICollection>;
} & Model<ICollection>;
