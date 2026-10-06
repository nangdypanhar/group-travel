import { Check, Loader2, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { PLACE_STYLES } from '../components/placeStyles'
import { Button, Caption, Screen, ScreenTitle } from '../components/ui'
import { MIN_PLACES, PLACE_CATEGORIES, PLACES, TRIP } from '../data/mockData'
import { useDemo } from '../state/useDemo'

// Organizer: pick the places the group wants to see, then generate a day-by-day plan.
export default function Places() {
  const { state, dispatch, go } = useDemo()
  const [category, setCategory] = useState('all')
  const [generating, setGenerating] = useState(false)
  const timer = useRef(null)
  const { placeIds } = state.plan
  const shown = category === 'all' ? PLACES : PLACES.filter((p) => p.category === category)

  useEffect(() => () => clearTimeout(timer.current), [])

  const generate = () => {
    setGenerating(true)
    timer.current = setTimeout(() => {
      dispatch({ type: 'GENERATE_PLAN' })
      go('plan')
    }, 1200)
  }

  return (
    <Screen
      footer={
        <>
          <Button onClick={generate} disabled={placeIds.length < MIN_PLACES || generating}>
            {generating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
            {generating ? 'Building your day-by-day plan…' : `Generate itinerary · ${placeIds.length} places`}
          </Button>
          {placeIds.length < MIN_PLACES && <Caption>Pick at least {MIN_PLACES} places</Caption>}
        </>
      }
    >
      <ScreenTitle
        eyebrow={`${TRIP.to.city} · ${TRIP.nights} nights`}
        title="Where do you want to go?"
        subtitle="Pick the places you like. We'll arrange them into days."
      />

      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
        {PLACE_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            className={`shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
              category === c.id ? 'bg-ink text-white' : 'bg-white text-muted shadow-card hover:text-ink'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {shown.map((p) => {
          const { Icon, tile } = PLACE_STYLES[p.category]
          const selected = placeIds.includes(p.id)
          return (
            <button
              key={p.id}
              type="button"
              aria-pressed={selected}
              onClick={() => dispatch({ type: 'TOGGLE_PLACE', id: p.id })}
              className={`relative flex cursor-pointer flex-col rounded-3xl border-2 bg-white p-3 text-left shadow-card transition ${
                selected ? 'border-brand-500' : 'border-transparent hover:border-brand-200'
              }`}
            >
              <div className={`grid h-16 w-full place-items-center rounded-2xl ${tile}`}>
                <Icon className="h-7 w-7" />
              </div>
              <span
                className={`absolute right-5 top-5 grid h-6 w-6 place-items-center rounded-full border-2 transition ${
                  selected ? 'border-brand-500 bg-brand-500' : 'border-white bg-white/70'
                }`}
              >
                {selected && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
              </span>
              <p className="mt-2.5 text-sm font-semibold leading-snug">{p.name}</p>
              <p className="mt-0.5 text-[11px] text-muted">
                {p.area} · {p.duration}
              </p>
            </button>
          )
        })}
      </div>
    </Screen>
  )
}
