import { WelcomeBanner, QuickActions } from "./WelcomeBanner";
import { StatsRow }       from "./StatsRow";
import { BookingsTable }  from "./BookingsTable";
import { SpendingChart, CategorySplit } from "./SpendingChart";
import { ActivityFeed }   from "./ActivityFeed";
import { Recommendations } from "./Recommendations";

export const DashboardOverview = () => (
  <div className="flex flex-col gap-6 p-4 md:p-6 max-w-[1400px] mx-auto">

    {/* Row 1 — Welcome + quick actions */}
    <div className="flex flex-col gap-4">
      <WelcomeBanner />
      <QuickActions />
    </div>

    {/* Row 2 — Stats */}
    <StatsRow />

    {/* Row 3 — Bookings (full width) */}
    <BookingsTable />

    {/* Row 4 — Spending + Activity side by side */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <SpendingChart />
        <Recommendations />
      </div>
      <div className="flex flex-col gap-6">
        <CategorySplit />
        <ActivityFeed />
      </div>
    </div>

  </div>
);