import { ArrowRight, BedDouble, Check, Hotel, UserPlus, Users } from 'lucide-react'
import { Button, Screen, ScreenTitle } from '../components/ui'
import { CHANGE_OPTIONS, TRIP } from '../data/mockData'
import { usd } from '../lib/format'
import { useDemo } from '../state/useDemo'

const ICONS = { replace: UserPlus, repair: BedDouble, share: Users, cheaper: Hotel }

// Organizer: four ways to continue instead of cancelling the whole trip.
export default function KeepTogether() {
  const { state, dispatch, go } = useDemo()
  const { change } = state
  // Once sent to the group, the choice is locked.
  const locked = change.status !== 'choosing'
  const chosen = CHANGE_OPTIONS.find((o) => o.id === change.optionId)

  return (
    <Screen
      footer={
        <Button onClick={() => go('arrangement')} disabled={!chosen}>
          {chosen ? `Continue with “${chosen.title}”` : 'Choose an option'} <ArrowRight className="h-4 w-4" />
        </Button>
      }
    >
      <ScreenTitle
        eyebrow="Handle changes"
        title="Keep the trip together"
        subtitle="Choose a way to continue without cancelling the entire group trip."
      />

      <div className="space-y-3">
        {CHANGE_OPTIONS.map((o) => {
          const Icon = ICONS[o.id]
          const selected = o.id === change.optionId
          const diff = o.price - TRIP.price
          return (
            <button
              key={o.id}
              type="button"
              disabled={locked}
              onClick={() => dispatch({ type: 'CHOOSE_OPTION', optionId: o.id })}
              className={`w-full rounded-3xl border-2 bg-white p-4 text-left shadow-card transition ${
                selected ? 'border-brand-500' : 'border-transparent'
              } ${locked ? 'cursor-default' : 'cursor-pointer hover:border-brand-200'} ${locked && !selected ? 'opacity-50' : ''}`}
            >
              <div className="flex gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{o.title}</p>
                      <p className="font-bold leading-snug">{o.headline}</p>
                    </div>
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition ${
                        selected ? 'border-brand-500 bg-brand-500' : 'border-slate-200'
                      }`}
                    >
                      {selected && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted">{o.effect}</p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px] font-semibold">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-muted">{o.travelers} travelers</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-muted">{usd(o.price)}/person</span>
                    <span
                      className={`rounded-full px-2 py-0.5 ${diff > 0 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}
                    >
                      {diff > 0 ? `+${usd(diff)} / person` : 'No extra cost'}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </Screen>
  )
}
