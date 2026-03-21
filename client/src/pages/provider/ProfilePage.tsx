import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, MapPin, Plus, X, Instagram, Twitter, Linkedin, Globe, Youtube, Facebook } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

const initialSkills = ["Photography", "Videography", "Drone Shots", "Photo Editing", "Color Grading"];
const initialLanguages = ["English", "Spanish"];
const availableLanguages = ["English", "Spanish", "French", "German", "Hindi", "Mandarin", "Arabic", "Portuguese", "Japanese", "Korean"];

export default function ProfilePage() {
  const [skills, setSkills] = useState(initialSkills);
  const [newSkill, setNewSkill] = useState("");
  const [languages, setLanguages] = useState(initialLanguages);
  const [dob, setDob] = useState<Date | undefined>(new Date(1995, 5, 15));
  const [socialLinks, setSocialLinks] = useState({
    instagram: "https://instagram.com/alexrivera",
    twitter: "https://twitter.com/alexrivera",
    linkedin: "https://linkedin.com/in/alexrivera",
    youtube: "",
    facebook: "",
    website: "https://alexrivera.com",
  });

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => setSkills(skills.filter((s) => s !== skill));

  const addLanguage = (lang: string) => {
    if (!languages.includes(lang)) setLanguages([...languages, lang]);
  };

  const removeLanguage = (lang: string) => setLanguages(languages.filter((l) => l !== lang));

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-1.5">Manage your public provider profile.</p>
      </div>

      {/* Avatar & Header */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
        <CardContent className="p-6 -mt-12">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="relative group">
              <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center ring-4 ring-card shadow-xl shadow-primary/10">
                <span className="text-2xl font-bold text-primary-foreground">AR</span>
              </div>
              <button className="absolute inset-0 rounded-2xl bg-background/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                <Camera className="h-5 w-5 text-foreground" />
              </button>
            </div>
            <div className="flex-1 space-y-2 pt-2">
              <h2 className="text-xl font-bold text-card-foreground">Alex Rivera</h2>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> Los Angeles, CA
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs rounded-lg bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 transition-colors">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-card-foreground text-base">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">First Name</Label>
              <Input defaultValue="Alex" className="bg-secondary/30 border-border/50 rounded-xl focus:border-primary/50 transition-colors" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Last Name</Label>
              <Input defaultValue="Rivera" className="bg-secondary/30 border-border/50 rounded-xl focus:border-primary/50 transition-colors" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</Label>
              <Input defaultValue="alex@example.com" className="bg-secondary/30 border-border/50 rounded-xl focus:border-primary/50 transition-colors" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone</Label>
              <Input defaultValue="+1 (555) 123-4567" className="bg-secondary/30 border-border/50 rounded-xl focus:border-primary/50 transition-colors" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date of Birth</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal bg-secondary/30 border-border/50 rounded-xl hover:bg-secondary/40", !dob && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dob ? format(dob, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dob} onSelect={setDob} disabled={(date) => date > new Date()} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Gender</Label>
              <Select defaultValue="male">
                <SelectTrigger className="bg-secondary/30 border-border/50 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">City</Label>
              <Input defaultValue="Los Angeles" className="bg-secondary/30 border-border/50 rounded-xl focus:border-primary/50 transition-colors" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">State</Label>
              <Input defaultValue="California" className="bg-secondary/30 border-border/50 rounded-xl focus:border-primary/50 transition-colors" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bio</Label>
            <Textarea defaultValue="Professional photographer with 8+ years of experience specializing in weddings, events, and commercial photography." className="bg-secondary/30 border-border/50 rounded-xl min-h-[100px] focus:border-primary/50 transition-colors" />
          </div>
          <Button className="rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all" onClick={() => toast.success("Personal info saved!")}>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Experience */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-card-foreground text-base">Experience</CardTitle>
        </CardHeader>
        <CardContent className="flex items-end gap-4">
          <div className="space-y-2 flex-1 max-w-xs">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Years of Experience</Label>
            <Input type="number" min={0} max={50} defaultValue="8" className="bg-secondary/30 border-border/50 rounded-xl focus:border-primary/50 transition-colors" />
          </div>
          <Button className="rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all" onClick={() => toast.success("Experience saved!")}>Save</Button>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-card-foreground text-base">Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs rounded-lg bg-primary/10 text-primary border-primary/20 pr-1.5 gap-1">
                {skill}
                <button onClick={() => removeSkill(skill)} className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-colors">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addSkill()} placeholder="Add a skill..." className="bg-secondary/30 border-border/50 rounded-xl focus:border-primary/50 transition-colors" />
            <Button variant="outline" size="icon" className="rounded-xl border-border/50 shrink-0" onClick={addSkill}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Languages */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-card-foreground text-base">Languages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <Badge key={lang} variant="secondary" className="text-xs rounded-lg bg-primary/10 text-primary border-primary/20 pr-1.5 gap-1">
                {lang}
                <button onClick={() => removeLanguage(lang)} className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-colors">
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
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-card-foreground text-base">Social Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "instagram", icon: Instagram, label: "Instagram" },
            { key: "twitter", icon: Twitter, label: "Twitter / X" },
            { key: "linkedin", icon: Linkedin, label: "LinkedIn" },
            { key: "youtube", icon: Youtube, label: "YouTube" },
            { key: "facebook", icon: Facebook, label: "Facebook" },
            { key: "website", icon: Globe, label: "Website" },
          ].map(({ key, icon: Icon, label }) => (
            <div key={key} className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-secondary/30 border border-border/50 flex items-center justify-center shrink-0">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 space-y-1">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</Label>
                <Input
                  value={socialLinks[key as keyof typeof socialLinks]}
                  onChange={(e) => setSocialLinks({ ...socialLinks, [key]: e.target.value })}
                  placeholder={`Your ${label} URL`}
                  className="bg-secondary/30 border-border/50 rounded-xl focus:border-primary/50 transition-colors"
                />
              </div>
            </div>
          ))}
          <Button className="rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all" onClick={() => toast.success("Social links saved!")}>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
