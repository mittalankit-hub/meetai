import { z } from "zod";

export const MeetingInsertSchema = z.object({
  name: z.string().min(1, "Name is required"),
  summary: z.string().min(1, "Summary is required"),
});


// export const MeetingUpdateSchema = MeetingInsertSchema.extend({
//   id: z.string(),
// });
