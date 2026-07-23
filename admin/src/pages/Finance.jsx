import { useState, useEffect } from 'react'
import { getFinanceSummary } from '../utils/api'
import { TrendingUp, TrendingDown, Calendar, ArrowUpRight, ArrowDownRight, PiggyBank, ChevronLeft, ChevronRight } from 'lucide-react'
import PageHeader from '../components/PageHeader'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function Finance() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState('all')

  useEffect(() => {
    setLoading(true)
    getFinanceSummary({ year: selectedYear }).then(r => setSummary(r.data || r)).catch(() => {}).finally(() => setLoading(false))
  }, [selectedYear])

  const fmt = (n) => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  if (loading) return <div className="animate-fadeIn"><PageHeader title="Finance" /></div>

  const income = Number(summary?.total_revenue || 0)
  const outcome = Number(summary?.total_expenses || 0)
  const net = Number(summary?.net_profit || 0)

  const monthlyData = summary?.monthly_breakdown || []
  const selectedData = selectedMonth === 'all' ? null : monthlyData.find(m => m.month === selectedMonth)

  const allMonthsMax = Math.max(...monthlyData.map(x => Math.max(x.revenue, x.expenses)), 1)

  const changeYear = (delta) => setSelectedYear(y => y + delta)

  return (
    <div className="animate-fadeIn space-y-6">
      <PageHeader title="Finance" description="Income, outcome, and overall financial health" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-2">
            <div className="rounded-xl p-3 bg-gradient-to-br from-[#ecfdf5] to-[#d1fae5]"><TrendingUp size={22} strokeWidth={1.5} className="text-green-600" /></div>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text)] tabular-nums">{fmt(income)}</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Total Income</p>
          <p className="text-xs text-green-600 mt-1">Revenue from bookings &amp; memberships</p>
        </div>

        <div className="card p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-2">
            <div className="rounded-xl p-3 bg-gradient-to-br from-[#fef2f2] to-[#fecaca]"><TrendingDown size={22} strokeWidth={1.5} className="text-red-600" /></div>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text)] tabular-nums">{fmt(outcome)}</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Total Outcome</p>
          <p className="text-xs text-red-600 mt-1">Material &amp; service expenses</p>
        </div>

        <div className="card p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-2">
            <div className={`rounded-xl p-3 bg-gradient-to-br ${net >= 0 ? 'from-[#e0f2fe] to-[#bae6fd]' : 'from-[#fef2f2] to-[#fecaca]'}`}>
              <PiggyBank size={22} strokeWidth={1.5} className={net >= 0 ? 'text-blue-600' : 'text-red-600'} />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text)] tabular-nums">{fmt(net)}</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Net Profit</p>
          <p className={`text-xs mt-1 ${net >= 0 ? 'text-green-600' : 'text-red-600'}`}>{net >= 0 ? 'Profitable' : 'Loss'}</p>
        </div>

        <div className="card p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-2">
            <div className="rounded-xl p-3 bg-gradient-to-br from-[#fefce8] to-[#fef08a]"><Calendar size={22} strokeWidth={1.5} className="text-yellow-600" /></div>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text)] tabular-nums">{fmt(summary?.today_revenue)}</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Today's Earnings</p>
          <p className="text-xs text-yellow-600 mt-1">Revenue generated today</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card p-6">
          <h2 className="text-base font-semibold tracking-tight mb-4 flex items-center gap-2"><ArrowUpRight size={18} className="text-green-600" /> Income Breakdown</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 border border-green-100">
              <div>
                <p className="text-sm font-medium text-green-800">Bookings</p>
                <p className="text-xs text-green-600">Event reservations &amp; class bookings</p>
              </div>
              <p className="text-lg font-bold text-green-700 tabular-nums">{fmt(summary?.total_booking_revenue)}</p>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-amber-50 border border-amber-100">
              <div>
                <p className="text-sm font-medium text-amber-800">Drinks</p>
                <p className="text-xs text-amber-600">On-site tea &amp; beverage sales</p>
              </div>
              <p className="text-lg font-bold text-amber-700 tabular-nums">{fmt(summary?.total_tea_revenue)}</p>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50 border border-blue-100">
              <div>
                <p className="text-sm font-medium text-blue-800">Memberships</p>
                <p className="text-xs text-blue-600">Membership plan payments</p>
              </div>
              <p className="text-lg font-bold text-blue-700 tabular-nums">{fmt(summary?.total_membership_revenue)}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-base font-semibold tracking-tight mb-4 flex items-center gap-2"><ArrowDownRight size={18} className="text-red-600" /> Expenses Breakdown</h2>
          <div className="space-y-4">
            {summary?.expenses_by_category && Object.entries(summary.expenses_by_category).map(([cat, amt]) => {
              const isMaterial = cat === 'material'
              return (
                <div key={cat} className={`flex items-center justify-between p-4 rounded-xl border ${isMaterial ? 'bg-amber-50 border-amber-100' : 'bg-purple-50 border-purple-100'}`}>
                  <div>
                    <p className={`text-sm font-medium ${isMaterial ? 'text-amber-800' : 'text-purple-800'}`}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</p>
                    <p className={`text-xs ${isMaterial ? 'text-amber-600' : 'text-purple-600'}`}>{isMaterial ? 'Equipment, supplies, physical items' : 'Staff, marketing, utilities'}</p>
                  </div>
                  <p className={`text-lg font-bold tabular-nums ${isMaterial ? 'text-amber-700' : 'text-purple-700'}`}>{fmt(amt)}</p>
                </div>
              )
            })}
            {(!summary?.expenses_by_category || Object.keys(summary.expenses_by_category).length === 0) && (
              <div className="text-center py-8">
                <p className="text-sm text-[var(--color-text-muted)]">No expenses recorded yet.</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">Add expenses to see them here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Breakdown Card */}
      <div className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-extrabold text-slate-800 tracking-tight">Monthly Breakdown</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Overview of monthly revenue vs expenses</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-100">
              <button onClick={() => changeYear(-1)} className="p-1.5 rounded-xl hover:bg-white text-slate-500 transition-colors cursor-pointer border-0"><ChevronLeft size={16} /></button>
              <span className="text-xs font-bold px-3 text-slate-700">{selectedYear}</span>
              <button onClick={() => changeYear(1)} className="p-1.5 rounded-xl hover:bg-white text-slate-500 transition-colors cursor-pointer border-0"><ChevronRight size={16} /></button>
            </div>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="text-xs font-semibold !w-36 !py-2 border-slate-200"
            >
              <option value="all">All Months</option>
              {MONTHS.map((name, i) => {
                const m = `${selectedYear}-${String(i + 1).padStart(2, '0')}`
                return <option key={m} value={m}>{name}</option>
              })}
            </select>
          </div>
        </div>

        {selectedMonth === 'all' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {monthlyData.map((m) => {
              const monthLabel = new Date(m.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
              const revWidth = allMonthsMax > 0 ? (m.revenue / allMonthsMax) * 100 : 0
              const expWidth = allMonthsMax > 0 ? (m.expenses / allMonthsMax) * 100 : 0

              return (
                <div key={m.month} className="bg-slate-50/60 hover:bg-slate-100/60 p-4 rounded-2xl border border-slate-100/80 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-slate-800">{monthLabel}</span>
                    <span className={`text-xs font-bold tabular-nums px-2 py-0.5 rounded-lg ${m.net >= 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                      {m.net >= 0 ? '+' : ''}{fmt(m.net)}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {/* Income Bar */}
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="w-12 text-slate-500 font-semibold">Income</span>
                      <div className="flex-1 bg-slate-200/50 rounded-full h-2 overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${Math.max(revWidth, m.revenue > 0 ? 3 : 0)}%` }} />
                      </div>
                      <span className="w-16 text-right font-bold text-slate-700 tabular-nums">{fmt(m.revenue)}</span>
                    </div>

                    {/* Outcome Bar */}
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="w-12 text-slate-500 font-semibold">Outcome</span>
                      <div className="flex-1 bg-slate-200/50 rounded-full h-2 overflow-hidden">
                        <div className="bg-rose-500 h-full rounded-full transition-all duration-300" style={{ width: `${Math.max(expWidth, m.expenses > 0 ? 3 : 0)}%` }} />
                      </div>
                      <span className="w-16 text-right font-bold text-slate-700 tabular-nums">{fmt(m.expenses)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
            {monthlyData.length === 0 && (
              <div className="col-span-2 text-center py-8 text-xs text-slate-400 font-medium">
                No data for {selectedYear}
              </div>
            )}
          </div>
        ) : selectedData ? (
          <div className="bg-slate-50/70 rounded-2xl p-6 border border-slate-100 max-w-xl mx-auto">
            <div className="text-center mb-5">
              <h3 className="text-sm font-extrabold text-slate-800">{new Date(selectedData.month + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="rounded-xl bg-white border border-slate-100 p-3 text-center shadow-2xs">
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Income</p>
                <p className="text-base font-extrabold text-slate-800 tabular-nums mt-0.5">{fmt(selectedData.revenue)}</p>
              </div>
              <div className="rounded-xl bg-white border border-slate-100 p-3 text-center shadow-2xs">
                <p className="text-[10px] text-rose-600 font-bold uppercase tracking-wider">Outcome</p>
                <p className="text-base font-extrabold text-slate-800 tabular-nums mt-0.5">{fmt(selectedData.expenses)}</p>
              </div>
              <div className={`rounded-xl p-3 text-center border bg-white shadow-2xs`}>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${selectedData.net >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>Net</p>
                <p className={`text-base font-extrabold tabular-nums mt-0.5 ${selectedData.net >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {selectedData.net >= 0 ? '+' : ''}{fmt(selectedData.net)}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-600">Income</span>
                  <span className="text-emerald-600 tabular-nums">{fmt(selectedData.revenue)}</span>
                </div>
                <div className="bg-slate-200/60 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${(selectedData.revenue / Math.max(selectedData.revenue, selectedData.expenses, 1)) * 100}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-600">Outcome</span>
                  <span className="text-rose-600 tabular-nums">{fmt(selectedData.expenses)}</span>
                </div>
                <div className="bg-slate-200/60 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full transition-all" style={{ width: `${(selectedData.expenses / Math.max(selectedData.revenue, selectedData.expenses, 1)) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 font-medium text-center py-6">No data for this month</p>
        )}
      </div>


      <div className="card p-6">
        <h2 className="text-base font-semibold tracking-tight mb-4">Recent Transactions</h2>
        {(!summary?.recent_transactions || summary.recent_transactions.length === 0) ? (
          <p className="text-sm text-[var(--color-text-muted)]">No transactions yet.</p>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {summary.recent_transactions.map((t, i) => (
              <div key={i} className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${t.type === 'revenue' ? 'bg-green-400' : 'bg-red-400'}`} />
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text)]">{t.description}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold tabular-nums ${t.type === 'revenue' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'revenue' ? '+' : '-'}{fmt(t.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}