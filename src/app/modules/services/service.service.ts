import { TService } from "./service.interface";
import { Service } from "./service.model";

const createService = async (payload: TService) => {
  const result = await Service.create(payload);
  return result;
};

const getAllServices = async () => {
  const result = await Service.find().populate("category_id consultant_ids");
  return result;
};

const getServiceById = async (id: string) => {
  const result = await Service.findById(id).populate("category_id consultant_ids");
  return result;
};

const updateService = async (id: string, payload: Partial<TService>) => {
  const result = await Service.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteService = async (id: string) => {
  const result = await Service.findByIdAndDelete(id);
  return result;
};

export const ServiceService = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};
