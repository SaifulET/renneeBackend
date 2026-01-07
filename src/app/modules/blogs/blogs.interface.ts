import { Model, Types } from "mongoose";

export interface TBlogs {
  blogTitle: string;
  adminId: Types.ObjectId;
  photo: string;
  photoPublicId?: string;
  content: string;
  isDelete: boolean;
}

export interface BlogsResponse {
  status: boolean;
  message: string;
}

export interface RequestWithFile extends Request {
  file?: Express.Multer.File;
}

export interface BlogsModel extends Model<TBlogs> {
  // eslint-disable-next-line no-unused-vars
  isBlogsCustomId(id: string): Promise<TBlogs>;
}
