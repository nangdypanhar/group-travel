import { BAGGAGE, TRIP } from '../data/mockData'
import { usd } from '../lib/format'
import Ticket, { TicketFields, TicketRoute } from './Ticket'

// Boarding-pass style checkout for one traveler's share.
// `paid` turns it into a receipt with a PAID stamp.
// `extras` are the traveler's own add-ons ({ label, amount }), charged on top of the share.
export default function PaymentCard({ share, extras = [], passenger, paid = false, method }) {
  const total = share + extras.reduce((sum, e) => sum + e.amount, 0)
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
        <Line label={`Group trip · ${TRIP.from.code} ⇄ ${TRIP.to.code}`} value={usd(share)} />
        <Line label={`Checked baggage · ${BAGGAGE.includedKg} kg`} value="Included" />
        {extras.map((e) => (
          <Line key={e.label} label={e.label} value={usd(e.amount)} />
        ))}
      </div>
      <div className="mt-3 flex items-end justify-between border-t border-slate-100 pt-3">
        <div>
          <p className="text-xs font-medium text-muted">{paid ? `Paid${method ? ` · ${method}` : ''}` : extras.length ? 'Your total' : 'Your share'}</p>
          <p className="text-3xl font-extrabold tracking-tight">{usd(total)}</p>
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
