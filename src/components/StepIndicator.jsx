import { PHASES } from '../state/demoState'

export default function StepIndicator({ phase, label }) {
  return (
    <div className="px-5 pb-3">
      <div className="flex gap-1.5">
        {PHASES.map((p, i) => (
          <div key={p} className="h-1 flex-1 overflow-hidden rounded-full bg-slate-100">
            <div className={`h-full rounded-full bg-brand-500 transition-all duration-500 ${i <= phase ? 'w-full' : 'w-0'}`} />
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] font-medium text-muted">
        <span className="font-semibold text-brand-600">Step {phase + 1}</span> ·{' '}
        <span className="font-semibold text-ink">{PHASES[phase]}</span> · {label}
      </p>
    </div>
  )
}
