import { X } from 'lucide-react'

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) {
  if (!isOpen) return null

  return (
    <div className="dialog-overlay backdrop-blur-md z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
      <div className={`bg-white border border-slate-100/80 rounded-[32px] shadow-2xl w-full ${maxWidth} overflow-hidden animate-slideUp`}>
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-slate-100 bg-slate-50/70">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight">{title}</h3>
          <button 
            type="button"
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer border-0"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
