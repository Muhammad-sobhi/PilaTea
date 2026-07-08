export default function DataTable({ columns, rows, emptyMessage, loading }) {
  if (loading) {
    return (
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--color-bg-alt)] border-b border-[var(--color-border)]">
                {columns.map(col => (
                  <th key={col.key} className="text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] px-6 py-3">{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map(i => (
                <tr key={i} className="border-b border-[var(--color-border)] last:border-0">
                  {columns.map(col => (
                    <td key={col.key} className="px-6 py-4"><div className="skeleton h-4 w-3/4" /></td>
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
      <div className="card p-12 text-center">
        <p className="text-[var(--color-text-muted)] text-sm">{emptyMessage || 'No records found.'}</p>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--color-bg-alt)] border-b border-[var(--color-border)]">
              {columns.map(col => (
                <th key={col.key} className="text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] px-6 py-3">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id || i} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg)] transition-colors duration-100">
                {columns.map(col => (
                  <td key={col.key} className="px-6 py-4 text-[var(--color-text)]">{col.render ? col.render(row) : row[col.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
