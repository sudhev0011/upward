import { z } from "zod";

// ─── Create Portfolio Item ────────────────────────────────────────────────────

export const CreatePortfolioItemRequestDtoSchema = z.object({
  providerId:   z.string(),
  title:        z.string().min(1).max(100),
  description:  z.string().max(500).nullable().optional(),
  images:       z.array(z.string().url()).min(1, "At least one image is required"),
  storageKeys:  z.array(z.string()).min(1),
  thumbnailUrl: z.string().url().nullable().optional(),
  tags:         z.array(z.string()).optional(),
});

export type CreatePortfolioItemRequestDto = z.infer<
  typeof CreatePortfolioItemRequestDtoSchema
>;

// ─── Update Portfolio Item ────────────────────────────────────────────────────
// Appends new images; title/description/tags are optional partial updates

export const UpdatePortfolioItemRequestDtoSchema = z.object({
  title:           z.string().min(1).max(100).optional(),
  description:     z.string().max(500).nullable().optional(),
  tags:            z.array(z.string()).optional(),
  // new images to append (after S3 upload)
  newImages:       z.array(z.string().url()).optional(),
  newStorageKeys:  z.array(z.string()).optional(),
}).refine(
  (data) => {
    // if newImages provided, storageKeys must match length
    if (data.newImages && data.newStorageKeys) {
      return data.newImages.length === data.newStorageKeys.length;
    }
    return true;
  },
  { message: "newImages and newStorageKeys must have the same length" }
);

export type UpdatePortfolioItemRequestDto = z.infer<
  typeof UpdatePortfolioItemRequestDtoSchema
>;

// ─── Remove Single Image ──────────────────────────────────────────────────────

export const RemovePortfolioImageRequestDtoSchema = z.object({
  imageUrl: z.string().url(),
});

export type RemovePortfolioImageRequestDto = z.infer<
  typeof RemovePortfolioImageRequestDtoSchema
>;

// ─── Get Upload URL ───────────────────────────────────────────────────────────

export const GetUploadUrlRequestDtoSchema = z.object({
  fileName:    z.string().min(1),
  contentType: z.enum(["image/jpeg", "image/png", "image/webp", "image/jpg"]),
});

export type GetUploadUrlRequestDto = z.infer<typeof GetUploadUrlRequestDtoSchema>;