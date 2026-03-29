import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Instagram, Twitter, Linkedin, Globe, Youtube, Facebook } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { ProviderProfileFormData } from "@/utils/validations/provider/profile.schema";

const socialLinkConfig = [
  { index: 0, icon: Instagram, label: "Instagram" },
  { index: 1, icon: Twitter, label: "Twitter" },
  { index: 2, icon: Linkedin, label: "LinkedIn" },
  { index: 3, icon: Youtube, label: "YouTube" },
  { index: 4, icon: Facebook, label: "Facebook" },
  { index: 5, icon: Globe, label: "Website" },
];

export function SocialLinksSection() {
  const { register, formState: { errors } } = useFormContext<ProviderProfileFormData>();

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-card-foreground text-base">Social Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {socialLinkConfig.map(({ index, icon: Icon, label }) => (
          <div key={index} className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-secondary/30 border border-border/50 flex items-center justify-center shrink-0">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 space-y-1">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</Label>
              <input type="hidden" {...register(`socialLinks.${index}.name`)} />
              <Input
                {...register(`socialLinks.${index}.link`)}
                placeholder={`Your ${label} URL`}
                className="bg-secondary/30 border-border/50 rounded-xl focus:border-primary/50 transition-colors"
              />
              {errors.socialLinks?.[index]?.link && (
                <p className="text-xs text-red-500">{errors.socialLinks[index]?.link?.message}</p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
