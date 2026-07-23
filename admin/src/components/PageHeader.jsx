export default function PageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-800">{title}</h1>
        {description && <p className="text-xs font-semibold text-slate-400 mt-0.5">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  )
}

