import { useState } from "react";
import { CreditCard, Download, ArrowUpRight, ArrowDownLeft, Search } from "lucide-react";

const TRANSACTIONS = [
  { id: "tx1", title: "Home Deep Cleaning",    provider: "CleanPro",    amount: -180,  date: "Mar 9, 2026",  status: "paid",    type: "debit"  },
  { id: "tx2", title: "React Dashboard Dev",   provider: "CodeCraft",   amount: -640,  date: "Mar 8, 2026",  status: "paid",    type: "debit"  },
  { id: "tx3", title: "Refund – Cancelled Job",provider: "PipeWorks",   amount: +60,   date: "Mar 5, 2026",  status: "refund",  type: "credit" },
  { id: "tx4", title: "Logo & Brand Design",   provider: "PixelStudio", amount: -420,  date: "Feb 28, 2026", status: "paid",    type: "debit"  },
  { id: "tx5", title: "Electrical Inspection", provider: "VoltCheck",   amount: -95,   date: "Feb 20, 2026", status: "paid",    type: "debit"  },
  { id: "tx6", title: "Full-Stack Team – Feb", provider: "DevSquad",    amount: -4200, date: "Feb 1, 2026",  status: "paid",    type: "debit"  },
  { id: "tx7", title: "SEO Consulting",        provider: "RankLab",     amount: -270,  date: "Jan 15, 2026", status: "paid",    type: "debit"  },
  { id: "tx8", title: "AC Maintenance",        provider: "CoolFix",     amount: -70,   date: "Jan 10, 2026", status: "paid",    type: "debit"  },
];

const CARDS = [
  { id: "c1", last4: "4242", brand: "Visa",       expiry: "04/27", primary: true  },
  { id: "c2", last4: "1234", brand: "Mastercard", expiry: "11/26", primary: false },
];

const STATUS_STYLES: Record<string, string> = {
  paid:    "bg-emerald-50 text-emerald-600 border-emerald-200",
  pending: "bg-amber-50   text-amber-600   border-amber-200",
  refund:  "bg-blue-50    text-blue-600    border-blue-200",
  failed:  "bg-red-50     text-red-500     border-red-200",
};

const PaymentsPage = () => {
  const [search, setSearch] = useState("");
  const [tab, setTab]       = useState<"transactions" | "methods">("transactions");

  const visible = TRANSACTIONS.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.provider.toLowerCase().includes(search.toLowerCase())
  );

  const totalSpent  = TRANSACTIONS.filter((t) => t.type === "debit").reduce((s, t) => s + Math.abs(t.amount), 0);
  const totalRefund = TRANSACTIONS.filter((t) => t.type === "credit").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Payments</h1>
        <p className="text-sm text-gray-400 mt-0.5">Billing history and payment methods</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Spent",    value: `$${totalSpent.toLocaleString()}`,  sub: "All time",      color: "text-gray-900"   },
          { label: "Refunds",        value: `+$${totalRefund}`,                  sub: "All time",      color: "text-blue-500"   },
          { label: "Saved Methods",  value: `${CARDS.length}`,                   sub: "Active cards",  color: "text-gray-900"   },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400 mb-1">{s.label}</p>
            <p className={`text-2xl font-extrabold tracking-tight ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-gray-100 rounded-xl p-1 w-fit">
        {(["transactions", "methods"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-5 py-2 text-sm font-semibold capitalize transition-all ${
              tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Transactions */}
      {tab === "transactions" && (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
            <div className="relative flex-1 max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search transactions…"
                className="h-8 w-full rounded-lg border border-gray-200 bg-gray-50 pl-8 pr-3 text-xs placeholder:text-gray-400 focus:border-[#719FC4] focus:outline-none transition-all"
              />
            </div>
            <button className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-[#719FC4] hover:text-[#5585A8] transition-colors">
              <Download className="h-3.5 w-3.5" /> Export CSV
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {visible.map((t) => (
              <div key={t.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/60 transition-colors">
                <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${t.type === "credit" ? "bg-blue-50 text-blue-500" : "bg-gray-100 text-gray-500"}`}>
                  {t.type === "credit" ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{t.title}</p>
                  <p className="text-xs text-gray-400">{t.provider} · {t.date}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[t.status]}`}>{t.status}</span>
                  <p className={`text-sm font-extrabold w-20 text-right ${t.type === "credit" ? "text-blue-500" : "text-gray-900"}`}>
                    {t.type === "credit" ? "+" : ""}${Math.abs(t.amount).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment methods */}
      {tab === "methods" && (
        <div className="flex flex-col gap-4">
          {CARDS.map((c) => (
            <div key={c.id} className={`rounded-2xl border bg-white p-5 shadow-sm flex items-center gap-4 ${c.primary ? "border-[#719FC4]/40" : "border-gray-100"}`}>
              <div className="flex h-11 w-16 items-center justify-center rounded-xl bg-[#EAF2F9] text-[#719FC4]">
                <CreditCard className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-gray-900">{c.brand} •••• {c.last4}</p>
                  {c.primary && <span className="rounded-full bg-[#EAF2F9] px-2 py-0.5 text-[10px] font-bold text-[#5585A8]">Primary</span>}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">Expires {c.expiry}</p>
              </div>
              <div className="flex gap-2">
                {!c.primary && (
                  <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors">Set Primary</button>
                )}
                <button className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-50 transition-colors">Remove</button>
              </div>
            </div>
          ))}
          <button className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 bg-white p-5 text-sm font-semibold text-gray-400 hover:border-[#719FC4]/40 hover:text-[#719FC4] transition-all">
            <CreditCard className="h-4 w-4" /> Add New Card
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;