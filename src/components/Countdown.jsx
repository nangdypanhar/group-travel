import { AlarmClock, CheckCircle2 } from 'lucide-react'
import { useNow } from '../lib/useNow'
import { HOUR } from '../state/demoState'

const pad = (n) => String(n).padStart(2, '0')

export default function Countdown({ deadline }) {
  const now = useNow()
  const total = Math.max(0, Math.floor((deadline - now) / 1000))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return (
    <span className="tabular-nums">
      {h}h {pad(m)}m <span className="text-[0.7em] opacity-70">{pad(s)}s</span>
    </span>
  )
}

// Calm while there's time, amber in the last 6 hours, rose in the last hour.
const TONES = {
  calm: { light: 'bg-white text-ink ring-slate-200', dark: 'bg-white/10 text-white ring-white/15', dot: 'bg-brand-500' },
  soon: { light: 'bg-amber-50 text-amber-800 ring-amber-200', dark: 'bg-amber-400/15 text-amber-100 ring-amber-300/30', dot: 'bg-amber-500' },
  urgent: { light: 'bg-rose-50 text-rose-700 ring-rose-200', dark: 'bg-rose-500/20 text-rose-100 ring-rose-400/40', dot: 'bg-rose-500' },
}

// The group payment deadline, shown the same way on every payment screen.
export function DeadlineCard({ deadline, label = 'Payment deadline', note, dark = false, done = false }) {
  const now = useNow()
  const left = deadline - now
  if (done) {
    return (
      <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 ring-1 ${dark ? 'bg-emerald-400/15 text-emerald-200 ring-emerald-400/30' : 'bg-emerald-50 text-emerald-700 ring-emerald-100'}`}>
        <CheckCircle2 className="h-5 w-5 shrink-0" />
        <p className="text-sm font-semibold">Everyone paid before the deadline</p>
      </div>
    )
  }
  const passed = left <= 0
  const tone = TONES[passed || left <= HOUR ? 'urgent' : left <= 6 * HOUR ? 'soon' : 'calm']
  return (
    <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 ring-1 transition-colors duration-500 ${dark ? tone.dark : tone.light}`}>
      {passed ? (
        <AlarmClock className="h-5 w-5 shrink-0" />
      ) : (
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${tone.dot}`} />
          <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${tone.dot}`} />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider opacity-70">{label}</p>
        {note && <p className="truncate text-xs font-medium opacity-80">{note}</p>}
      </div>
      <div className="shrink-0 text-right">
        <p className="text-xl font-extrabold leading-tight">{passed ? 'Passed' : <Countdown deadline={deadline} />}</p>
        <p className="text-[11px] font-medium opacity-70">{passed ? 'Deadline reached' : 'remaining'}</p>
      </div>
    </div>
  )
}
