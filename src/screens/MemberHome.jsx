import { ChevronDown, BellRing, CheckCircle2, CreditCard, PartyPopper, Plane, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { AvatarStack } from '../components/Avatar'
import { DeadlineCard } from '../components/Countdown'
import MemberCard, { PaymentStatus } from '../components/MemberCard'
import StatusBadge from '../components/StatusBadge'
import { Button, Caption, Card, ProgressBar, Screen } from '../components/ui'
import { MEMBER_ID, ORGANIZER_ID, TRIP } from '../data/mockData'
import { usd } from '../lib/format'
import { useNow } from '../lib/useNow'
import { useDemo } from '../state/useDemo'

// You, then the organizer, then paid, waiting and dropped members.
function sortedMembers(members) {
  const rank = (m) =>
    m.id === MEMBER_ID ? 0 : m.id === ORGANIZER_ID ? 1 : m.removed ? 5 : m.paid ? 2 : m.joined ? 3 : 4
  return [...members].sort((a, b) => rank(a) - rank(b))
}

// Whether a joined member has filled in their traveler information.
function InfoStatus({ member }) {
  if (!member.joined || member.removed) return null
  return member.info ? (
    <StatusBadge key="info" tone="infoDone">Info added</StatusBadge>
  ) : (
    <StatusBadge key="no-info" tone="infoMissing">Info missing</StatusBadge>
  )
}

// Member: their own trip, share and deadline first; the group and the plan below.
export default function MemberHome() {
  const { state, summary, dispatch, go, toast } = useDemo()
  const { me, organizer, dropped } = summary
  const { change, booked } = state
  const now = useNow()
  // The member list is detail, so it starts folded.
  const [membersOpen, setMembersOpen] = useState(false)
  const needsMyConfirm = change?.status === 'confirming' && !change.confirmed[MEMBER_ID]
  const iConfirmed = Boolean(change?.confirmed[MEMBER_ID])
  const myShare = summary.myTotal + (iConfirmed ? summary.topUp : 0)
  // The whole group has paid, so the trip is safe; only the organizer's booking is left.
  const everyonePaid = me.paid && summary.unpaid.length === 0 && !booked && !change

  const confirm = () => {
    dispatch({ type: 'CONFIRM_ARRANGEMENT', id: MEMBER_ID })
    toast(summary.topUp ? `Confirmed · +${usd(summary.topUp)} top-up paid` : 'New arrangement confirmed')
  }

  let footer = null
  if (!me.paid)
    footer = (
      <Button onClick={() => go('pay')}>
        <CreditCard className="h-5 w-5" /> Pay {usd(summary.myTotal)}
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
            <p className="text-xs text-white/50">{summary.myExtras.total ? 'Your total' : 'Your share'}</p>
            <p className="text-4xl font-extrabold tracking-tight">{usd(myShare)}</p>
          </div>
          <div className="space-y-1 text-right text-xs text-white/70">
            <p className="flex items-center justify-end gap-1.5">
              <Plane className="h-3.5 w-3.5" /> {TRIP.flight.stops} · {TRIP.flight.depart} → {TRIP.flight.arrive}
            </p>
            {summary.myExtras.lines.map((e) => (
              <p key={e.label}>
                {e.label} · {usd(e.amount)}
              </p>
            ))}
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
          Your booking is ready.
        </Notice>
      )}

      {everyonePaid && (
        <Notice tone="emerald" Icon={PartyPopper} title="Everyone paid. Group is good to go!">
          Trip is ready to book.
        </Notice>
      )}

      {me.paid && !booked && !change && summary.unpaid.length > 0 && (
        <Notice tone="brand" Icon={CheckCircle2} title="You're paid">
          Waiting for {summary.unpaid.length} more {summary.unpaid.length === 1 ? 'payment' : 'payments'} before the group can book.
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
        <div>
          <div className="flex items-baseline justify-between">
            <h2 className="font-semibold">Your group</h2>
            <span className="text-sm font-semibold">
              {summary.paid} of {summary.size} <span className="font-normal text-muted">paid</span>
            </span>
          </div>
          <div className="mt-2">
            <ProgressBar value={summary.paid} max={summary.size} />
          </div>
          <p className="mt-2 text-xs text-muted">
            <span className="font-semibold text-ink">{usd(summary.secured)}</span> of {usd(summary.total)} secured
          </p>
        </div>

        <button
          type="button"
          onClick={() => setMembersOpen((o) => !o)}
          aria-expanded={membersOpen}
          className="flex w-full cursor-pointer items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2.5 text-left text-sm font-semibold transition hover:bg-slate-100"
        >
          {!membersOpen && <AvatarStack members={summary.active} size="xs" />}
          <span className="flex-1">{membersOpen ? 'Hide members' : `See all ${summary.size} members`}</span>
          <ChevronDown className={`h-4 w-4 shrink-0 text-muted transition ${membersOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* You first, then the organizer, then everyone else: paid, waiting, dropped. */}
        {membersOpen && (
          <div className="-mx-2 animate-fade-up divide-y divide-slate-100">
            {sortedMembers(state.members).map((m) => (
              <MemberCard
                key={m.id}
                member={m}
                isMe={m.id === MEMBER_ID}
                isOrganizer={m.id === ORGANIZER_ID}
                status={
                  <>
                    <InfoStatus member={m} />
                    <PaymentStatus member={m} deadlinePassed={now >= state.deadline} />
                  </>
                }
                action={
                  !m.removed && (
                    <span className={`text-sm font-semibold ${m.paid ? 'text-emerald-600' : 'text-muted'}`}>{usd(TRIP.price)}</span>
                  )
                }
              />
            ))}
          </div>
        )}

        {/* My own deadline is in the hero while I haven't paid. */}
        {me.paid && !booked && !everyonePaid && (
          <DeadlineCard deadline={state.deadline} label="Group deadline" note={state.group.deadlineLabel} done={summary.unpaid.length === 0} />
        )}
      </Card>
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
