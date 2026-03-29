import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";
import type { ProviderProfileFormData } from "@/utils/validations/provider/profile.schema";

export function ExperienceSection() {
  const { register, formState: { errors } } = useFormContext<ProviderProfileFormData>();

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-card-foreground text-base">Experience</CardTitle>
      </CardHeader>
      <CardContent className="flex items-start gap-4 flex-col">
        <div className="space-y-2 w-full max-w-xs">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Years of Experience</Label>
          <Input type="number" min={0} max={50} {...register("experience")} className="bg-secondary/30 border-border/50 rounded-xl focus:border-primary/50 transition-colors" />
          {errors.experience && <p className="text-xs text-red-500">{errors.experience.message}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
