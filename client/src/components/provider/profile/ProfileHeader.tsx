import { Camera, MapPin, Loader2, Star } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { ProviderProfileFormData } from "@/utils/validations/provider/profile.schema";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useGetProfileUploadUrl } from "@/hooks/provider/useGetProfileUploadUrl";
import { useUploadProfilePictureMutation } from "@/hooks/provider/useUploadProfilePictureMutation";
import { useUpdateProfileMutation } from "@/hooks/provider/useUpdateProfile";

interface ProfileHeaderProps {
  avatarUrl?: string | null;
  rating?: number;
  experience?: string | null;
  isAvailable?: boolean;
}

export function ProfileHeader({
  avatarUrl,
  rating = 0,
  experience = "—",
  isAvailable = true,
}: ProfileHeaderProps) {
  const { watch } = useFormContext<ProviderProfileFormData>();
  const name = watch("name");
  const location = watch("location");
  const skills = watch("skills") || [];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const getUploadUrlMutation = useGetProfileUploadUrl();
  const uploadPictureMutation = useUploadProfilePictureMutation();
  const updateProfileMutation = useUpdateProfileMutation();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);
      const urlResponse = await getUploadUrlMutation.mutateAsync({ fileType: file.type });
      if (!urlResponse.data?.uploadUrl) throw new Error("Failed to get upload URL");

      await uploadPictureMutation.mutateAsync({
        uploadUrl: urlResponse.data.uploadUrl,
        file,
      });
      await updateProfileMutation.mutateAsync({ avatarUrl: urlResponse.data.fileUrl });
      toast.success("Profile picture updated!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload profile picture");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const initials = name
    ? name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "P";

  return (
    <div className="w-full rounded-2xl border border-[#c8dff0] overflow-hidden bg-white shadow-sm">

      {/* Hero row */}
      <div className="bg-[#EAF2F9] border-b border-[#c8dff0] px-6 py-7 sm:px-8">
        <div className="flex items-center gap-6">

          {/* Avatar — large with bottom edit bar */}
          <div className="relative flex-shrink-0 group">
            <div className="h-24 w-24 rounded-[20px] bg-[#719FC4] border-[3px] border-white shadow-md flex items-center justify-center overflow-hidden">
              {isUploading ? (
                <Loader2 className="h-7 w-7 text-white animate-spin" />
              ) : avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[34px] font-bold text-white select-none leading-none">
                  {initials}
                </span>
              )}
            </div>

            {/* Edit bar — visible on hover */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute bottom-0 left-0 right-0 bg-gray-900/70 rounded-b-[17px] py-[5px] flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:pointer-events-none"
            >
              <Camera className="h-3 w-3 text-white" />
              <span className="text-[10px] font-semibold text-white tracking-wide">Edit</span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {/* Right: name, location, availability + stats */}
          <div className="flex-1 min-w-0">

            {/* Name + availability */}
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h2 className="text-[22px] font-extrabold tracking-tight text-gray-900 leading-snug truncate">
                  {name || (
                    <span className="text-gray-400 italic font-semibold text-lg">Your Name</span>
                  )}
                </h2>
                <p className="flex items-center gap-1 mt-1 text-[13px] font-medium text-[#5585A8]">
                  <MapPin className="h-3 w-3 flex-shrink-0 text-[#719FC4]" />
                  {location || (
                    <span className="text-gray-300 italic">Your Location</span>
                  )}
                </p>
              </div>

              {/* Availability */}
              <div
                className={`flex items-center gap-2 bg-white border rounded-full px-4 py-1.5 flex-shrink-0 ${
                  isAvailable ? "border-[#c8dff0]" : "border-gray-200"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isAvailable ? "bg-emerald-400" : "bg-gray-300"
                  }`}
                />
                <span
                  className={`text-[12px] font-semibold ${
                    isAvailable ? "text-emerald-600" : "text-gray-400"
                  }`}
                >
                  {isAvailable ? "Available" : "Unavailable"}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-5 mt-4">
              <div>
                <p className="text-[16px] font-extrabold text-gray-900 leading-none flex items-center gap-1">
                  {rating > 0 ? rating.toFixed(1) : "—"}
                  {rating > 0 && (
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 mb-0.5" />
                  )}
                </p>
                <p className="text-[10px] font-semibold text-[#5585A8] tracking-widest uppercase mt-1">
                  Rating
                </p>
              </div>
              <div className="w-px h-7 bg-[#c8dff0]" />
              <div>
                <p className="text-[16px] font-extrabold text-gray-900 leading-none">{experience}</p>
                <p className="text-[10px] font-semibold text-[#5585A8] tracking-widest uppercase mt-1">
                  Exp
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills row */}
      <div className="px-6 py-4 sm:px-8 flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase mr-2">
          Skills
        </span>
        {skills.length > 0 ? (
          <>
            {skills.slice(0, 5).map((skill: string) => (
              <span
                key={skill}
                className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#5585A8] bg-[#EAF2F9] border border-[#c8dff0]"
              >
                {skill}
              </span>
            ))}
            {skills.length > 5 && (
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold text-gray-400 bg-gray-50 border border-gray-200">
                +{skills.length - 5}
              </span>
            )}
          </>
        ) : (
          ["Skill", "Tag", "Here"].map((s) => (
            <span
              key={s}
              className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold text-gray-300 border border-dashed border-[#c8dff0]"
            >
              {s}
            </span>
          ))
        )}
      </div>
    </div>
  );
}