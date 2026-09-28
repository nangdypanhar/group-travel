import { Loader2, PartyPopper } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Avatar from '../components/Avatar'
import { Line, Stamp } from '../components/PaymentCard'
import Ticket, { TicketFields, TicketRoute } from '../components/Ticket'
import { Button, Screen } from '../components/ui'
import { TRIP } from '../data/mockData'
import { usd } from '../lib/format'
import { useDemo } from '../state/useDemo'

export default function GroupReady() {
  const { state, summary, dispatch, go } = useDemo()
  const [booking, setBooking] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  if (!summary.isReady) {
    return (
      <Screen footer={<Button onClick={() => go('dashboard')}>Back to group</Button>}>
        <p className="pt-10 text-center text-muted">The group isn&apos;t ready yet. Everyone needs to finish their part first.</p>
      </Screen>
    )
  }

  const book = () => {
    setBooking(true)
    timer.current = setTimeout(() => {
      dispatch({ type: 'CONFIRM_BOOKING' })
      go('confirmed')
    }, 1500)
  }

  const rows = [
    ['Members joined', `${summary.joined}/${summary.size}`],
    ['Information completed', `${summary.infoDone}/${summary.size}`],
    ['Payments completed', `${summary.paid}/${summary.size}`],
    ...summary.active
      .filter((m) => m.coveredBy)
      .map((m) => [`${m.name}'s share`, `Covered by ${Object.keys(m.coveredBy).length}`]),
  ]

  return (
    <Screen
      footer={
        <Button onClick={book} disabled={booking}>
          {booking ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
          {booking ? `Booking for ${summary.size}…` : 'Book together'}
        </Button>
      }
    >
      <div className="flex flex-col items-center pt-2 text-center">
        <PartyPopper className="h-10 w-10 animate-pop text-brand-500" />
        <h1 className="mt-3 text-[28px] font-bold tracking-tight">Everyone&apos;s in</h1>
        <p className="mt-1 text-[15px] text-muted">Fully paid. Book for the whole group.</p>
      </div>

      <div className="flex justify-center gap-2 py-1">
        {summary.active.map((m, i) => (
          <div key={m.id} className="flex animate-fade-up flex-col items-center gap-1" style={{ animationDelay: `${i * 80}ms` }}>
            <Avatar member={m} done />
            <span className="text-[11px] font-medium text-muted">{m.name}</span>
          </div>
        ))}
      </div>

      <Ticket
        top={
          <>
            <TicketRoute label={state.group.name} />
            <TicketFields fields={[['Travelers', summary.size], ['Stay', summary.stay.name], ['Nights', TRIP.nights]]} />
          </>
        }
      >
        <div className="space-y-2">
          {rows.map(([label, value]) => (
            <Line key={label} label={label} value={value} />
          ))}
        </div>
        <div className="mt-3 flex items-end justify-between border-t border-slate-100 pt-3">
          <div>
            <p className="text-xs font-medium text-muted">Secured</p>
            <p className="text-3xl font-extrabold tracking-tight">{usd(summary.secured)}</p>
          </div>
          <Stamp>READY</Stamp>
        </div>
      </Ticket>
    </Screen>
  )
}
