import { PlaneTakeoff } from 'lucide-react'
import { TRIP } from '../data/mockData'
import Ticket, { TicketRoute } from './Ticket'

// The trip as a ticket: outbound flight on top, return flight below.
export default function TripCard({ label = 'Flight + Activities' }) {
  const { from, to, flight } = TRIP
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
      <Row Icon={PlaneTakeoff} title={`Return · ${flight.returnDate}, ${flight.returnDepart}`} sub={`${flight.stops} · ${flight.cabin}`} />
    </Ticket>
  )
}

function Row({ Icon, title, sub, right }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{title}</p>
        <p className="truncate text-xs text-muted">{sub}</p>
      </div>
      {right}
    </div>
  )
}
