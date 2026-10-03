import { AlarmClock, BellRing, CheckCircle2, ChevronRight, CreditCard, PartyPopper, Vote } from 'lucide-react'
import Countdown from '../components/Countdown'
import GroupProgress from '../components/GroupProgress'
import MemberCard from '../components/MemberCard'
import UnpaidSheet from '../components/UnpaidSheet'
import { Button, Caption, Card, ProgressBar, Screen } from '../components/ui'
import { ORGANIZER_ID, STAY_OPTIONS, TRIP } from '../data/mockData'
import { usd } from '../lib/format'
import { useNow } from '../lib/useNow'
import { isSpotSecured } from '../state/demoState'
import { useDemo } from '../state/useDemo'

export default function Dashboard() {
  const { state, summary, dispatch, go, toast } = useDemo()
  const { viewer: me } = summary
  const now = useNow()
  const deadlinePassed = now >= state.deadline && summary.unpaid.length > 0
  const unpaidNames = summary.unpaid.map((m) => m.name).join(', ')
  const target = summary.voteTarget
  const keepVote = target && state.keepVote?.targetId === target.id ? state.keepVote : null
  const inspecting = state.members.find((m) => m.id === state.inspectingId)

  // After the deadline, unpaid members can be tapped to start a group vote.
  const canInspect = (m) =>
    deadlinePassed && me.paid && m.id !== me.id && m.joined && !m.removed && !isSpotSecured(m) && !state.keepVote

  const inspect = (m) => {
    dispatch({ type: 'INSPECT', id: m.id })
  }
  const closeInspect = () => {
    dispatch({ type: 'CLOSE_INSPECT', toastId: Date.now(), message: `${inspecting.name} paid ${usd(summary.share)}` })
  }
  const startVote = () => {
    dispatch({ type: 'START_KEEP_VOTE', targetId: inspecting.id })
    toast(`${summary.organizer.name} sent a group vote`)
    go('keepVote')
  }

  const pendingOthers = summary.pending.filter((m) => m.id !== me.id)
  const remindedNames = pendingOthers.filter((m) => m.reminded).map((m) => m.name)
  const leader = STAY_OPTIONS.find((o) => o.id === summary.stay.id)
  const leaderVotes = summary.voteCounts[leader.id]
  const otherVotes = summary.voted - leaderVotes

  let cta
  if (me.removed) cta = <Button disabled>Your spot was released</Button>
  else if (!me.joined) cta = <Button onClick={() => go('join')}>Join the trip</Button>
  else if (!me.info) cta = <Button onClick={() => go('info')}>Add your information</Button>
  else if (!me.vote) cta = <Button onClick={() => go('vote')}><Vote className="h-5 w-5" /> Vote: where should we stay?</Button>
  else if (!me.paid) cta = <Button onClick={() => go('pay')}><CreditCard className="h-5 w-5" /> Pay your share · {usd(summary.share)}</Button>
  else if (deadlinePassed && target && !keepVote)
    cta = (
      <>
        <Button onClick={() => go('deadline')}>
          <AlarmClock className="h-5 w-5" /> Start group decision
        </Button>
        <Caption>Opens as {summary.organizer.name}, the organizer</Caption>
      </>
    )
  else if (keepVote?.status === 'open')
    cta = (
      <Button onClick={() => go('keepVote')}>
        <Vote className="h-5 w-5" /> {keepVote.votes[me.id] ? 'See vote results' : `Vote: keep ${target.name}?`}
      </Button>
    )
  else if (keepVote?.status === 'awaiting-organizer')
    cta = (
      <>
        <Button onClick={() => go('deadline')}>
          <BellRing className="h-5 w-5" /> Open {summary.organizer.name}&apos;s alert
        </Button>
        <Caption>Majority voted to remove {target.name}</Caption>
      </>
    )
  else if (!summary.isReady)
    cta = (
      <>
        <div className="flex items-center justify-center gap-2 rounded-2xl bg-brand-50 py-3.5 text-[15px] font-semibold text-brand-700">
          <CheckCircle2 className="h-5 w-5" /> You&apos;re all set
        </div>
        <Caption>
          {remindedNames.length ? (
            <>
              <BellRing className="mr-1 inline h-3 w-3" />
              Trip.com auto-reminded {remindedNames.join(', ')}
            </>
          ) : (
            `Waiting on ${pendingOthers.length} ${pendingOthers.length === 1 ? 'friend' : 'friends'} to pay their share`
          )}
        </Caption>
      </>
    )
  else
    cta = (
      <>
        <Button onClick={() => go('ready')}>
          <PartyPopper className="h-5 w-5" /> Group ready · {summary.organizer.name} books
        </Button>
        <Caption>Opens as {summary.organizer.name}, the organizer</Caption>
      </>
    )

  return (
    <Screen footer={cta}>
      {/* Hero: the whole trip at a glance */}
      <div className="rounded-3xl bg-ink p-5 text-white shadow-card">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold">{state.group.name}</h1>
            <p className="mt-0.5 text-sm text-white/60">
              {TRIP.from.city} → {TRIP.to.city}
            </p>
            <p className="text-sm text-white/60">{TRIP.dates}</p>
          </div>
          <DeadlineBox allSecured={now >= state.deadline && summary.unpaid.length === 0} passed={deadlinePassed} deadline={state.deadline} />
        </div>

        <div className="mt-6">
          <p className="text-xs font-medium uppercase tracking-wider text-white/50">Amount secured</p>
          <p className="mt-1 flex items-baseline gap-2">
            <span key={summary.secured} className="animate-pop text-4xl font-extrabold tracking-tight">
              {usd(summary.secured)}
            </span>
            <span className="text-lg font-semibold text-white/50">/ {usd(summary.total)}</span>
          </p>
          <div className="mt-3">
            <ProgressBar value={summary.secured} max={summary.total} dark />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 text-center">
          {[
            ['Per person', usd(summary.share)],
            ['Travelers', summary.size],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-white/8 py-2.5">
              <p className="text-base font-bold">{value}</p>
              <p className="text-[10px] text-white/50">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {deadlinePassed && (
        <button
          type="button"
          onClick={() => go('deadline')}
          className="flex w-full animate-fade-up cursor-pointer items-center gap-3 rounded-3xl border border-rose-100 bg-rose-50 p-4 text-left"
        >
          <AlarmClock className="h-6 w-6 shrink-0 text-rose-500" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-rose-700">Deadline reached</p>
            <p className="text-xs text-rose-600">
              {unpaidNames} {summary.unpaid.length === 1 ? 'hasn’t' : 'haven’t'} paid.{' '}
              {keepVote?.status === 'awaiting-organizer'
                ? 'Waiting for the organizer.'
                : keepVote
                  ? 'Group is voting.'
                  : 'Group votes: keep or remove.'}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-rose-300" />
        </button>
      )}

      <GroupProgress summary={summary} />

      <button
        type="button"
        onClick={() => go('vote')}
        className="flex w-full cursor-pointer items-center gap-3 rounded-3xl border border-slate-100 bg-white p-4 text-left shadow-card transition hover:border-brand-200"
      >
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-violet-50 text-violet-600">
          <Vote className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">Where should we stay?</p>
          <p className="text-xs text-muted">
            {summary.voteClosed ? (
              <span className="font-semibold text-brand-600">
                Decided: {leader.name} {summary.isTie ? '(tie, organizer’s pick)' : `(${leaderVotes}–${otherVotes})`}
              </span>
            ) : (
              <>
                {leader.name} leading {leaderVotes}–{otherVotes} · {summary.voted}/{summary.size} voted
              </>
            )}
          </p>
        </div>
        <ChevronRight className="h-5 w-5 text-slate-300" />
      </button>

      <div>
        <h2 className="mb-2 px-1 font-semibold">Members</h2>
        <Card className="space-y-1 p-2">
          {[...summary.active, ...state.members.filter((m) => m.removed)].map((m) => (
            <MemberCard
              key={m.id}
              member={m}
              isMe={m.id === me.id}
              isOrganizer={m.id === ORGANIZER_ID}
              covering={summary.covering[m.id]}
              onClick={canInspect(m) ? () => inspect(m) : undefined}
            />
          ))}
        </Card>
      </div>
      {inspecting && (
        <UnpaidSheet
          member={inspecting}
          owed={summary.share}
          organizer={summary.organizer}
          onClose={closeInspect}
          onStartVote={startVote}
        />
      )}
    </Screen>
  )
}

// Payment deadline for the whole group, pinned to the top right of the hero.
function DeadlineBox({ deadline, passed, allSecured }) {
  if (allSecured)
    return (
      <div className="shrink-0 rounded-2xl bg-emerald-400/15 px-3 py-2 text-right ring-1 ring-emerald-400/30">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300/80">Payment deadline</p>
        <p className="flex items-center justify-end gap-1 text-sm font-extrabold text-emerald-300">
          <CheckCircle2 className="h-4 w-4" /> All secured
        </p>
        <p className="mt-1 text-[10px] font-medium text-white/60">Everyone paid their share</p>
      </div>
    )
  return (
    <div className="shrink-0 rounded-2xl bg-rose-500/15 px-3 py-2 text-right ring-1 ring-rose-400/40">
      <p className="flex items-center justify-end gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-rose-200/80">
        {!passed && (
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-400" />
          </span>
        )}
        Payment deadline
      </p>
      <p className="mt-0.5 flex items-center justify-end gap-1 text-lg font-extrabold leading-none text-rose-300">
        <AlarmClock className="h-4 w-4" strokeWidth={2.5} />
        <Countdown deadline={deadline} />
      </p>
      <p className="mt-1 text-[10px] font-medium text-white/60">
        {passed ? 'Unpaid spots at risk' : 'Everyone pays their share by then'}
      </p>
    </div>
  )
}
