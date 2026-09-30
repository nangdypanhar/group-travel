import { AlarmClock, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import Countdown from '../components/Countdown'
import VotingOption from '../components/VotingOption'
import { Button, Screen, ScreenTitle } from '../components/ui'
import { MEMBER_ID, STAY_OPTIONS } from '../data/mockData'
import { useDemo } from '../state/useDemo'

export default function Voting() {
  const { state, summary, dispatch, go, toast } = useDemo()
  const me = state.members.find((m) => m.id === MEMBER_ID)
  const [selected, setSelected] = useState(me.vote)
  const hasVoted = Boolean(me.vote)

  const submit = () => {
    dispatch({ type: 'VOTE', id: MEMBER_ID, option: selected })
    toast('Vote submitted')
  }

  const winner = summary.stay
  const winnerVotes = summary.voteCounts[winner.id]
  const otherVotes = summary.voted - winnerVotes
  const result = summary.voteClosed
    ? {
        label: 'Group decision',
        title: `We're staying at the ${winner.name}`,
        detail: summary.isTie
          ? `Tied ${winnerVotes}–${otherVotes}, the organizer's vote decided`
          : `Chosen by ${winnerVotes} of ${summary.size} friends`,
      }
    : {
        label: `${summary.voted}/${summary.size} voted`,
        title: summary.isTie ? `It's a tie, ${winnerVotes}–${otherVotes}` : `${winner.name} is in the lead`,
        detail: summary.isTie
          ? `Waiting on ${summary.size - summary.voted} more. The organizer's vote breaks ties`
          : `${winnerVotes}–${otherVotes} so far · waiting on ${summary.size - summary.voted} more`,
      }

  return (
    <Screen
      footer={
        hasVoted ? (
          <Button onClick={() => go(me.paid ? 'dashboard' : 'pay')}>
            {me.paid ? 'Back to group' : `Continue to payment`}
          </Button>
        ) : (
          <>
            <Button onClick={submit} disabled={!selected}>Submit my vote</Button>
          </>
        )
      }
    >
      <ScreenTitle
        eyebrow="Group vote"
        title="Where should we stay?"
        subtitle="One vote each. Budgets stay private."
      />

      <VoteTimer closed={summary.voteClosed} deadline={summary.voteDeadline} />

      {hasVoted && (
        <div className="animate-fade-up rounded-3xl bg-brand-50 p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            {result.label}
          </p>
          <p className="mt-1 text-lg font-bold text-brand-700">{result.title}</p>
          <p className="mt-0.5 text-sm text-brand-600/80">{result.detail}</p>
        </div>
      )}

      <div className="space-y-3">
        {STAY_OPTIONS.map((option) => (
          <VotingOption
            key={option.id}
            option={option}
            selected={selected === option.id}
            onSelect={() => setSelected(option.id)}
            showResults={hasVoted}
            count={summary.voteCounts[option.id]}
            total={summary.voted}
            voters={summary.active.filter((m) => m.joined && m.vote === option.id)}
            isWinner={winner.id === option.id}
            decided={summary.voteClosed}
            budgetFit={summary.budgetFit[option.id]}
            myFit={me.budgetMax != null ? option.price <= me.budgetMax : null}
          />
        ))}
      </div>
    </Screen>
  )
}

function VoteTimer({ closed, deadline }) {
  if (closed)
    return (
      <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-100">
        <CheckCircle2 className="h-4 w-4" /> Voting closed · everyone voted
      </div>
    )
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-violet-50 px-4 py-3 ring-1 ring-violet-100">
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-violet-500" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-600">Voting closes in</p>
        <p className="text-xs text-violet-500">Before payment, so everyone pays the final price</p>
      </div>
      <span className="flex shrink-0 items-center gap-1 text-lg font-extrabold text-violet-700">
        <AlarmClock className="h-4 w-4" strokeWidth={2.5} />
        <Countdown deadline={deadline} />
      </span>
    </div>
  )
}
