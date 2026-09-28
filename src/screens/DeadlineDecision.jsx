import { AlarmClock, BellRing, CheckCircle2, HandCoins, UserMinus, Vote } from 'lucide-react'
import { AvatarStack } from '../components/Avatar'
import KeepVoteTally from '../components/KeepVoteTally'
import { Button, Caption, Card, Screen, ScreenTitle } from '../components/ui'
import { usd } from '../lib/format'
import { MEMBER_ID } from '../data/mockData'
import { keepVoters, splitAmount, tallyKeepVote } from '../state/demoState'
import { useDemo } from '../state/useDemo'

// Organizer's view: start the keep-or-remove vote, then confirm a removal.
export default function DeadlineDecision() {
  const { state, summary, dispatch, go, toast } = useDemo()
  const owed = summary.share
  const vote = state.keepVote
  const target = summary.voteTarget
  const activeVote = vote && target && vote.targetId === target.id ? vote : null

  // Nothing left to decide.
  if (!target) {
    const last = vote && state.members.find((m) => m.id === vote.targetId)
    return (
      <Screen footer={<Button onClick={() => go('dashboard')}>Back to group</Button>}>
        <ScreenTitle
          eyebrow="Payment deadline"
          title="Every spot is resolved"
          subtitle={
            last
              ? `${last.name} was ${vote.status === 'removed' ? 'removed from the trip' : 'kept, covered by the group'}.`
              : 'Everyone paid in time.'
          }
        />
      </Screen>
    )
  }

  const voters = keepVoters(state, target.id)

  // Step 1: organizer starts the vote.
  if (!activeVote) {
    const start = () => {
      dispatch({ type: 'START_KEEP_VOTE', targetId: target.id })
      toast(`Vote sent to ${voters.length} paid members`)
      go('keepVote')
    }
    return (
      <Screen
        footer={
          <Button onClick={start}>
            <Vote className="h-5 w-5" /> Start keep-or-remove vote
          </Button>
        }
      >
        <ScreenTitle
          eyebrow={
            <span className="inline-flex items-center gap-1 text-rose-600">
              <AlarmClock className="h-3.5 w-3.5" /> Payment deadline reached
            </span>
          }
          title={`${target.name} hasn't paid`}
          subtitle={`${usd(owed)} unpaid. The paid members decide.`}
        />
        <Card className="space-y-4">
          <Rule Icon={HandCoins} tone="text-brand-600 bg-brand-50" title="Majority Keep">
            Keep voters split {usd(owed)}
          </Rule>
          <Rule Icon={UserMinus} tone="text-rose-500 bg-rose-50" title="Majority Remove">
            You confirm the removal
          </Rule>
        </Card>
        <div className="flex items-center justify-between px-1">
          <span className="text-sm text-muted">{voters.length} paid members vote</span>
          <AvatarStack members={voters} />
        </div>
      </Screen>
    )
  }

  const tally = tallyKeepVote(activeVote.votes)

  // Step 2: votes coming in.
  if (activeVote.status === 'open') {
    return (
      <Screen footer={<Button onClick={() => go('keepVote')}>Open {state.members.find((m) => m.id === MEMBER_ID).name}&apos;s vote</Button>}>
        <ScreenTitle eyebrow="Vote in progress" title={`Keep ${target.name}?`} subtitle="Waiting for votes." />
        <KeepVoteTally vote={activeVote} voters={voters} members={state.members} />
      </Screen>
    )
  }

  // Step 3: majority voted remove, so the organizer confirms.
  const accept = () => {
    dispatch({ type: 'REMOVE_MEMBER', id: target.id })
    dispatch({ type: 'SET_KEEP_VOTE_STATUS', status: 'removed' })
    toast(`${target.name} removed. The bill drops to ${usd(summary.total - owed)}`)
    go('dashboard')
  }
  const keepAnyway = () => {
    dispatch({ type: 'COVER_MEMBER', id: target.id, contributions: splitAmount(owed, tally.keep) })
    dispatch({ type: 'SET_KEEP_VOTE_STATUS', status: 'kept' })
    toast(`${target.name} stays. ${tally.keep.length} Keep voters split ${usd(owed)}`)
    go('dashboard')
  }
  const keepers = tally.keep.map((id) => state.members.find((m) => m.id === id).name)
  const perKeeper = tally.keep.length ? usd(Math.round((owed / tally.keep.length) * 100) / 100) : null

  return (
    <Screen
      footer={
        <>
          <Button variant="danger" onClick={accept} disabled={!summary.canRemove}>
            <UserMinus className="h-5 w-5" /> Accept &amp; remove {target.name}
          </Button>
          <Button variant="secondary" onClick={keepAnyway} disabled={!tally.keep.length}>
            Keep {target.name} anyway
          </Button>
          <Caption>
            {!summary.canRemove
              ? `Removing would drop below the minimum of ${state.group.minMembers}`
              : tally.keep.length
                ? tally.keep.length === 1
                  ? `Keeping means ${keepers[0]} covers the full ${usd(owed)}`
                  : `Keeping means ${keepers.join(', ')} split ${usd(owed)} (${perKeeper} each)`
                : 'Nobody voted to cover the payment'}
          </Caption>
        </>
      }
    >
      <div className="flex animate-fade-up gap-3 rounded-3xl bg-rose-50 p-4">
        <BellRing className="h-6 w-6 shrink-0 text-rose-500" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-500">Organizer alert</p>
          <p className="mt-1 font-bold text-rose-700">Group voted to remove {target.name}</p>
          <p className="mt-0.5 text-sm text-rose-600">
            {tally.keep.length} keep · {tally.remove.length} remove
          </p>
        </div>
      </div>
      <KeepVoteTally vote={activeVote} voters={voters} members={state.members} />
      <Card className="flex items-center gap-3 p-4 text-sm">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-500" />
        <p>
          Remove: {summary.size - 1} travelers, still {usd(owed)} each
        </p>
      </Card>
    </Screen>
  )
}

function Rule({ Icon, tone, title, children }) {
  return (
    <div className="flex gap-3">
      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${tone}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted">{children}</p>
      </div>
    </div>
  )
}
