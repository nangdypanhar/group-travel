import { SCENARIOS } from '../state/demoState'
import { useDemo } from '../state/useDemo'

// Demo control: does every member pay, or does the late member drop out?
export default function ScenarioSwitch({ onDone = () => {} }) {
  const { state, dispatch } = useDemo()
  return (
    <div>
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted">Scenario</p>
      <div className="grid grid-cols-2 gap-1 rounded-2xl bg-white/70 p-1 ring-1 ring-slate-100">
        {Object.entries(SCENARIOS).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              dispatch({ type: 'SET_SCENARIO', scenario: id })
              onDone()
            }}
            className={`cursor-pointer whitespace-nowrap rounded-xl px-2 py-2 text-xs font-semibold transition ${
              state.scenario === id ? (id === 'dropout' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white') : 'text-muted hover:text-ink'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
