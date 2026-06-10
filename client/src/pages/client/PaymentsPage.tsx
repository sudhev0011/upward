import { useState } from "react";
import {
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Wallet,
} from "lucide-react";
import { useGetWallet } from "@/hooks/booking/use-get-wallet";
import { WalletTransactionResponse } from "@/interfaces/bookings/bookings.interface";

const CARDS = [
  { id: "c1", last4: "4242", brand: "Visa", expiry: "04/27", primary: true },
  {
    id: "c2",
    last4: "1234",
    brand: "Mastercard",
    expiry: "11/26",
    primary: false,
  },
];

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-950/40",
  pending: "bg-amber-50   text-amber-600   border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-950/40",
  refund: "bg-blue-50    text-blue-600    border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-950/40",
  failed: "bg-red-50     text-red-500     border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-950/40",
};

const PaymentsPage = () => {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"wallet" | "methods">("wallet");

  const { data: walletData, isLoading } = useGetWallet();

  const transactions: WalletTransactionResponse[] = walletData?.transactions ?? [];

  const visibleTransactions = transactions.filter(
    (t) =>
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.type.toLowerCase().includes(search.toLowerCase())
  );

  const totalCredits = transactions
    .filter((t) => t.type === "credit")
    .reduce((s, t) => s + t.amount, 0);

  return (
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">
          Payments
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Billing history, virtual wallet, and payment methods.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          {
            label: "Wallet Balance",
            value: `₹${(walletData?.balance ?? 0).toLocaleString("en-IN")}`,
            sub: "Ready platform credits",
            color: "text-blue-600 dark:text-blue-400",
            icon: Wallet,
          },
          {
            label: "Total Refunded",
            value: `₹${totalCredits.toLocaleString("en-IN")}`,
            sub: "Credited back to wallet",
            color: "text-emerald-600 dark:text-emerald-400",
            icon: ArrowDownLeft,
          },
          {
            label: "Saved Methods",
            value: `${CARDS.length}`,
            sub: "Active cards linked",
            color: "text-slate-900 dark:text-zinc-50",
            icon: CreditCard,
          },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-2xl border border-slate-100 dark:border-zinc-800 bg-background p-5 shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  {s.label}
                </p>
                <p className={`text-2xl font-black tracking-tight ${s.color}`}>
                  {s.value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-zinc-800/40 rounded-xl text-muted-foreground border">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-zinc-800/40 rounded-xl p-1 w-fit border">
        {(["wallet", "methods"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-5 py-2 text-sm font-semibold capitalize transition-all ${
              tab === t
                ? "bg-background text-foreground shadow-sm border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "wallet" ? "Wallet Ledger" : "Payment Methods"}
          </button>
        ))}
      </div>

      {/* Transactions */}
      {tab === "wallet" && (
        <div className="rounded-2xl border border-slate-100 dark:border-zinc-800 bg-background shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40">
            <div className="relative flex-1 max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search transactions ledger…"
                className="h-9 w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-background pl-8 pr-3 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#719FC4] transition-all"
              />
            </div>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-zinc-800/40">
            {isLoading ? (
              <div className="p-8 text-center text-sm text-muted-foreground animate-pulse">
                Loading wallet transactions...
              </div>
            ) : !visibleTransactions.length ? (
              <div className="p-12 text-center text-sm text-muted-foreground">
                No ledger transactions recorded in your wallet.
              </div>
            ) : (
              visibleTransactions.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/40 dark:hover:bg-zinc-900/20 transition-colors"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                      t.type === "credit"
                        ? "bg-blue-50 text-blue-500 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-950/30"
                        : "bg-slate-100 text-slate-500 border-slate-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
                    }`}
                  >
                    {t.type === "credit" ? (
                      <ArrowDownLeft className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 dark:text-zinc-200 truncate">
                      {t.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t.bookingId ? `Booking: #${t.bookingId.substring(t.bookingId.length - 8).toUpperCase()}` : "Platform Wallet Credit"} · {new Date(t.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        t.type === "credit" ? STATUS_STYLES.refund : STATUS_STYLES.paid
                      }`}
                    >
                      {t.type === "credit" ? "Refund" : "Debit"}
                    </span>
                    <p
                      className={`text-sm font-black w-24 text-right ${
                        t.type === "credit" ? "text-blue-500" : "text-slate-900 dark:text-zinc-100"
                      }`}
                    >
                      {t.type === "credit" ? "+" : "-"} ₹
                      {t.amount.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Payment methods */}
      {tab === "methods" && (
        <div className="flex flex-col gap-4">
          {CARDS.map((c) => (
            <div
              key={c.id}
              className={`rounded-2xl border bg-background p-5 shadow-sm flex items-center justify-between ${
                c.primary ? "border-[#719FC4]/40 dark:border-[#719FC4]/20" : "border-slate-100 dark:border-zinc-800"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-16 items-center justify-center rounded-xl bg-slate-50 dark:bg-zinc-800/40 text-muted-foreground border">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-foreground">
                      {c.brand} •••• {c.last4}
                    </p>
                    {c.primary && (
                      <span className="rounded-full bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 text-[10px] font-bold dark:bg-blue-950/20 dark:text-blue-400">
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Expires {c.expiry}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {!c.primary && (
                  <button className="rounded-xl border border-slate-200 dark:border-zinc-800 px-4 py-2 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-zinc-900/40 transition-colors">
                    Set Primary
                  </button>
                )}
                <button className="rounded-xl border border-red-200 dark:border-red-950/40 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50/10 transition-colors">
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 dark:border-zinc-800 bg-background p-5 text-sm font-semibold text-muted-foreground hover:border-[#719FC4]/40 hover:text-[#719FC4] transition-all">
            <CreditCard className="h-4 w-4" /> Add New Card
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;
