import { Category } from "./category.model";

const createCategory = async (payload: any) => {
  const result = await Category.create(payload);
  return result;
};

const getAllCategories = async () => {
  const result = await Category.find();
  return result;
};

const getCategoryById = async (id: string) => {
  const result = await Category.findById(id);
  return result;
};

const updateCategory = async (id: string, payload: any) => {
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
