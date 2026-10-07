import { TRIP } from '../data/mockData'
import { usd } from '../lib/format'
import Ticket, { TicketFields, TicketRoute } from './Ticket'

// Boarding-pass style checkout for one traveler's share.
// `paid` turns it into a receipt with a PAID stamp.
export default function PaymentCard({ share, passenger, paid = false, method }) {
  return (
    <Ticket
      top={
        <>
          <TicketRoute label="Group Trip ticket" />
          <TicketFields fields={[['Passenger', passenger], ['Dates', TRIP.dates], ['Nights', TRIP.nights]]} />
        </>
      }
    >
      <div className="space-y-2">
        <Line label={`Flight ${TRIP.from.code} ⇄ ${TRIP.to.code}`} value={usd(TRIP.flight.perPerson)} />
        <Line label="Trip activities" value={usd(share - TRIP.flight.perPerson)} />
      </div>
      <div className="mt-3 flex items-end justify-between border-t border-slate-100 pt-3">
        <div>
          <p className="text-xs font-medium text-muted">{paid ? `Paid${method ? ` · ${method}` : ''}` : 'Your share'}</p>
          <p className="text-3xl font-extrabold tracking-tight">{usd(share)}</p>
        </div>
        {paid && <Stamp>PAID</Stamp>}
      </div>
    </Ticket>
  )
}

export function Line({ label, value }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted">{label}</span>
      <span className="text-right font-semibold">{value}</span>
    </div>
  )
}

export function Stamp({ children }) {
  return (
    <span className="-rotate-6 animate-pop rounded-lg border-2 border-emerald-500 px-3 py-1 text-sm font-extrabold tracking-widest text-emerald-600">
      {children}
    </span>
  )
}
