import { Briefcase, ChevronDown, Luggage, Plane, Utensils } from 'lucide-react'
import { useState } from 'react'
import { TRIP } from '../data/mockData'
import Ticket, { TicketRoute } from './Ticket'

// The trip as a ticket: route on top, then the flight details.
// `collapsible` folds the details behind a toggle so the ticket stays short.
export default function TripCard({ label = 'Group trip', collapsible = false }) {
  const { from, to, flight } = TRIP
  const [open, setOpen] = useState(!collapsible)
  return (
    <Ticket
      top={
        <TicketRoute
          label={label}
          fromSub={`${flight.depart} · ${from.city}`}
          toSub={`${to.city} · ${flight.arrive}`}
          middle={`${flight.duration} · ${flight.stops}`}
        />
      }
    >
      {collapsible && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full cursor-pointer items-center gap-2 text-left"
        >
          <span className="flex-1">
            <span className="font-semibold">{flight.airline}</span>
            <span className="text-muted"> · {flight.stops} · {flight.checkedBagKg} kg bag</span>
          </span>
          <span className="text-xs font-semibold text-brand-600">{open ? 'Hide' : 'Flight details'}</span>
          <ChevronDown className={`h-4 w-4 shrink-0 text-brand-600 transition ${open ? 'rotate-180' : ''}`} />
        </button>
      )}
      {open && (
        <div className={collapsible ? 'mt-4 animate-fade-up' : ''}>
          <FlightDetails inTicket />
        </div>
      )}
    </Ticket>
  )
}

// Each flight with airline, airports and terminals, then what's included.
// Used inside the ticket, or on its own in a plain card. The ticket already has a
// dashed tear line, so `inTicket` separates the flights with a plain line instead.
export function FlightDetails({ inTicket = false }) {
  const { flight } = TRIP
  const included = [
    { Icon: Briefcase, text: `Cabin bag ${flight.cabinBagKg} kg` },
    { Icon: Luggage, text: `Checked bag ${flight.checkedBagKg} kg` },
    { Icon: Utensils, text: flight.meal },
  ]

  return (
    <div className="text-sm">
      {/* Line between outbound and return. */}
      <div className={inTicket ? 'divide-y divide-slate-100' : 'divide-y-2 divide-dashed divide-slate-200'}>
        {flight.legs.map((leg) => (
          <div key={leg.id} className="py-4 first:pt-0 last:pb-0">
            <FlightLeg leg={leg} />
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3">
        <p className="text-xs font-medium text-muted">
          {flight.cabinClass} · {flight.aircraft} · included for each traveler
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {included.map(({ Icon, text }) => (
            <span key={text} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-ink">
              <Icon className="h-3.5 w-3.5 text-brand-600" /> {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// One flight: airline and number, then departure → arrival with airports and terminals.
function FlightLeg({ leg }) {
  const { flight } = TRIP
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-50 text-[10px] font-extrabold text-brand-700">
          {flight.airlineCode}
        </span>
        <p className="min-w-0 flex-1 truncate text-xs">
          <span className="font-semibold">{leg.label}</span>
          <span className="text-muted">
            {' '}
            · {leg.date} · {flight.airline} {leg.number}
          </span>
        </p>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <Stop stop={leg.from} />
        <div className="flex flex-1 flex-col items-center">
          <div className="flex w-full items-center gap-1.5 text-muted">
            <span className="h-px flex-1 bg-slate-200" />
            <Plane className="h-3.5 w-3.5" />
            <span className="h-px flex-1 bg-slate-200" />
          </div>
          <p className="mt-0.5 text-[10px] text-muted">
            {flight.duration} · {flight.stops}
          </p>
        </div>
        <Stop stop={leg.to} right />
      </div>
    </div>
  )
}

function Stop({ stop, right = false }) {
  return (
    <div className={right ? 'text-right' : ''}>
      <p className="text-lg font-bold leading-tight">{stop.time}</p>
      <p className="text-xs font-semibold">{stop.code}</p>
      <p className="text-[11px] text-muted">
        {stop.airport} · {stop.terminal}
      </p>
    </div>
  )
}
