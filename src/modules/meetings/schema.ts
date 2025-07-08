import { z } from "zod";

export const MeetingInsertSchema = z.object({
  name: z.string().min(1, "Name is required"),
  agentId: z.string().nonempty("Agent ID is required"),
});


export const MeetingUpdateSchema = MeetingInsertSchema.extend({
  id: z.string().min(1,{ message: "ID is required" }),
});
