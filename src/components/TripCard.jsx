import { BedDouble, Star } from 'lucide-react'
import { TRIP } from '../data/mockData'
import Ticket, { TicketRoute } from './Ticket'

// The trip as a ticket: flight on top, stay below.
export default function TripCard({ stay, label = 'Flight + Hotel' }) {
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
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
          <BedDouble className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{stay.fullName}</p>
          <p className="text-xs text-muted">
            {TRIP.nights} nights · {TRIP.dates}
          </p>
        </div>
        <span className="flex items-center gap-1 font-semibold">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          {stay.rating}
        </span>
      </div>
    </Ticket>
  )
}
