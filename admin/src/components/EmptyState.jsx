export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 card">
      {Icon && <div className="mb-4 text-[var(--color-text-muted)]"><Icon size={48} strokeWidth={1.5} /></div>}
      <h3 className="text-base font-semibold text-[var(--color-text)] mb-1">{title}</h3>
      {description && <p className="text-sm text-[var(--color-text-muted)] mb-6 text-center max-w-sm leading-relaxed">{description}</p>}
      {action}
    </div>
  )
}
