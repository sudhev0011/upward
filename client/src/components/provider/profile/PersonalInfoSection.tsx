import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useFormContext, Controller } from "react-hook-form";
import type { ProviderProfileFormData } from "@/utils/validations/provider/profile.schema";

export function PersonalInfoSection() {
  const { register, control, formState: { errors } } = useFormContext<ProviderProfileFormData>();

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-card-foreground text-base">Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</Label>
            <Input {...register("name")} className="bg-secondary/30 border-border/50 rounded-xl focus:border-primary/50 transition-colors" />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</Label>
            <Input readOnly disabled {...register("email")} className="bg-secondary/30 border-border/50 rounded-xl focus:border-primary/50 transition-colors opacity-70 cursor-not-allowed" />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone</Label>
            <Input {...register("phone")} className="bg-secondary/30 border-border/50 rounded-xl focus:border-primary/50 transition-colors" />
            {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
          </div>

          <div className="space-y-2 flex flex-col pt-1">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Date of Birth</Label>
            <Controller
              control={control}
              name="dateOfBirth"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal bg-secondary/30 border-border/50 rounded-xl hover:bg-secondary/40", !field.value && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar 
                      mode="single" 
                      selected={field.value ? new Date(field.value) : undefined} 
                      onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : undefined)} 
                      disabled={(date) => date > new Date()} 
                      initialFocus 
                      captionLayout="dropdown"
                      startMonth={new Date(1900, 0)}
                      endMonth={new Date()}
                      className="p-3 pointer-events-auto" 
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.dateOfBirth && <p className="text-xs text-red-500">{errors.dateOfBirth.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Gender</Label>
            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <Select value={field.value || "male"} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-secondary/30 border-border/50 rounded-xl">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.gender && <p className="text-xs text-red-500">{errors.gender.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Location</Label>
            <Input {...register("location")} placeholder="e.g. Los Angeles, CA" className="bg-secondary/30 border-border/50 rounded-xl focus:border-primary/50 transition-colors" />
            {errors.location && <p className="text-xs text-red-500">{errors.location.message}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bio</Label>
          <Textarea {...register("bio")} placeholder="Tell your clients about yourself..." className="bg-secondary/30 border-border/50 rounded-xl min-h-[100px] focus:border-primary/50 transition-colors" />
          {errors.bio && <p className="text-xs text-red-500">{errors.bio.message}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
