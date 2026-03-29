import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { providerProfileSchema, type ProviderProfileFormData } from "@/utils/validations/provider/profile.schema";
import { useGetProfileQuery } from "@/hooks/provider/useGetProfile";
import { useUpdateProfileMutation } from "@/hooks/provider/useUpdateProfile";
import { useCreateProfileMutation } from "@/hooks/provider/useCreateProfile";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

import { ProfileHeader } from "@/components/provider/profile/ProfileHeader";
import { PersonalInfoSection } from "@/components/provider/profile/PersonalInfoSection";
import { ExperienceSection } from "@/components/provider/profile/ExperienceSection";
import { SkillsSection } from "@/components/provider/profile/SkillsSection";
import { LanguagesSection } from "@/components/provider/profile/LanguagesSection";
import { SocialLinksSection } from "@/components/provider/profile/SocialLinksSection";

export default function ProfilePage() {
  const { data: profileResponse, isLoading } = useGetProfileQuery();
  const updateMutation = useUpdateProfileMutation();
  const createMutation = useCreateProfileMutation();

  const profile = profileResponse?.data;
  const isProfileExists = !!profile?.id;

  const form = useForm<ProviderProfileFormData>({
    resolver: zodResolver(providerProfileSchema),
    defaultValues: {
      name: "",
      bio: "",
      location: "",
      phone: "",
      email: "",
      dateOfBirth: undefined,
      gender: "male",
      skills: [],
      languages: [],
      experience: "0",
      socialLinks: [
        { name: "instagram", link: "" },
        { name: "twitter", link: "" },
        { name: "linkedin", link: "" },
        { name: "youtube", link: "" },
        { name: "facebook", link: "" },
        { name: "website", link: "" },
      ],
    }
  });

  const { reset, handleSubmit, formState: { isDirty } } = form;

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || "",
        bio: profile.bio || "",
        location: profile.location || "",
        phone: profile.phone || "",
        email: profile.email || "",
        dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : undefined,
        gender: profile.gender || "male",
        skills: profile.skills || [],
        languages: profile.languages || [],
        experience: profile.experience !== null && profile.experience !== undefined ? String(profile.experience) : "0",
        socialLinks: [
          { name: "instagram", link: profile.socialLinks?.find(s => s.name === 'instagram')?.link || "" },
          { name: "twitter", link: profile.socialLinks?.find(s => s.name === 'twitter')?.link || "" },
          { name: "linkedin", link: profile.socialLinks?.find(s => s.name === 'linkedin')?.link || "" },
          { name: "youtube", link: profile.socialLinks?.find(s => s.name === 'youtube')?.link || "" },
          { name: "facebook", link: profile.socialLinks?.find(s => s.name === 'facebook')?.link || "" },
          { name: "website", link: profile.socialLinks?.find(s => s.name === 'website')?.link || "" },
        ],
      });
    }
  }, [profile, reset]);

  const onSubmit = (data: ProviderProfileFormData) => {
    const cleanedData = {
      ...data,
      socialLinks: data.socialLinks?.filter(link => link?.link?.trim() !== "") || []
    };

    if (isProfileExists) {
      updateMutation.mutate(cleanedData);
    } else {
      createMutation.mutate(cleanedData as any);
    }
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Profile</h1>
          <p className="text-muted-foreground mt-1.5">Manage your public provider profile.</p>
        </div>

        <ProfileHeader avatarUrl={profile?.avatarUrl} rating={profile?.ratingAvg} experience={profile?.experience} isAvailable={profile?.isApprovedByAdmin} />
        <PersonalInfoSection />
        <ExperienceSection />
        <SkillsSection />
        <LanguagesSection />
        <SocialLinksSection />

        <div className="pt-4 flex justify-end">
          <Button 
            type="submit" 
            disabled={!isDirty || updateMutation.isPending || createMutation.isPending} 
            className="rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
          >
            {updateMutation.isPending || createMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
