import { BedDouble, PlaneTakeoff, Star } from 'lucide-react'
import { HOTELS, TRIP } from '../data/mockData'
import Ticket, { TicketRoute } from './Ticket'

// The trip as a ticket: outbound flight on top, return flight and hotel below.
export default function TripCard({ hotel = HOTELS.main, rooms, label = 'Flight + Hotel' }) {
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
      <div className="space-y-3">
        <Row Icon={PlaneTakeoff} title={`Return · ${flight.returnDate}, ${flight.returnDepart}`} sub={`${flight.stops} · ${flight.cabin}`} />
        <Row
          Icon={BedDouble}
          title={hotel.name}
          sub={`${TRIP.nights} nights · ${rooms ?? hotel.area}`}
          right={
            <span className="flex items-center gap-1 font-semibold">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {hotel.rating}
            </span>
          }
        />
      </div>
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
