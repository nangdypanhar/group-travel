import { CheckCircle2 } from 'lucide-react'

// Progress through the current role's own steps, e.g. Join → Pay for a member.
// A `step` past the last one means the role has nothing left to do.
export default function StepIndicator({ steps, step, label }) {
  const done = step >= steps.length
  return (
    <div className="px-5 pb-3">
      <div className="flex gap-1.5">
        {steps.map((s, i) => (
          <div key={s} className="h-1 flex-1 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-500 ${done ? 'bg-emerald-500' : 'bg-brand-500'} ${i <= step ? 'w-full' : 'w-0'}`}
            />
          </div>
        ))}
      </div>
      {done ? (
        <p className="mt-2 flex items-center gap-1 text-[11px] font-medium text-muted">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" strokeWidth={2.5} />
          <span className="font-semibold text-emerald-600">All done</span> · {label}
        </p>
      ) : (
        <p className="mt-2 text-[11px] font-medium text-muted">
          <span className="font-semibold text-brand-600">
            Step {step + 1} of {steps.length}
          </span>{' '}
          · <span className="font-semibold text-ink">{steps[step]}</span> · {label}
        </p>
      )}
    </div>
  )
}
