/**
 * @file PageHeader.jsx
 * @description Standardized page title header layout component with optional subtitle description and action buttons.
 */

/**
 * PageHeader Component
 * @param {Object} props
 * @param {string} props.title - Main section heading text
 * @param {string} [props.description] - Subheading description text
 * @param {React.ReactNode} [props.actions] - Right-aligned call-to-action buttons
 */
export default function PageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5">
      <div>
        <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-800">{title}</h1>
        {description && <p className="text-[11px] font-semibold text-slate-400 mt-0.5">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  )
}
