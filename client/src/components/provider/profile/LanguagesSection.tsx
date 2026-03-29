import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { ProviderProfileFormData } from "@/utils/validations/provider/profile.schema";

const availableLanguages = ["English", "Spanish", "French", "German", "Hindi", "Mandarin", "Arabic", "Portuguese", "Japanese", "Korean"];

export function LanguagesSection() {
  const { watch, setValue, formState: { errors } } = useFormContext<ProviderProfileFormData>();
  const languages = watch("languages") || [];

  const addLanguage = (lang: string) => {
    if (!languages.includes(lang)) {
      setValue("languages", [...languages, lang], { shouldDirty: true });
    }
  };

  const removeLanguage = (langToRemove: string) => {
    setValue("languages", languages.filter((l) => l !== langToRemove), { shouldDirty: true });
  };

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-card-foreground text-base">Languages</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => (
            <Badge key={lang} variant="secondary" className="text-xs rounded-lg bg-primary/10 text-primary border-primary/20 pr-1.5 gap-1">
              {lang}
              <button type="button" onClick={() => removeLanguage(lang)} className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-colors">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <Select onValueChange={addLanguage}>
          <SelectTrigger className="bg-secondary/30 border-border/50 rounded-xl w-full sm:w-64">
            <SelectValue placeholder="Add a language..." />
          </SelectTrigger>
          <SelectContent>
            {availableLanguages.filter((l) => !languages.includes(l)).map((lang) => (
              <SelectItem key={lang} value={lang}>{lang}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.languages && <p className="text-xs text-red-500">{errors.languages.message}</p>}
      </CardContent>
    </Card>
  );
}
