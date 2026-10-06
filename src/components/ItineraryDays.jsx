import { useState } from 'react'
import { PLACE_STYLES } from './placeStyles'

// Day tabs with a timeline of what to do each day, Trip.com itinerary style.
export default function ItineraryDays({ days }) {
  const [active, setActive] = useState(1)
  const day = days.find((d) => d.day === active)
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-card">
      <div className="no-scrollbar flex gap-2 overflow-x-auto border-b border-slate-100 px-4 py-3">
        {days.map((d) => (
          <button
            key={d.day}
            type="button"
            onClick={() => setActive(d.day)}
            className={`shrink-0 cursor-pointer rounded-2xl px-3.5 py-2 text-left transition ${
              d.day === active ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25' : 'bg-slate-50 text-muted hover:bg-slate-100'
            }`}
          >
            <p className="text-sm font-bold">Day {d.day}</p>
            <p className={`text-[11px] ${d.day === active ? 'text-white/75' : ''}`}>{d.date}</p>
          </button>
        ))}
      </div>

      <div key={active} className="animate-fade-up px-5 pb-3 pt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
          Day {day.day} · {day.date}
        </p>
        <p className="mt-0.5 text-lg font-bold">{day.title}</p>
        <ol className="mt-4">
          {day.items.map((item, i) => {
            const { Icon, tile } = PLACE_STYLES[item.kind === 'place' ? item.category : item.kind]
            const lastItem = i === day.items.length - 1
            return (
              <li key={`${item.time}-${item.title}`} className="relative flex gap-3 pb-4">
                {/* timeline connector */}
                {!lastItem && <span className="absolute bottom-0 left-[19px] top-11 w-px bg-slate-200" />}
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${tile}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold tabular-nums text-muted">
                    {item.time}
                    {item.duration && ` · ${item.duration}`}
                  </p>
                  <p className="font-semibold leading-snug">{item.title}</p>
                  <p className="text-xs text-muted">
                    {item.area}
                    {item.note && ` · ${item.note}`}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
