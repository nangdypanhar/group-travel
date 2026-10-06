import { BedDouble, BellRing, CheckCircle2, CreditCard, PartyPopper, Plane, RefreshCw } from 'lucide-react'
import Avatar from '../components/Avatar'
import { DeadlineCard } from '../components/Countdown'
import ItineraryDays from '../components/ItineraryDays'
import { Button, Caption, Card, ProgressBar, Screen } from '../components/ui'
import { MEMBER_ID, TRIP } from '../data/mockData'
import { usd } from '../lib/format'
import { planDays } from '../lib/itinerary'
import { useNow } from '../lib/useNow'
import { useDemo } from '../state/useDemo'

// One-word payment status for the compact group grid.
function statusOf(m, deadlinePassed) {
  if (m.removed) return { label: 'Dropped', className: 'text-rose-500' }
  if (m.paid) return { label: 'Paid', className: 'text-emerald-600' }
  if (m.graceUntil) return { label: 'Extension', className: 'text-amber-600' }
  if (deadlinePassed) return { label: 'Missed', className: 'text-rose-500' }
  if (m.joined) return { label: 'Pending', className: 'text-amber-600' }
  return { label: 'Invited', className: 'text-muted' }
}

// Member: their own trip, share and deadline first; the group and the plan below.
export default function MemberHome() {
  const { state, summary, dispatch, go, toast } = useDemo()
  const { me, organizer, dropped } = summary
  const { change, booked } = state
  const now = useNow()
  const needsMyConfirm = change?.status === 'confirming' && !change.confirmed[MEMBER_ID]
  const iConfirmed = Boolean(change?.confirmed[MEMBER_ID])
  const myShare = TRIP.price + (iConfirmed ? summary.topUp : 0)

  const confirm = () => {
    dispatch({ type: 'CONFIRM_ARRANGEMENT', id: MEMBER_ID })
    toast(summary.topUp ? `Confirmed · +${usd(summary.topUp)} top-up paid` : 'New arrangement confirmed')
  }

  let footer = null
  if (!me.paid)
    footer = (
      <Button onClick={() => go('pay')}>
        <CreditCard className="h-5 w-5" /> Pay {usd(TRIP.price)}
      </Button>
    )
  else if (needsMyConfirm)
    footer = (
      <>
        <Button onClick={confirm}>
          Confirm new plan{summary.topUp ? ` · +${usd(summary.topUp)}` : ''}
        </Button>
        <Caption>{organizer.name} proposed this to keep the trip going</Caption>
      </>
    )

  return (
    <Screen footer={footer}>
      {/* Hero: my trip, my share, my status */}
      <div className="rounded-3xl bg-ink p-5 text-white shadow-card">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50">Your group trip</p>
          <span
            key={me.paid ? 'paid' : 'pending'}
            className={`shrink-0 animate-pop rounded-full px-2.5 py-1 text-[11px] font-bold ${
              booked ? 'bg-emerald-400 text-ink' : me.paid ? 'bg-emerald-400/20 text-emerald-300' : 'bg-amber-400/20 text-amber-200'
            }`}
          >
            {booked ? 'Booked' : me.paid ? 'Paid' : 'Payment pending'}
          </span>
        </div>
        <h1 className="mt-1 text-xl font-bold">
          {TRIP.from.city} → {TRIP.to.city}
        </h1>
        <p className="text-sm text-white/60">
          {TRIP.dates} · by {organizer.name}
        </p>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="text-xs text-white/50">Your share</p>
            <p className="text-4xl font-extrabold tracking-tight">{usd(myShare)}</p>
          </div>
          <div className="space-y-1 text-right text-xs text-white/70">
            <p className="flex items-center justify-end gap-1.5">
              <Plane className="h-3.5 w-3.5" /> {TRIP.flight.stops} · {TRIP.flight.depart} → {TRIP.flight.arrive}
            </p>
            <p className="flex items-center justify-end gap-1.5">
              <BedDouble className="h-3.5 w-3.5" /> {summary.hotel.name}
            </p>
          </div>
        </div>

        {!me.paid && (
          <div className="mt-4">
            <DeadlineCard dark deadline={state.deadline} note={state.group.deadlineLabel} />
          </div>
        )}
      </div>

      {booked && (
        <Notice tone="emerald" Icon={PartyPopper} title="Group Trip Confirmed">
          Your e-ticket and hotel booking are ready.
        </Notice>
      )}

      {me.reminded && !me.paid && (
        <Notice tone="brand" Icon={BellRing} title="Reminder">
          Pay your share before the deadline to keep your spot.
        </Notice>
      )}

      {change && !booked && (
        <Notice tone="amber" Icon={RefreshCw} title={`${dropped.name} is no longer participating`}>
          {change.status === 'choosing' ? (
            `${organizer.name} is choosing how to keep the trip together.`
          ) : (
            <>
              New plan: <span className="font-semibold">{summary.option.title}</span> · {summary.size} travelers ·{' '}
              {usd(summary.share)}/person
              {summary.priceDiff > 0 && ` (+${usd(summary.priceDiff)})`}
              {iConfirmed && (
                <span className="mt-1 flex items-center gap-1 font-semibold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" /> You confirmed
                </span>
              )}
            </>
          )}
        </Notice>
      )}

      {/* The group's progress, read-only: members see it, only the organizer acts on it. */}
      <Card className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="font-semibold">Your group</h2>
          <span className="text-sm font-semibold">
            {summary.paid}/{summary.size} <span className="font-normal text-muted">paid</span>
          </span>
        </div>
        <ProgressBar value={summary.paid} max={summary.size} />
        <div className="grid grid-cols-3 gap-2">
          {state.members.map((m) => {
            const status = statusOf(m, now >= state.deadline)
            return (
              <div
                key={m.id}
                className={`flex flex-col items-center rounded-2xl px-1 py-2.5 text-center ${m.id === MEMBER_ID ? 'bg-brand-50' : 'bg-slate-50'} ${
                  m.removed ? 'opacity-50' : ''
                }`}
              >
                <Avatar member={m} size="sm" done={m.paid && !m.removed} />
                <p className="mt-1.5 w-full truncate text-xs font-semibold">{m.id === MEMBER_ID ? 'You' : m.name}</p>
                <p key={status.label} className={`animate-pop text-[11px] font-semibold ${status.className}`}>
                  {status.label}
                </p>
              </div>
            )
          })}
        </div>
        {/* My own deadline is in the hero while I haven't paid. */}
        {me.paid && !booked && (
          <DeadlineCard deadline={state.deadline} label="Group deadline" note={state.group.deadlineLabel} done={summary.unpaid.length === 0} />
        )}
      </Card>

      <div>
        <h2 className="mb-2 px-1 font-semibold">Day by day</h2>
        <ItineraryDays days={planDays(state.plan)} />
      </div>
    </Screen>
  )
}

const NOTICE_TONES = {
  emerald: 'bg-emerald-50 text-emerald-800',
  brand: 'bg-brand-50 text-brand-700',
  amber: 'bg-amber-50 text-amber-900 ring-1 ring-amber-200',
}

function Notice({ tone, Icon, title, children }) {
  return (
    <div className={`flex animate-fade-up gap-3 rounded-3xl p-4 ${NOTICE_TONES[tone]}`}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="text-sm">
        <p className="font-bold">{title}</p>
        <div className="mt-0.5 opacity-90">{children}</div>
      </div>
    </div>
  )
}
