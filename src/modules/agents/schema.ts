 import { z } from "zod";

export const AgentInsertSchema = z.object({
  name: z.string().min(1, "Name is required"),
  instructions: z.string().min(1, "Instructions are required"),
//   model: z.string().min(1, "Model is required"),
//   parameters: z.record(z.string(), z.any()).optional(),
//   createdAt: z.date().optional(),
//   updatedAt: z.date().optional(),
//   userId: z.string().uuid().optional(),
//   isActive: z.boolean().default(true),
//   isPublic: z.boolean().default(false),
//   tags: z.array(z.string()).optional(),
//   icon: z.string().optional(),
//   version: z.string().optional(),
//   metadata: z.record(z.string(), z.any()).optional(),
});