import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function DataTable({ columns, rows, emptyMessage, loading, pageSize = 8 }) {
  const [currentPage, setCurrentPage] = useState(1)

  if (loading) {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100">
                {columns.map(col => (
                  <th key={col.key} className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 px-6 py-4">{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map(i => (
                <tr key={i} className="border-b border-slate-100/60 last:border-0">
                  {columns.map(col => (
                    <td key={col.key} className="px-6 py-4"><div className="skeleton h-4 w-3/4 rounded bg-slate-100 animate-pulse" /></td>
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
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-12 text-center">
        <p className="text-slate-400 text-sm font-medium">{emptyMessage || 'No records found.'}</p>
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
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100">
              {columns.map(col => (
                <th key={col.key} className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 px-6 py-4">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedRows.map((row, i) => (
              <tr key={row.id || i} className="hover:bg-slate-50/40 transition-colors duration-150 group">
                {columns.map(col => (
                  <td key={col.key} className="px-6 py-4 text-slate-700 font-medium group-hover:text-slate-900">{col.render ? col.render(row) : row[col.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 bg-white">
          <div className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-700">{startIndex + 1}</span> to <span className="font-semibold text-slate-700">{endIndex}</span> of <span className="font-semibold text-slate-700">{totalRows}</span> entries
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-100 text-slate-500 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(page => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-7.5 h-7.5 text-xs font-semibold rounded-lg transition-all ${
                  currentPage === page
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 border border-slate-100 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-100 text-slate-500 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
