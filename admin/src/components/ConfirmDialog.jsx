import { useState } from 'react'

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmLabel }) {
  if (!open) return null
  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full mx-4 border border-[var(--color-border)]" onClick={e => e.stopPropagation()}>
        <h3 className="text-base font-semibold text-[var(--color-text)] mb-2">{title || 'Confirm'}</h3>
        <p className="text-sm text-[var(--color-text-secondary)] mb-6 leading-relaxed">{message}</p>
        <div className="flex items-center justify-end gap-3">
          <button className="btn-secondary text-sm" onClick={onCancel}>Cancel</button>
          <button className="btn-primary text-sm" onClick={onConfirm}>{confirmLabel || 'Confirm'}</button>
        </div>
      </div>
    </div>
  )
}

export function useConfirm() {
  const [state, setState] = useState({ open: false, title: '', message: '', resolve: null, confirmLabel: '' })

  const confirm = (message, opts = {}) => new Promise(resolve => {
    setState({ open: true, title: opts.title || 'Confirm', message, confirmLabel: opts.confirmLabel || 'Confirm', resolve })
  })

  const dialog = (
    <ConfirmDialog
      open={state.open}
      title={state.title}
      message={state.message}
      confirmLabel={state.confirmLabel}
      onConfirm={() => { const r = state.resolve; setState(s => ({ ...s, open: false })); r?.(true) }}
      onCancel={() => { const r = state.resolve; setState(s => ({ ...s, open: false })); r?.(false) }}
    />
  )

  return { confirm, dialog }
}
