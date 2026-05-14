import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useGetAvailabilityQuery } from "@/hooks/provider/availability/useGetAvailabilityQuery";
import { useSetAvailabilityMutation } from "@/hooks/provider/availability/useSetAvailabilityMutation";
import { useGetAvailabilityOverridesQuery } from "@/hooks/provider/availability-override/useGetAvailabilityOverridesQuery";
import { useSetAvailabilityOverrideMutation } from "@/hooks/provider/availability-override/useSetAvailabilityOverrideMutation";
import { useDeleteAvailabilityOverrideMutation } from "@/hooks/provider/availability-override/useDeleteAvailabilityOverrideMutation";
import { useGetUnavailabilityQuery } from "@/hooks/provider/unavailability/useGetUnavailabilityQuery";
import { useCreateUnavailabilityMutation } from "@/hooks/provider/unavailability/useCreateUnavailabilityMutation";
import { useDeleteUnavailabilityMutation } from "@/hooks/provider/unavailability/useDeleteUnavailabilityMutation";
import { DAYS } from "@/constants/availability.constant";
import {
  DayKey,
  LocalDaySchedule,
  DEFAULT_SCHEDULE,
} from "@/interfaces/availability.types";
import {
  toDateString,
  fromDateString,
} from "@/utils/availability/availability.utils";

