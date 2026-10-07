import { CheckCircle2, Plane, RotateCcw } from 'lucide-react'
import Avatar from '../components/Avatar'
import { Line } from '../components/PaymentCard'
import { Button, Card, Screen } from '../components/ui'
import { TRIP } from '../data/mockData'
import { usd } from '../lib/format'
import { useDemo } from '../state/useDemo'

// Organizer: the booking went through for the whole group.
export default function Confirmed() {
  const { summary, dispatch } = useDemo()
  const { flight } = TRIP
  return (
    <Screen
      footer={
        <Button variant="secondary" onClick={() => dispatch({ type: 'RESET' })}>
          <RotateCcw className="h-4 w-4" /> Restart demo
        </Button>
      }
    >
      <div className="flex flex-col items-center pt-4 text-center">
        <CheckCircle2 className="h-16 w-16 animate-pop text-brand-500" strokeWidth={1.75} />
        <h1 className="mt-4 text-[28px] font-bold tracking-tight">Group Trip Confirmed</h1>
        <p className="mt-1 text-[15px] text-muted">
          {TRIP.from.city} → {TRIP.to.city} · {TRIP.dates}
        </p>
      </div>

      <Confirmation Icon={Plane} title="Flight confirmed" code="PNR · K7Q2MX">
        <Line label={`Out · ${TRIP.dates.split(' – ')[0]}`} value={`${TRIP.from.code} ${flight.depart} → ${TRIP.to.code} ${flight.arrive}`} />
        <Line label={`Back · ${flight.returnDate}`} value={`${TRIP.to.code} ${flight.returnDepart} → ${TRIP.from.code}`} />
      </Confirmation>

      <Card className="p-2">
        <div className="flex items-baseline justify-between px-3 pb-1 pt-2">
          <p className="font-semibold">Travellers &amp; tickets</p>
          <p className="text-xs text-muted">
            {summary.size} × {usd(summary.share)} = <span className="font-semibold text-ink">{usd(summary.total)}</span>
          </p>
        </div>
        {summary.active.map((m, i) => (
          <div key={m.id} className="flex items-center gap-3 rounded-2xl px-3 py-2">
            <Avatar member={m} size="sm" done />
            <p className="flex-1 text-sm font-semibold">{m.name}</p>
            <span className="font-mono text-xs text-muted">E-ticket 618-{2604810 + i * 37}</span>
          </div>
        ))}
      </Card>
    </Screen>
  )
}

function Confirmation({ Icon, title, code, children }) {
  return (
    <Card className="space-y-2 text-sm">
      <div className="flex items-center gap-3 pb-1">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
          <Icon className="h-4 w-4" />
        </div>
        <p className="flex-1 font-semibold">{title}</p>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-muted">{code}</span>
      </div>
      {children}
    </Card>
  )
}
