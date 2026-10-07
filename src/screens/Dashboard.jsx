import { AlarmClock, ArrowRight, BellRing, FastForward, Hourglass, PartyPopper, UserMinus } from 'lucide-react'
import { DeadlineCard } from '../components/Countdown'
import MemberCard, { PaymentStatus } from '../components/MemberCard'
import { Button, Caption, Card, ProgressBar, Screen } from '../components/ui'
import { LATE_PAYER_ID, ORGANIZER_ID, TRIP } from '../data/mockData'
import { usd } from '../lib/format'
import { useNow } from '../lib/useNow'
import { HOUR, MINUTE } from '../state/demoState'
import { useDemo } from '../state/useDemo'

// Off for now: the demo only shows everyone paying, with no reminders or time-skips.
const SHOW_REMINDERS = false

const names = (members) => members.map((m) => m.name).join(', ')

// Organizer: group readiness at a glance, and payment risk before the deadline.
export default function Dashboard() {
  const { state, summary, dispatch, go, toast } = useDemo()
  const { group } = state
  const now = useNow()
  const passed = now >= state.deadline
  // After the deadline, the unpaid member the organizer has to decide on.
  const atRisk = passed ? (summary.unpaid.find((m) => m.id === LATE_PAYER_ID) ?? summary.unpaid[0]) : null
  const unreminded = summary.unpaid.filter((m) => !m.reminded)

  const remind = (members) => {
    dispatch({ type: 'BATCH', actions: members.map((m) => ({ type: 'REMIND', id: m.id })) })
    toast(`Reminder sent to ${names(members)}`)
  }

  // Demo time-skips. In the product these happen on their own as time passes.
  const skipToLastHour = () => {
    dispatch({
      type: 'BATCH',
      actions: [
        { type: 'SET_DEADLINE', deadline: Date.now() + 59 * MINUTE + 40 * 1000 },
        ...unreminded.map((m) => ({ type: 'REMIND', id: m.id })),
      ],
    })
    toast(unreminded.length ? `1h left · Trip.com auto-reminded ${names(unreminded)}` : '1h left before the deadline')
  }
  const skipToDeadline = () => {
    dispatch({ type: 'SET_DEADLINE', deadline: Date.now() - 1000 })
    toast('Payment deadline reached')
  }
  const extend = (m) => {
    dispatch({ type: 'EXTEND', id: m.id, until: Date.now() + group.extensionHours * HOUR })
    toast(`${m.name} has ${group.extensionHours} more hours to pay`)
  }
  const drop = (m) => {
    dispatch({ type: 'DROP_MEMBER', id: m.id, reason: 'unpaid' })
    toast(`${m.name} dropped · trip recalculated`)
    go('changed')
  }

  let footer
  if (summary.isReady)
    footer = (
      <Button onClick={() => go('ready')}>
        <PartyPopper className="h-5 w-5" /> Everyone paid · Review &amp; book
      </Button>
    )
  else if (state.change)
    footer = (
      <Button onClick={() => go(state.change.optionId ? 'arrangement' : 'changed')}>
        Keep the trip together <ArrowRight className="h-4 w-4" />
      </Button>
    )
  else if (!passed)
    footer = (
      <>
        {SHOW_REMINDERS && unreminded.length ? (
          <Button onClick={() => remind(unreminded)}>
            <BellRing className="h-5 w-5" /> Remind {unreminded.length === 1 ? unreminded[0].name : `${unreminded.length} unpaid members`}
          </Button>
        ) : (
          <Button disabled>
            Waiting for {summary.unpaid.length} {summary.unpaid.length === 1 ? 'payment' : 'payments'}
          </Button>
        )}
        {!SHOW_REMINDERS ? null : state.deadline - now > HOUR + MINUTE ? (
          <DemoSkip onClick={skipToLastHour}>Skip to 1 hour before the deadline</DemoSkip>
        ) : (
          <DemoSkip onClick={skipToDeadline}>Skip to the deadline</DemoSkip>
        )}
      </>
    )
  else if (atRisk && !atRisk.graceUntil)
    footer = (
      <>
        <Button onClick={() => extend(atRisk)}>
          <Hourglass className="h-5 w-5" /> Give {group.extensionHours}-hour extension
        </Button>
        <Button variant="secondary" onClick={() => drop(atRisk)}>
          Continue without {atRisk.name}
        </Button>
      </>
    )
  else if (atRisk)
    footer = (
      <>
        <Button disabled>Waiting for {atRisk.name} to pay…</Button>
        <DemoSkip onClick={() => drop(atRisk)}>Skip to the end of the extension</DemoSkip>
      </>
    )

  return (
    <Screen footer={footer}>
      {/* Hero: group readiness at a glance */}
      <div className="rounded-3xl bg-ink p-5 text-white shadow-card">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50">Group status</p>
        <h1 className="mt-1 text-xl font-bold">{group.name}</h1>
        <p className="text-sm text-white/60">
          {TRIP.from.city} → {TRIP.to.city} · {TRIP.dates}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          {[
            ['joined', summary.joined],
            ['paid', summary.paid],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-white/8 px-4 py-3">
              <p className="text-3xl font-extrabold tracking-tight">
                <span key={value} className="inline-block animate-pop">
                  {value}
                </span>
                <span className="text-lg text-white/50"> / {summary.size}</span>
              </p>
              <p className="text-xs text-white/60">{label}</p>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <ProgressBar value={summary.paid} max={summary.size} dark />
          <p className="mt-1.5 text-[11px] text-white/50">
            {usd(summary.secured)} of {usd(summary.total)} paid in · {usd(summary.share)}/person
          </p>
        </div>

        <div className="mt-4">
          <DeadlineCard dark deadline={state.deadline} note={group.deadlineLabel} done={summary.unpaid.length === 0} />
        </div>
      </div>

      {SHOW_REMINDERS && !passed && !state.change && summary.unpaid.length > 0 && (
        <div className="flex gap-3 rounded-3xl bg-brand-50 p-4 text-sm text-brand-700">
          <BellRing className="h-5 w-5 shrink-0" />
          <p>
            <span className="font-semibold">Auto-reminders on.</span> Unpaid members are reminded 24h, 6h and 1h before the deadline.
          </p>
        </div>
      )}

      {atRisk && !atRisk.graceUntil && (
        <div className="flex animate-fade-up gap-3 rounded-3xl border border-rose-100 bg-rose-50 p-4">
          <AlarmClock className="h-6 w-6 shrink-0 text-rose-500" />
          <div>
            <p className="font-semibold text-rose-700">{atRisk.name} hasn&apos;t paid</p>
            <p className="text-sm text-rose-600">
              Give a short extension, or continue without them. The trip won&apos;t be cancelled.
            </p>
          </div>
        </div>
      )}

      {atRisk?.graceUntil && (
        <div className="animate-fade-up space-y-2">
          <DeadlineCard deadline={atRisk.graceUntil} label={`${atRisk.name}'s extension`} note={`Until ${group.extensionLabel}`} />
          <Caption>
            <UserMinus className="mr-1 inline h-3 w-3" />
            If {atRisk.name} doesn&apos;t pay, the group continues without them
          </Caption>
        </div>
      )}

      <div>
        <h2 className="mb-2 px-1 font-semibold">Members</h2>
        <Card className="space-y-1 p-2">
          {state.members.map((m) => (
            <MemberCard
              key={m.id}
              member={m}
              isMe={m.id === ORGANIZER_ID}
              isOrganizer={m.id === ORGANIZER_ID}
              status={<PaymentStatus member={m} deadlinePassed={passed} />}
              action={
                SHOW_REMINDERS && !m.paid && !m.removed && !m.reminded && !passed ? (
                  <button
                    type="button"
                    onClick={() => remind([m])}
                    className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-100"
                  >
                    <BellRing className="h-3.5 w-3.5" /> Remind
                  </button>
                ) : null
              }
            />
          ))}
        </Card>
      </div>
    </Screen>
  )
}

// Presenter control to move demo time forward. Styled apart from the product UI.
function DemoSkip({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 py-2 text-xs font-medium text-muted transition hover:border-slate-400 hover:text-ink"
    >
      <FastForward className="h-3.5 w-3.5" /> Demo: {children}
    </button>
  )
}
