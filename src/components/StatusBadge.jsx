import { AlarmClock, BellRing, CheckCircle2, Clock, FileCheck2, FileClock, Hourglass, Mail, UserMinus } from 'lucide-react'

const TONES = {
  done: { className: 'bg-emerald-50 text-emerald-700', Icon: CheckCircle2 },
  pending: { className: 'bg-amber-50 text-amber-700', Icon: Clock },
  invited: { className: 'bg-slate-100 text-muted', Icon: Mail },
  removed: { className: 'bg-rose-50 text-rose-600', Icon: UserMinus },
  due: { className: 'bg-rose-50 text-rose-600', Icon: AlarmClock },
  reminded: { className: 'bg-brand-50 text-brand-700', Icon: BellRing },
  extended: { className: 'bg-amber-50 text-amber-700', Icon: Hourglass },
  infoDone: { className: 'bg-brand-50 text-brand-700', Icon: FileCheck2 },
  infoMissing: { className: 'bg-slate-100 text-muted', Icon: FileClock },
}

export default function StatusBadge({ tone = 'pending', children }) {
  const { className, Icon } = TONES[tone]
  return (
    <span className={`inline-flex animate-pop items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${className}`}>
      <Icon className="h-3 w-3" strokeWidth={2.5} />
      {children}
    </span>
  )
}
