import { useMutation } from "@tanstack/react-query";
import { chatApi } from "@/api/chat.api";
import axios from "axios";

const compressImage = (file: File, quality: number = 0.7): Promise<Blob | File> => {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/") || file.type === "image/gif") {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob: Blob | null) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = () => {
        resolve(file);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      resolve(file);
    };
    reader.readAsDataURL(file);
  });
};

export const useUploadChatAttachment = () => {
  return useMutation<{ fileUrl: string; storageKey: string }, Error, File>({
    mutationFn: async (file: File): Promise<{ fileUrl: string; storageKey: string }> => {
      const fileToUpload = await compressImage(file);

      const res = await chatApi.getUploadUrl(file.name, fileToUpload.type);
      if (!res.success || !res.data) {
        throw new Error(res.message || "Failed to generate presigned upload URL");
      }

      const { uploadUrl, fileUrl, storageKey } = res.data;

      await axios.put(uploadUrl, fileToUpload, {
        headers: {
          "Content-Type": fileToUpload.type,
        },
      });

      return { fileUrl, storageKey };
    },
  });
};
