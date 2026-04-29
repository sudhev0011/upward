import * as z from "zod";

const MODES = ["onsite", "offsite", "both"] as const;

export const createServiceSchema = z.object({
  categoryId: z.string().min(1, "Please select a category"),
  name: z.string().trim().min(3, "Name must be at least 3 characters").max(50),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(500),
  maxHour: z
    .union([z.number(), z.string(), z.null(), z.undefined()])
    .transform((val) => (val === "" || val === undefined || val === null ? null : Number(val))),
  mode: z.enum(MODES),
  isActive: z.boolean().default(true),
}).superRefine((data, ctx) => {
  if (data.mode !== "offsite" && data.maxHour === null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Max hours is required",
      path: ["maxHour"],
    });
  }
  if (data.maxHour !== null && (data.maxHour < 1 || data.maxHour > 24)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Hours must be 1-24",
      path: ["maxHour"],
    });
  }
});

export type CreateServiceFormInput = z.input<typeof createServiceSchema>;
export type CreateServiceFormValues = z.infer<typeof createServiceSchema>;