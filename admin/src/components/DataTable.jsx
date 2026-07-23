import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function DataTable({ columns, rows, emptyMessage, loading, pageSize = 8 }) {
  const [currentPage, setCurrentPage] = useState(1)

  if (loading) {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-y-2">
            <thead>
              <tr>
                {columns.map(col => (
                  <th key={col.key} className="text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 px-5 py-2">{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map(i => (
                <tr key={i} className="bg-slate-50/60 rounded-2xl">
                  {columns.map(col => (
                    <td key={col.key} className="px-5 py-4 first:rounded-l-2xl last:rounded-r-2xl">
                      <div className="skeleton h-4 w-3/4 rounded-lg bg-slate-200/60 animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
        <p className="text-slate-400 text-sm font-semibold">{emptyMessage || 'No records found.'}</p>
      </div>
    )
  }

  // Pagination calculation
  const totalRows = rows.length
  const totalPages = Math.ceil(totalRows / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalRows)
  const paginatedRows = rows.slice(startIndex, endIndex)

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-separate border-spacing-y-2.5">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key} className="text-left text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-5 pb-1">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.map((row, i) => (
              <tr key={row.id || i} className="bg-slate-50/70 hover:bg-slate-100/70 transition-all duration-200 group rounded-2xl">
                {columns.map(col => (
                  <td key={col.key} className="px-5 py-3.5 text-slate-700 font-semibold text-xs first:rounded-l-2xl last:rounded-r-2xl border-y border-slate-100/80 first:border-l last:border-r">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-5 mt-2 border-t border-slate-100 px-2 bg-white">
          <div className="text-xs text-slate-400 font-medium">
            Showing <span className="font-bold text-slate-700">{startIndex + 1}</span> to <span className="font-bold text-slate-700">{endIndex}</span> of <span className="font-bold text-slate-700">{totalRows}</span> entries
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(page => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-8 h-8 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  currentPage === page
                    ? 'bg-gradient-to-r from-[#00d2ff] to-[#0082ff] text-white shadow-md shadow-cyan-500/20'
                    : 'text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

