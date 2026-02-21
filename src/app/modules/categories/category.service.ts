import { Category } from "./category.model";
import { uploadImageToCloudinary, uploadBufferToCloudinary } from "../../utils/cloudinary";
import QueryBuilder from "../../builder/QueryBuilder";

const createCategory = async (req: any) => {
  const file = req.file;
  const payload = req.body;

  if (file) {
    const uploaded = await uploadBufferToCloudinary(
      file.buffer,
      "categories",
      "high"
    );
    payload.img = uploaded.secure_url;
  }

  const result = await Category.create(payload);
  return result;
};

const getAllCategories = async (query: Record<string, unknown>) => {
  const categoryQuery = new QueryBuilder(Category.find(), query)
    .search(["name"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await categoryQuery.modelQuery;
  const meta = await categoryQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getCategoryById = async (id: string) => {
  const result = await Category.findById(id);
  return result;
};

const updateCategory = async (req: any) => {
  const { id } = req.params;
  const file = req.file;
  const payload = req.body;

  if (file) {
    const uploaded = await uploadBufferToCloudinary(
      file.buffer,
      "categories",
      "high"
    );
    payload.img = uploaded.secure_url;
  }

  const result = await Category.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteCategory = async (id: string) => {
  const result = await Category.findByIdAndDelete(id);
  return result;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
