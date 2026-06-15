import { StatsRow }       from "./StatsRow";
import { BookingsTable }  from "./BookingsTable";

export const DashboardOverview = () => (
  <div className="flex flex-col gap-6 p-4 md:p-6 max-w-[1400px] mx-auto">

    

    {/* Row 2 — Stats */}
    <StatsRow />

    {/* Row 3 — Bookings (full width) */}
    <BookingsTable />

  </div>
);