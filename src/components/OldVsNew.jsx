import { Check, X } from 'lucide-react'

// Side-by-side "old way vs Group Trip" comparison used in the pitch story.
export default function OldVsNew({ title, rows }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-card">
      {title && <p className="px-5 pt-4 text-sm font-semibold">{title}</p>}
      <div className="grid grid-cols-2 gap-px px-5 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-wider">
        <span className="text-muted">Old way</span>
        <span className="text-brand-600">Group Trip</span>
      </div>
      <div className="divide-y divide-slate-100">
        {rows.map((row) => (
          <div key={row.old} className="grid grid-cols-2 gap-3 px-5 py-3 text-[13px] leading-snug">
            <span className="flex gap-1.5 text-muted">
              <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-400" strokeWidth={3} />
              {row.old}
            </span>
            <span className="flex gap-1.5 font-medium">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" strokeWidth={3} />
              {row.new}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
