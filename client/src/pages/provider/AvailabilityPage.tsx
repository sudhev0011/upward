import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, CalendarDays, Ban, Save, Loader2 } from "lucide-react";
import { format } from "date-fns";
import {
  DAYS,
  DAY_LABELS,
  TIME_OPTIONS,
} from "@/constants/availability.constant";
import { to12h, fromDateString } from "@/utils/availability/availability.utils";
import { useAvailabilityPage } from "@/hooks/availability/useAvailabilityPage";

export default function AvailabilityPage() {
  const {
    isLoading,
    weeklySchedule,
    updateSchedule,
    isScheduleDirty,
    bookingWindow,
    bookingWindowError,
    handleBookingWindowChange,
    selectedDate,
    setSelectedDate,
    selectedDateStr,
    overrideDates,
    unavailableDates,
    selectedOverride,
    isSelectedUnavailable,
    selectedDaySchedule,
    overrideStart,
    setOverrideStart,
    overrideEnd,
    setOverrideEnd,
    serverOverrides,
    serverUnavailabilities,
    handleSaveSchedule,
    handleSaveOverride,
    handleMarkUnavailable,
    handleRemoveOverride,
    handleRemoveUnavailability,
    isSavingSchedule,
    isSavingOverride,
    isDeletingOverride,
    isCreatingUnavailability,
    isDeletingUnavailability,
  } = useAvailabilityPage();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Availability
          </h1>
          <p className="text-muted-foreground mt-1.5">
            Manage your schedule, booking window, and day-specific overrides.
          </p>
        </div>
        <Button
          className="rounded-xl shadow-lg shadow-primary/20"
          onClick={handleSaveSchedule}
          disabled={isSavingSchedule || !isScheduleDirty}
        >
          {isSavingSchedule ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Schedule
        </Button>
      </div>

      {/* Weekly Schedule */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm w-full">
  <CardHeader className="p-4 sm:p-6">
    <CardTitle className="text-card-foreground text-base flex items-center gap-2">
      <Clock className="h-4 w-4 text-primary" /> Weekly Schedule
    </CardTitle>
    <p className="text-sm text-muted-foreground mt-1">
      Set your regular working hours for each day of the week.
    </p>
  </CardHeader>
  
  <CardContent className="p-4 sm:p-6 pt-0 space-y-3">
    {DAYS.map((day) => {
      const schedule = weeklySchedule[day];
      return (
        <div
          key={day}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-secondary/10 border border-border/30 transition-all"
        >
          {/* Top Section: Switch & Day Name */}
          <div className="flex items-center gap-3 shrink-0">
            <Switch
              checked={schedule.enabled}
              onCheckedChange={(val) => updateSchedule(day, "enabled", val)}
              className="shrink-0"
            />
            <span
              className={`text-sm font-semibold min-w-[70px] sm:w-24 ${
                schedule.enabled ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {DAY_LABELS[day]}
            </span>
            
            {/* Mobile-only "Day off" indicator to keep it aligned vertically on small viewports */}
            {!schedule.enabled && (
              <span className="text-xs text-muted-foreground italic sm:hidden ml-auto">
                Day off
              </span>
            )}
          </div>

          {/* Time Picker Section: Collapses vertically on mobile, expands on desktop */}
          {schedule.enabled ? (
            <div className="flex items-center gap-2 w-full sm:w-auto sm:flex-1 sm:justify-end">
              <Select
                value={schedule.start}
                onValueChange={(val) => updateSchedule(day, "start", val)}
              >
                {/* w-full on mobile, fixed width on desktop */}
                <SelectTrigger className="w-full sm:w-[120px] md:w-[130px] h-9 text-xs rounded-lg bg-background">
                  <SelectValue>{to12h(schedule.start)}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {TIME_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {to12h(t)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <span className="text-muted-foreground text-xs px-1 shrink-0">to</span>

              <Select
                value={schedule.end}
                onValueChange={(val) => updateSchedule(day, "end", val)}
              >
                {/* w-full on mobile, fixed width on desktop */}
                <SelectTrigger className="w-full sm:w-[120px] md:w-[130px] h-9 text-xs rounded-lg bg-background">
                  <SelectValue>{to12h(schedule.end)}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {TIME_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {to12h(t)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            // Desktop-only "Day off" text alignment
            <span className="hidden sm:inline text-xs text-muted-foreground italic">
              Day off
            </span>
          )}
        </div>
      );
    })}
  </CardContent>
</Card>

      {/* Booking Window */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-card-foreground text-base flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" /> Booking Window
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            How far in advance clients can book you.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              value={bookingWindow}
              onChange={(e) =>
                handleBookingWindowChange(Number(e.target.value))
              }
              className="w-24 rounded-lg"
              min="1"
              max="365"
            />
            <span className="text-sm text-muted-foreground">
              days in advance
            </span>
          </div>
          {bookingWindowError ? (
            <p className="text-xs text-destructive mt-3">
              {bookingWindowError}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground mt-3">
              Clients can book appointments up to{" "}
              <span className="text-primary font-semibold">
                {bookingWindow} days
              </span>{" "}
              from today.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Date-Specific Overrides */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-card-foreground text-base flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" /> Date-Specific
            Overrides
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Select a date to override its timing or mark it as unavailable. This
            overrides your weekly pattern.
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
                className="p-6 [&_.rdp-caption_label]:text-lg [&_.rdp-head_cell]:text-base [&_.rdp-head_cell]:w-12 [&_.rdp-head_cell]:h-12 [&_.rdp-day]:w-12 [&_.rdp-day]:h-12 [&_.rdp-day_button]:text-base [&_.rdp-nav_button]:w-10 [&_.rdp-nav_button]:h-10 [&_.rdp-nav_button]:text-xl border rounded-2xl"
                modifiers={{
                  override: overrideDates,
                  unavailable: unavailableDates,
                }}
                modifiersClassNames={{
                  override: "bg-primary/20 text-primary font-semibold rounded",
                  unavailable:
                    "bg-destructive/20 text-destructive line-through rounded",
                }}
                disabled={(date) =>
                  date < new Date(new Date().setHours(0, 0, 0, 0))
                }
              />
            </div>

            <div key={selectedDateStr ?? "no-date"} className="space-y-4">
              {selectedDate ? (
                <>
                  {/* Date status card */}
                  <div className="p-4 rounded-xl bg-secondary/10 border border-border/30">
                    <h4 className="font-semibold text-foreground text-sm">
                      {format(selectedDate, "EEEE, MMMM d, yyyy")}
                    </h4>
                    {isSelectedUnavailable ? (
                      <Badge variant="destructive" className="mt-2">
                        Marked Unavailable
                      </Badge>
                    ) : selectedOverride ? (
                      <div className="mt-2 space-y-1">
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          Override Active
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          Custom hours: {to12h(selectedOverride.startTime)} —{" "}
                          {to12h(selectedOverride.endTime)}
                        </p>
                      </div>
                    ) : selectedDaySchedule ? (
                      <p className="text-xs text-muted-foreground mt-2">
                        Regular hours:{" "}
                        {selectedDaySchedule.enabled
                          ? `${to12h(selectedDaySchedule.start)} — ${to12h(selectedDaySchedule.end)}`
                          : "Day off"}
                      </p>
                    ) : null}
                  </div>

                  {/* Override timing controls */}
                  {!isSelectedUnavailable && (
                    <div className="space-y-3">
                      <Label className="text-xs text-muted-foreground">
                        Override Timing
                      </Label>
                      <div className="flex items-center gap-2">
                        <Select
                          value={overrideStart}
                          onValueChange={setOverrideStart}
                        >
                          <SelectTrigger className="w-[130px] h-9 text-xs rounded-lg">
                            <SelectValue>{to12h(overrideStart)}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {TIME_OPTIONS.map((t) => (
                              <SelectItem key={t} value={t}>
                                {to12h(t)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span className="text-muted-foreground text-xs">
                          to
                        </span>
                        <Select
                          value={overrideEnd}
                          onValueChange={setOverrideEnd}
                        >
                          <SelectTrigger className="w-[130px] h-9 text-xs rounded-lg">
                            <SelectValue>{to12h(overrideEnd)}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {TIME_OPTIONS.map((t) => (
                              <SelectItem key={t} value={t}>
                                {to12h(t)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        size="sm"
                        className="rounded-lg w-full"
                        onClick={handleSaveOverride}
                        disabled={isSavingOverride}
                      >
                        {isSavingOverride && (
                          <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                        )}
                        Save Override
                      </Button>
                    </div>
                  )}

                  <Separator className="bg-border/30" />

                  {/* Mark unavailable toggle */}
                  <Button
                    variant={isSelectedUnavailable ? "outline" : "destructive"}
                    size="sm"
                    className="rounded-lg w-full"
                    onClick={handleMarkUnavailable}
                    disabled={
                      isCreatingUnavailability || isDeletingUnavailability
                    }
                  >
                    {(isCreatingUnavailability || isDeletingUnavailability) && (
                      <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                    )}
                    <Ban className="h-3.5 w-3.5 mr-2" />
                    {isSelectedUnavailable
                      ? "Mark as Available"
                      : "Mark as Unavailable"}
                  </Button>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  Select a date on the calendar to view or override its
                  schedule.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Overrides & Blocked Dates */}
      {(serverOverrides.length > 0 || serverUnavailabilities.length > 0) && (
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-card-foreground text-base">
              Active Overrides & Blocked Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Working-hour overrides */}
            {serverOverrides.map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between p-3 rounded-xl bg-secondary/10 border border-border/30"
              >
                <div>
                  <span className="text-sm font-medium text-foreground">
                    {format(fromDateString(o.date), "EEE, MMM d, yyyy")}
                  </span>
                  <span className="text-xs text-muted-foreground ml-3">
                    {to12h(o.startTime)} — {to12h(o.endTime)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px]">
                    Override
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-destructive"
                    disabled={isDeletingOverride}
                    onClick={() => handleRemoveOverride(o.date)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}

            {/* Manual unavailability blocks */}
            {serverUnavailabilities
              .filter((u) => u.source === "manual")
              .map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-destructive/5 border border-destructive/20"
                >
                  <div>
                    <span className="text-sm font-medium text-foreground">
                      {format(new Date(u.startDate), "EEE, MMM d, yyyy")}
                    </span>
                    {u.reason && (
                      <span className="text-xs text-muted-foreground ml-3">
                        {u.reason}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="text-[10px]">
                      Unavailable
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-destructive"
                      disabled={isDeletingUnavailability}
                      onClick={() => handleRemoveUnavailability(u.id)}
                    >
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
