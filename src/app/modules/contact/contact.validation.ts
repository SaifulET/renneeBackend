import { z } from "zod";

const contactBodySchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),

  title: z
    .string({ error: "Title is required" })
    .min(1, "Title must not be empty")
    .trim(),

  description: z
    .string({ error: "Description is required" })
    .min(1, "Description must not be empty")
    .trim(),

  isDelete: z.boolean().optional(),
});

const updateBodySchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .min(1, "Name must not be empty")
    .trim()
    .optional(),

  email: z
    .string({ error: "Email is required" })
    .email("Invalid email address")
    .trim()
    .optional(),

  title: z.string().optional(),
  description: z.string().optional(),

  isDelete: z.boolean().optional(),
});

const contactRequestSchema = z.object({
  body: contactBodySchema,
});

const updateRequestSchema = z.object({
  body: updateBodySchema,
});

const contactValidation = {
  contactRequestSchema,
  updateRequestSchema,
};

export default contactValidation;
