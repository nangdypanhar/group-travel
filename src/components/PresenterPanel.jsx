import { ArrowRight, RotateCcw } from 'lucide-react'
import { isLocked, PHASES, ROLES, SCREENS } from '../state/demoState'
import { useDemo } from '../state/useDemo'
// import ScenarioSwitch from './ScenarioSwitch'

// Every screen in journey order, tagged with its role.
const JOURNEY = PHASES.map((phase, i) => ({
  phase,
  screens: Object.entries(SCREENS).flatMap(([role, list]) =>
    list.filter((s) => s.phase === i).map((s) => ({ ...s, role })),
  ),
}))

// Desktop-only side panel so the presenter can jump between steps or reset.
export default function PresenterPanel() {
  return (
    <aside className="hidden w-64 shrink-0 lg:block xl:w-72">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">Trip.com pitch</p>
      <h2 className="mt-1 text-2xl font-bold leading-tight">Group Trip</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">Keep the group trip together when plans change.</p>
      <DemoNav />
    </aside>
  )
}

// Role switch, every step of the journey, and demo shortcuts.
// Used in the desktop side panel and in the phone's demo menu (`onDone` closes it).
export function DemoNav({ onDone = () => {} }) {
  const { state, summary, go, dispatch } = useDemo()
  const run = (fn) => () => {
    fn()
    onDone()
  }
  // const dropOut = () => {
  //   dispatch({ type: 'JUMP_TO_CHANGE', now: Date.now() })
  //   onDone()
  // }
  return (
    <div>
      {/* Hidden for now: the demo only shows the "everyone pays" flow.
      <div className="mt-5">
        <ScenarioSwitch onDone={onDone} />
      </div>
      */}
      <p className="mb-1 mt-4 text-[11px] font-semibold uppercase tracking-wider text-muted">Viewing as</p>
      <div className="grid grid-cols-2 gap-1 rounded-2xl bg-white/70 p-1 ring-1 ring-slate-100">
        {Object.entries(ROLES).map(([id, r]) => (
          <button
            key={id}
            type="button"
            onClick={run(() => dispatch({ type: 'SET_ROLE', role: id }))}
            className={`cursor-pointer rounded-xl py-1.5 text-sm font-semibold transition ${
              state.role === id ? 'bg-ink text-white' : 'text-muted hover:text-ink'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <nav className="mt-5 space-y-3">
        {JOURNEY.map(({ phase, screens }, i) => (
          <div key={phase}>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted">
              {i + 1}. {phase}
            </p>
            {screens.map((s) => {
              const active = state.role === s.role && state.screens[s.role] === s.id
              return (
                <button
                  key={`${s.role}-${s.id}`}
                  type="button"
                  disabled={isLocked(state, summary, s.role, s.id)}
                  onClick={run(() => go(s.id, s.role))}
                  className={`flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-1.5 text-left text-sm transition disabled:cursor-not-allowed disabled:opacity-35 ${
                    active ? 'bg-brand-500 font-semibold text-white shadow-lg shadow-brand-500/25' : 'text-muted hover:bg-white hover:text-ink'
                  }`}
                >
                  <ArrowRight className={`h-4 w-4 shrink-0 transition ${active ? 'opacity-100' : '-ml-6 opacity-0'}`} />
                  <span className="flex-1 truncate">{s.label}</span>
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                      active ? 'bg-white/20 text-white' : s.role === 'member' ? 'bg-amber-100 text-amber-800' : 'bg-brand-50 text-brand-700'
                    }`}
                  >
                    {ROLES[s.role].label}
                  </span>
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Hidden for now: no dropout in the demo.
      <p className="mb-1 mt-5 text-[11px] font-semibold uppercase tracking-wider text-muted">Shortcut</p>
      <button
        type="button"
        onClick={dropOut}
        className="flex w-full cursor-pointer items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-left text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
      >
        <AlertTriangle className="h-4 w-4 shrink-0" />
        Skip to: Plans changed
      </button>
      */}

      <button
        type="button"
        onClick={run(() => dispatch({ type: 'RESET' }))}
        className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted transition hover:bg-white hover:text-ink"
      >
        <RotateCcw className="h-4 w-4" /> Reset demo
      </button>
    </div>
  )
}
