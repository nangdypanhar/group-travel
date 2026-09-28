import { AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react'
import { LATE_PAYER_ID } from '../data/mockData'
import { PHASES, SCREENS } from '../state/demoState'
import { useDemo } from '../state/useDemo'

// Desktop-only side panel so the presenter can jump between steps or reset.
export default function PresenterPanel() {
  const { state, summary, go, dispatch } = useDemo()
  const late = state.members.find((m) => m.id === LATE_PAYER_ID)
  // The missed-payment case: dashboard with the late payer's sheet open, or the vote that follows.
  const inUnpaidCase = Boolean(state.inspectingId) || ['keepVote', 'deadline'].includes(state.screen)
  return (
    <aside className="hidden w-64 shrink-0 lg:block xl:w-72">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">Trip.com pitch</p>
      <h2 className="mt-1 text-2xl font-bold leading-tight">Group Trip</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        One group booking, without one person carrying the whole trip.
      </p>

      <nav className="mt-6 space-y-3">
        {PHASES.map((phase, phaseIndex) => (
          <div key={phase}>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted">{phase}</p>
            {SCREENS.filter((s) => s.phase === phaseIndex && s.nav !== false).map((s) => {
              const active = s.id === state.screen
              const locked = (s.id === 'ready' && !summary.isReady) || (s.id === 'confirmed' && !state.booked)
              return (
                <button
                  key={s.id}
                  type="button"
                  disabled={locked}
                  onClick={() => go(s.id)}
                  className={`flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-1.5 text-left text-sm transition disabled:cursor-not-allowed disabled:opacity-35 ${
                    active && !inUnpaidCase
                      ? 'bg-brand-500 font-semibold text-white shadow-lg shadow-brand-500/25'
                      : 'text-muted hover:bg-white hover:text-ink'
                  }`}
                >
                  <ArrowRight
                    className={`h-4 w-4 shrink-0 transition ${active && !inUnpaidCase ? 'opacity-100' : '-ml-6 opacity-0'}`}
                  />
                  {s.label}
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      <p className="mb-1 mt-5 text-[11px] font-semibold uppercase tracking-wider text-muted">What if</p>
      <button
        type="button"
        onClick={() => dispatch({ type: 'JUMP_TO_UNPAID', deadline: Date.now() - 1000 })}
        className={`flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold transition ${
          inUnpaidCase
            ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25'
            : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
        }`}
      >
        {inUnpaidCase ? <ArrowRight className="h-4 w-4 shrink-0" /> : <AlertTriangle className="h-4 w-4 shrink-0" />}
        {late.name} misses the deadline
      </button>

      <button
        type="button"
        onClick={() => dispatch({ type: 'RESET' })}
        className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted transition hover:bg-white hover:text-ink"
      >
        <RotateCcw className="h-4 w-4" /> Reset demo
      </button>
    </aside>
  )
}
