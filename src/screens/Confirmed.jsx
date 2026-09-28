import { CheckCircle2, RotateCcw } from 'lucide-react'
import OldVsNew from '../components/OldVsNew'
import TripCard from '../components/TripCard'
import { Button, Screen } from '../components/ui'
import { TRIP } from '../data/mockData'
import { usd } from '../lib/format'
import { useDemo } from '../state/useDemo'

export default function Confirmed() {
  const { state, summary, dispatch } = useDemo()
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
        <h1 className="mt-4 text-[28px] font-bold tracking-tight">Booking confirmed</h1>
        <p className="mt-1 text-[15px] text-muted">
          {state.group.name} · {summary.size} travelers
        </p>
        <span className="mt-3 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold tracking-wide text-muted">
          Ref · TG-{TRIP.to.code}-2618
        </span>
      </div>

      <TripCard stay={summary.stay} />

      <OldVsNew
        title="Nobody carried the whole trip."
        rows={[
          { old: `${summary.organizer.name} pays ${usd(summary.total)}`, new: `${summary.organizer.name} paid ${usd(summary.share)}` },
          { old: `${summary.organizer.name} collects info`, new: 'Everyone added their own' },
          { old: 'Chasing in chat', new: 'Auto-reminders' },
        ]}
      />
    </Screen>
  )
}
