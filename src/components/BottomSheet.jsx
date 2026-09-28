import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

// Bottom sheet, portaled into the phone frame so it always sits at the bottom
// of the visible screen (not the bottom of the scrolled content).
export default function BottomSheet({ title, subtitle, icon, onClose, tall = false, children }) {
  const frame = document.getElementById('phone-frame')
  const sheet = (
    <div className="absolute inset-0 z-30 flex items-end bg-ink/40 backdrop-blur-[2px]" onClick={onClose}>
      <div
        className={`flex w-full animate-sheet flex-col rounded-t-[2rem] bg-white px-5 pb-7 pt-3 ${tall ? 'min-h-[65%]' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-slate-200" />
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon}
            <div>
              <p className="font-semibold">{title}</p>
              {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
            </div>
          </div>
          <button type="button" onClick={onClose} className="grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
  return frame ? createPortal(sheet, frame) : sheet
}
