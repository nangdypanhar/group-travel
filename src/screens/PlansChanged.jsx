import { ArrowRight, RefreshCw } from 'lucide-react'
import Avatar from '../components/Avatar'
import { Button, Card, Screen, ScreenTitle } from '../components/ui'
import { CHANGE_OPTIONS, RECALC_OPTION_ID, TRIP } from '../data/mockData'
import { usd } from '../lib/format'
import { useDemo } from '../state/useDemo'

const recalc = CHANGE_OPTIONS.find((o) => o.id === RECALC_OPTION_ID)

// Organizer: one member dropped. Show the automatic recalculation, not a cancellation.
export default function PlansChanged() {
  const { state, summary, go } = useDemo()
  const { dropped } = summary
  const { group } = state
  const diff = recalc.price - TRIP.price
  const remaining = recalc.price * summary.size - summary.paid * TRIP.price

  const rows = [
    ['Travelers', group.travelers, summary.size],
    ['Rooms', group.roomShort, recalc.rooms],
    ['Price / person', usd(TRIP.price), usd(recalc.price)],
  ]

  return (
    <Screen
      footer={
        <Button onClick={() => go('options')}>
          Keep the trip together <ArrowRight className="h-4 w-4" />
        </Button>
      }
    >
      <ScreenTitle
        eyebrow={
          <span className="inline-flex items-center gap-1 text-amber-600">
            <RefreshCw className="h-3.5 w-3.5" /> Plans changed
          </span>
        }
        title="One member is no longer participating."
        subtitle="The group trip isn't cancelled. Here's what changes."
      />

      <Card className="flex items-center gap-3 p-4">
        <Avatar member={dropped} />
        <div className="flex-1">
          <p className="font-semibold">{dropped.name} dropped from the group</p>
          <p className="text-xs text-muted">
            {state.change.reason === 'left' ? 'Chose to leave before booking' : 'Didn’t pay after reminders and an extension'}
          </p>
        </div>
      </Card>

      <Card className="p-0">
        <p className="px-5 pt-4 text-xs font-semibold uppercase tracking-wider text-brand-600">Automatically recalculated</p>
        <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 px-5 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
          <span />
          <span className="text-right">Before</span>
          <span className="text-right">Now</span>
        </div>
        <div className="divide-y divide-slate-100">
          {rows.map(([label, before, after]) => (
            <div key={label} className="grid grid-cols-[1fr_auto_auto] items-center gap-x-3 px-5 py-3 text-sm">
              <span className="text-muted">{label}</span>
              <span className="whitespace-nowrap text-right text-[11px] text-muted line-through decoration-slate-300">{before}</span>
              <span className="whitespace-nowrap text-right text-[13px] font-bold">{after}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between rounded-b-3xl bg-amber-50 px-5 py-4">
          <div>
            <p className="text-xs font-semibold text-amber-700">Additional cost</p>
            <p className="whitespace-nowrap text-2xl font-extrabold text-amber-800">
              +{usd(diff)}<span className="text-base"> / person</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-amber-700">Still to collect</p>
            <p className="font-bold text-amber-800">{usd(remaining)}</p>
          </div>
        </div>
      </Card>
    </Screen>
  )
}
