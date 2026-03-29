import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import type { ProviderProfileFormData } from "@/utils/validations/provider/profile.schema";

export function SkillsSection() {
  const { watch, setValue, formState: { errors } } = useFormContext<ProviderProfileFormData>();
  const [newSkill, setNewSkill] = useState("");
  const skills = watch("skills") || [];

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setValue("skills", [...skills, newSkill.trim()], { shouldDirty: true });
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setValue("skills", skills.filter((s) => s !== skillToRemove), { shouldDirty: true });
  };

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-card-foreground text-base">Skills</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs rounded-lg bg-primary/10 text-primary border-primary/20 pr-1.5 gap-1">
              {skill}
              <button type="button" onClick={() => removeSkill(skill)} className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-colors">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input 
            value={newSkill} 
            onChange={(e) => setNewSkill(e.target.value)} 
            onKeyDown={(e) => { 
              if (e.key === "Enter") { 
                e.preventDefault(); 
                addSkill(); 
              } 
            }} 
            placeholder="Add a skill..." 
            className="bg-secondary/30 border-border/50 rounded-xl focus:border-primary/50 transition-colors" 
          />
          <Button type="button" variant="outline" size="icon" className="rounded-xl border-border/50 shrink-0" onClick={addSkill}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {errors.skills && <p className="text-xs text-red-500">{errors.skills.message}</p>}
      </CardContent>
    </Card>
  );
}
