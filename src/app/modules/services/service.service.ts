import { TService } from "./service.interface";
import { Service } from "./service.model";

import { uploadImageToCloudinary } from "../../utils/cloudinary";
import fs from "fs";

const createService = async (req: any) => {
  const file = req.file;
  const payload = req.body;

  if (file) {
    const filePath = file.path.replace(/\\/g, "/");
    const uploaded = await uploadImageToCloudinary(
      filePath,
      "services",
      "high"
    );
    payload.imgs = [uploaded.secure_url];

    try {
      fs.unlinkSync(file.path);
    } catch (err) {
      console.error("Error deleting local file:", err);
    }
  }

  const result = await Service.create(payload);
  return result;
};

const getAllServices = async (query: Record<string, unknown>) => {
  const queryObj = { ...query };

  const filter: Record<string, unknown> = {};

  if (queryObj.searchTerm) {
    const searchTerm = queryObj.searchTerm as string;
    const searchRegex = new RegExp(searchTerm, "i");
    filter.$or = [
      { title: searchRegex },
      { description: searchRegex },
    ];
  }

  if (queryObj.category_id) {
    filter.category_id = queryObj.category_id;
  }

  if (queryObj.type) {
    const typeMap: Record<string, string> = {
      online: "Online",
      offline: "Offline",
      both: "Both",
    };
    if (typeMap[queryObj.type as string]) {
      filter.availability_type = typeMap[queryObj.type as string];
    }
  }

  if (queryObj.instructor_id) {
    filter.consultant_ids = { $in: [queryObj.instructor_id] };
  }

  const sort: Record<string, 1 | -1> = {};

  if (queryObj.time) {
    if (queryObj.time === "newest") {
      sort.createdAt = -1;
    } else if (queryObj.time === "oldest") {
      sort.createdAt = 1;
    }
  }

  if (queryObj.price) {
    if (queryObj.price === "lowest") {
      sort.price = 1;
    } else if (queryObj.price === "highest") {
      sort.price = -1;
    }
  }

  const page = Number(queryObj.page) || 1;
  const limit = Number(queryObj.limit) || 10;
  const skip = (page - 1) * limit;

  /*
  const result = await Service.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate("category_id consultant_ids");
  */

  // Debugging populate
  const services = await Service.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  // console.log("Raw Services (Before Populate):", JSON.stringify(services, null, 2));

  const result = await Service.populate(services, [
    { path: "category_id" },
    // { path: "consultant_ids" }
  ]);

  const total = await Service.countDocuments(filter);
  const totalPage = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: result,
  };
};

const getServiceById = async (id: string) => {
  const result = await Service.findById(id).populate("category_id");
  return result;
};

const updateService = async (req: any) => {
  const { id } = req.params;
  const file = req.file;
  const payload = req.body;

  if (file) {
    const filePath = file.path.replace(/\\/g, "/");
    const uploaded = await uploadImageToCloudinary(
      filePath,
      "services",
      "high"
    );
    payload.imgs = [uploaded.secure_url];

    try {
      fs.unlinkSync(file.path);
    } catch (err) {
      console.error("Error deleting local file:", err);
    }
  }

  const result = await Service.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteService = async (id: string) => {
  const result = await Service.findByIdAndDelete(id);
  return result;
};

const getFeaturedServices = async () => {
  const result = await Service.find({ isFeatured: true })
    .populate("category_id")
    .populate({
      path: "consultant_ids",
      select: "name email image role _id",
    });
  return result;
};

export const ServiceService = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  getFeaturedServices,
};