export const useAvailabilityPage = () => {
  // ── Server state ─────────────────────────────────────────────────────────────
  const { data: availabilityRes, isLoading: loadingAvailability } =
    useGetAvailabilityQuery();
  const { data: overridesRes, isLoading: loadingOverrides } =
    useGetAvailabilityOverridesQuery();
  const { data: unavailabilityRes, isLoading: loadingUnavailability } =
    useGetUnavailabilityQuery();

  const setAvailabilityMutation = useSetAvailabilityMutation();
  const setOverrideMutation = useSetAvailabilityOverrideMutation();
  const deleteOverrideMutation = useDeleteAvailabilityOverrideMutation();
  const createUnavailabilityMutation = useCreateUnavailabilityMutation();
  const deleteUnavailabilityMutation = useDeleteUnavailabilityMutation();

  // ── Local UI state ────────────────────────────────────────────────────────────
  const [bookingWindow, setBookingWindow] = useState<number>(7);
  const [bookingWindowError, setBookingWindowError] = useState<string | null>(
    null,
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [overrideStart, setOverrideStart] = useState("09:00");
  const [overrideEnd, setOverrideEnd] = useState("17:00");
  const [weeklySchedule, setWeeklySchedule] =
    useState<Record<DayKey, LocalDaySchedule>>(DEFAULT_SCHEDULE);
  const [isSeeded, setIsSeeded] = useState(false);
  const [initialWeeklySchedule, setInitialWeeklySchedule] = useState<Record<
    DayKey,
    LocalDaySchedule
  > | null>(null);

  const [initialBookingWindow, setInitialBookingWindow] = useState<
    number | null
  >(null);

  if (availabilityRes?.data && !isSeeded) {
    const availability = availabilityRes.data;

    setBookingWindow(Number(availability.availabilityWindow));

    const seeded = {} as Record<DayKey, LocalDaySchedule>;
    for (const day of DAYS) {
      const d = availability.weeklySchedule[day];
      seeded[day] = {
        enabled: d.isWorking,
        start: d.startTime ?? "09:00",
        end: d.endTime ?? "18:00",
      };
    }
    setWeeklySchedule(seeded);
    setInitialWeeklySchedule(structuredClone(seeded));
    setInitialBookingWindow(Number(availability.availabilityWindow));
    setIsSeeded(true);
  }

  // ── Derived server data ───────────────────────────────────────────────────────
  const serverOverrides = overridesRes?.data ?? [];
  const serverUnavailabilities = unavailabilityRes?.data ?? [];

  const overrideDates = serverOverrides.map((o) => fromDateString(o.date));
  const unavailableDates = serverUnavailabilities.map(
    (u) => new Date(u.startDate),
  );
  const isScheduleDirty =
    JSON.stringify(weeklySchedule) !== JSON.stringify(initialWeeklySchedule) ||
    bookingWindow !== initialBookingWindow;

  // ── Selected date derived state ───────────────────────────────────────────────
  const selectedDateStr = selectedDate ? toDateString(selectedDate) : null;

  const selectedOverride = selectedDateStr
    ? (serverOverrides.find((o) => o.date === selectedDateStr) ?? null)
    : null;

  const selectedUnavailability = selectedDateStr
    ? (serverUnavailabilities.find(
        (u) =>
          toDateString(new Date(u.startDate)) === selectedDateStr &&
          u.source === "manual",
      ) ?? null)
    : null;

  const isSelectedUnavailable = !!selectedUnavailability;

  const selectedDayKey = selectedDate
    ? (format(selectedDate, "EEEE").toLowerCase() as DayKey)
    : null;

  const selectedDaySchedule = selectedDayKey
    ? weeklySchedule[selectedDayKey]
    : null;

  // ── Handlers ──────────────────────────────────────────────────────────────────

  const updateSchedule = (
    day: DayKey,
    field: keyof LocalDaySchedule,
    value: string | boolean,
  ) => {
    setWeeklySchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleBookingWindowChange = (value: number) => {
    setBookingWindow(value);
    if (value >= 7) setBookingWindowError(null);
  };

  const handleSaveSchedule = () => {
    if (bookingWindow < 7) {
      setBookingWindowError("Booking window must be at least 7 days");
      return;
    }

    if (!isScheduleDirty) {
      toast.info("No changes to save");
      return;
    }

    setBookingWindowError(null);

    const weeklySchedulePayload = {} as Record<
      DayKey,
      { isWorking: boolean; startTime: string | null; endTime: string | null }
    >;

    for (const day of DAYS) {
      const d = weeklySchedule[day];
      weeklySchedulePayload[day] = {
        isWorking: d.enabled,
        startTime: d.enabled ? d.start : null,
        endTime: d.enabled ? d.end : null,
      };
    }

    setAvailabilityMutation.mutate(
      {
        weeklySchedule: weeklySchedulePayload,
        availabilityWindow: bookingWindow,
      },
      {
        onSuccess: (response) => {
          setInitialWeeklySchedule(structuredClone(weeklySchedule));
          setInitialBookingWindow(bookingWindow);

          toast.success(response.message ?? "Schedule saved successfully");
        },
        onError: (error) =>
          toast.error(error?.message ?? "Failed to save schedule"),
      },
    );
  };

  const handleSaveOverride = () => {
    if (!selectedDate || !selectedDateStr) return;

    if (selectedUnavailability) {
      toast.error(
        "This date has an unavailability block. Remove it first before adding an override.",
      );
      return;
    }

    if (selectedDaySchedule?.enabled) {
      if (
        overrideStart === selectedDaySchedule.start &&
        overrideEnd === selectedDaySchedule.end
      ) {
        toast.warning(
          "These hours match your regular schedule for this day. No override needed.",
        );
        return;
      }
    }

    setOverrideMutation.mutate(
      {
        date: selectedDateStr,
        isWorking: true,
        startTime: overrideStart,
        endTime: overrideEnd,
      },
      {
        onSuccess: () =>
          toast.success(
            `Override saved for ${format(selectedDate, "MMM d, yyyy")}`,
          ),
        onError: (error) =>
          toast.error(error?.message ?? "Failed to save override"),
      },
    );
  };

  const handleMarkUnavailable = () => {
    if (!selectedDate || !selectedDateStr) return;

    if (isSelectedUnavailable) {
      deleteUnavailabilityMutation.mutate(selectedUnavailability!.id, {
        onSuccess: () =>
          toast.success(
            `${format(selectedDate, "MMM d, yyyy")} marked as available`,
          ),
        onError: () => toast.error("Failed to update availability"),
      });
    } else {
      if (selectedOverride) {
        toast.error(
          "This date has an active override. Remove it first before blocking the date.",
        );
        return;
      }

      const [y, m, d] = selectedDateStr.split("-").map(Number);
      const dayStart = new Date(y, m - 1, d, 0, 0, 0);
      const dayEnd = new Date(y, m - 1, d, 23, 59, 59);

      createUnavailabilityMutation.mutate(
        {
          startDate: dayStart,
          endDate: dayEnd,
          source: "manual",
          reason: null,
        },
        {
          onSuccess: () =>
            toast.success(
              `${format(selectedDate, "MMM d, yyyy")} marked as unavailable`,
            ),
          onError: (error) =>
            toast.error(error?.message ?? "Failed to mark unavailable"),
        },
      );
    }
  };

  const handleRemoveOverride = (date: string) => {
    deleteOverrideMutation.mutate(date, {
      onSuccess: (response) =>
        toast.success(response?.message ?? "Override removed"),
      onError: (error) =>
        toast.error(error?.message ?? "Failed to remove override"),
    });
  };

  const handleRemoveUnavailability = (id: string) => {
    deleteUnavailabilityMutation.mutate(id, {
      onSuccess: (response) =>
        toast.success(response?.message ?? "Date unblocked"),
      onError: (error) =>
        toast.error(error?.message ?? "Failed to unblock date"),
    });
  };

  // ── Loading ───────────────────────────────────────────────────────────────────
  const isLoading =
    loadingAvailability || loadingOverrides || loadingUnavailability;

  return {
    // loading
    isLoading,

    // weekly schedule
    weeklySchedule,
    updateSchedule,
    isScheduleDirty,

    // booking window
    bookingWindow,
    bookingWindowError,
    handleBookingWindowChange,

    // calendar
    selectedDate,
    selectedDateStr,
    setSelectedDate,
    overrideDates,
    unavailableDates,

    // selected date context
    selectedOverride,
    selectedUnavailability,
    isSelectedUnavailable,
    selectedDaySchedule,

    // override inputs
    overrideStart,
    setOverrideStart,
    overrideEnd,
    setOverrideEnd,

    // lists
    serverOverrides,
    serverUnavailabilities,

    // handlers
    handleSaveSchedule,
    handleSaveOverride,
    handleMarkUnavailable,
    handleRemoveOverride,
    handleRemoveUnavailability,

    // mutation pending states
    isSavingSchedule: setAvailabilityMutation.isPending,
    isSavingOverride: setOverrideMutation.isPending,
    isDeletingOverride: deleteOverrideMutation.isPending,
    isCreatingUnavailability: createUnavailabilityMutation.isPending,
    isDeletingUnavailability: deleteUnavailabilityMutation.isPending,
  };
};
