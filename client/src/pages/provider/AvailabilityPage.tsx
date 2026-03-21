import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { toast } from "sonner";
import { Clock, CalendarDays, Ban, AlertTriangle, Save } from "lucide-react";
import { format } from "date-fns";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const timeOptions = [
  "6:00 AM", "6:30 AM", "7:00 AM", "7:30 AM", "8:00 AM", "8:30 AM",
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
  "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM",
  "9:00 PM", "9:30 PM", "10:00 PM",
];

interface DaySchedule {
  enabled: boolean;
  start: string;
  end: string;
}

interface DayOverride {
  date: Date;
  start: string;
  end: string;
  isUnavailable: boolean;
}

export default function AvailabilityPage() {
  const [available, setAvailable] = useState(true);
  const [bookingWindow, setBookingWindow] = useState("30");
  const [maxHours, setMaxHours] = useState("8");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [overrideStart, setOverrideStart] = useState("9:00 AM");
  const [overrideEnd, setOverrideEnd] = useState("5:00 PM");

  const [weeklySchedule, setWeeklySchedule] = useState<Record<string, DaySchedule>>({
    Monday: { enabled: true, start: "9:00 AM", end: "6:00 PM" },
    Tuesday: { enabled: true, start: "9:00 AM", end: "6:00 PM" },
    Wednesday: { enabled: true, start: "10:00 AM", end: "5:00 PM" },
    Thursday: { enabled: true, start: "9:00 AM", end: "6:00 PM" },
    Friday: { enabled: true, start: "9:00 AM", end: "7:00 PM" },
    Saturday: { enabled: true, start: "10:00 AM", end: "2:00 PM" },
    Sunday: { enabled: false, start: "9:00 AM", end: "5:00 PM" },
  });

  const [overrides, setOverrides] = useState<DayOverride[]>([
    { date: new Date(2026, 2, 15), start: "10:00 AM", end: "2:00 PM", isUnavailable: false },
  ]);

  const [unavailableDates, setUnavailableDates] = useState<Date[]>([
    new Date(2026, 2, 20),
    new Date(2026, 2, 25),
  ]);

  const updateSchedule = (day: string, field: keyof DaySchedule, value: string | boolean) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const getOverrideForDate = (date: Date) => {
    return overrides.find(o => o.date.toDateString() === date.toDateString());
  };

  const isUnavailable = (date: Date) => {
    return unavailableDates.some(d => d.toDateString() === date.toDateString());
  };

  const handleSaveOverride = () => {
    if (!selectedDate) return;
    const existing = overrides.filter(o => o.date.toDateString() !== selectedDate.toDateString());
    setOverrides([...existing, { date: selectedDate, start: overrideStart, end: overrideEnd, isUnavailable: false }]);
    toast.success(`Override saved for ${format(selectedDate, "MMM d, yyyy")}`);
  };

  const handleMarkUnavailable = () => {
    if (!selectedDate) return;
    if (isUnavailable(selectedDate)) {
      setUnavailableDates(prev => prev.filter(d => d.toDateString() !== selectedDate.toDateString()));
      toast.success(`${format(selectedDate, "MMM d, yyyy")} marked as available`);
    } else {
      setUnavailableDates(prev => [...prev, selectedDate]);
      setOverrides(prev => prev.filter(o => o.date.toDateString() !== selectedDate.toDateString()));
      toast.success(`${format(selectedDate, "MMM d, yyyy")} marked as unavailable`);
    }
  };

  const handleRemoveOverride = (date: Date) => {
    setOverrides(prev => prev.filter(o => o.date.toDateString() !== date.toDateString()));
    toast.success("Override removed");
  };

  const selectedDateOverride = selectedDate ? getOverrideForDate(selectedDate) : null;
  const selectedDateUnavailable = selectedDate ? isUnavailable(selectedDate) : false;
  const selectedDayName = selectedDate ? format(selectedDate, "EEEE") : "";
  const selectedDaySchedule = selectedDayName ? weeklySchedule[selectedDayName] : null;

  // Dates that have overrides or are unavailable for calendar highlighting
  const overrideDates = overrides.map(o => o.date);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Availability</h1>
          <p className="text-muted-foreground mt-1.5">Manage your schedule, booking window, and day-specific overrides.</p>
        </div>
        <Button className="rounded-xl shadow-lg shadow-primary/20" onClick={() => toast.success("All changes saved!")}>
          <Save className="h-4 w-4 mr-2" /> Save All
        </Button>
      </div>

      {/* Global Toggle */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-card-foreground">Available for bookings</h3>
              <p className="text-sm text-muted-foreground mt-0.5">Toggle off to pause all incoming requests</p>
            </div>
            <Switch checked={available} onCheckedChange={setAvailable} />
          </div>
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-card-foreground text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" /> Weekly Schedule
          </CardTitle>
          <p className="text-sm text-muted-foreground">Set your regular working hours for each day of the week.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {days.map(day => {
            const schedule = weeklySchedule[day];
            return (
              <div key={day} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/10 border border-border/30">
                <Switch
                  checked={schedule.enabled}
                  onCheckedChange={(val) => updateSchedule(day, "enabled", val)}
                  className="shrink-0"
                />
                <span className={`w-24 text-sm font-medium ${schedule.enabled ? "text-foreground" : "text-muted-foreground"}`}>
                  {day}
                </span>
                {schedule.enabled ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Select value={schedule.start} onValueChange={(val) => updateSchedule(day, "start", val)}>
                      <SelectTrigger className="w-[130px] h-9 text-xs rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <span className="text-muted-foreground text-xs">to</span>
                    <Select value={schedule.end} onValueChange={(val) => updateSchedule(day, "end", val)}>
                      <SelectTrigger className="w-[130px] h-9 text-xs rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground italic">Day off</span>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Booking Window & Max Hours */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-card-foreground text-base flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" /> Booking Window
            </CardTitle>
            <p className="text-sm text-muted-foreground">How far in advance clients can book you.</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={bookingWindow}
                onChange={(e) => setBookingWindow(e.target.value)}
                className="w-24 rounded-lg"
                min="1"
                max="365"
              />
              <span className="text-sm text-muted-foreground">days in advance</span>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Clients can book appointments up to <span className="text-primary font-semibold">{bookingWindow} days</span> from today.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-card-foreground text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-primary" /> Maximum Working Hours
            </CardTitle>
            <p className="text-sm text-muted-foreground">Limit the total hours you work per day.</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={maxHours}
                onChange={(e) => setMaxHours(e.target.value)}
                className="w-24 rounded-lg"
                min="1"
                max="24"
              />
              <span className="text-sm text-muted-foreground">hours per day</span>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              You won't be booked beyond <span className="text-primary font-semibold">{maxHours} hours</span> in a single day.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Overrides */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-card-foreground text-base flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" /> Date-Specific Overrides
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Select a date to override its timing or mark it as unavailable. This overrides your weekly pattern.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar */}
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="p-3 pointer-events-auto rounded-xl border border-border/30"
                modifiers={{
                  override: overrideDates,
                  unavailable: unavailableDates,
                }}
                modifiersClassNames={{
                  override: "bg-primary/20 text-primary font-semibold",
                  unavailable: "bg-destructive/20 text-destructive line-through",
                }}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </div>

            {/* Selected Date Details */}
            <div className="space-y-4">
              {selectedDate ? (
                <>
                  <div className="p-4 rounded-xl bg-secondary/10 border border-border/30">
                    <h4 className="font-semibold text-foreground text-sm">
                      {format(selectedDate, "EEEE, MMMM d, yyyy")}
                    </h4>
                    {selectedDateUnavailable ? (
                      <Badge variant="destructive" className="mt-2">Marked Unavailable</Badge>
                    ) : selectedDateOverride ? (
                      <div className="mt-2 space-y-1">
                        <Badge className="bg-primary/20 text-primary border-primary/30">Override Active</Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          Custom hours: {selectedDateOverride.start} — {selectedDateOverride.end}
                        </p>
                      </div>
                    ) : selectedDaySchedule ? (
                      <p className="text-xs text-muted-foreground mt-2">
                        Regular hours: {selectedDaySchedule.enabled
                          ? `${selectedDaySchedule.start} — ${selectedDaySchedule.end}`
                          : "Day off"}
                      </p>
                    ) : null}
                  </div>

                  {!selectedDateUnavailable && (
                    <div className="space-y-3">
                      <Label className="text-xs text-muted-foreground">Override Timing</Label>
                      <div className="flex items-center gap-2">
                        <Select value={overrideStart} onValueChange={setOverrideStart}>
                          <SelectTrigger className="w-[130px] h-9 text-xs rounded-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timeOptions.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <span className="text-muted-foreground text-xs">to</span>
                        <Select value={overrideEnd} onValueChange={setOverrideEnd}>
                          <SelectTrigger className="w-[130px] h-9 text-xs rounded-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timeOptions.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button size="sm" className="rounded-lg w-full" onClick={handleSaveOverride}>
                        Save Override
                      </Button>
                    </div>
                  )}

                  <Separator className="bg-border/30" />

                  <Button
                    variant={selectedDateUnavailable ? "outline" : "destructive"}
                    size="sm"
                    className="rounded-lg w-full"
                    onClick={handleMarkUnavailable}
                  >
                    <Ban className="h-3.5 w-3.5 mr-2" />
                    {selectedDateUnavailable ? "Mark as Available" : "Mark as Unavailable"}
                  </Button>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  Select a date on the calendar to view or override its schedule.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Overrides & Unavailable Dates */}
      {(overrides.length > 0 || unavailableDates.length > 0) && (
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-card-foreground text-base">Active Overrides & Blocked Dates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {overrides.map((o, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary/10 border border-border/30">
                <div>
                  <span className="text-sm font-medium text-foreground">{format(o.date, "EEE, MMM d, yyyy")}</span>
                  <span className="text-xs text-muted-foreground ml-3">{o.start} — {o.end}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px]">Override</Badge>
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive" onClick={() => handleRemoveOverride(o.date)}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            {unavailableDates.map((d, i) => (
              <div key={`u-${i}`} className="flex items-center justify-between p-3 rounded-xl bg-destructive/5 border border-destructive/20">
                <span className="text-sm font-medium text-foreground">{format(d, "EEE, MMM d, yyyy")}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="text-[10px]">Unavailable</Badge>
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive" onClick={() => {
                    setUnavailableDates(prev => prev.filter(ud => ud.toDateString() !== d.toDateString()));
                    toast.success("Date unblocked");
                  }}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
