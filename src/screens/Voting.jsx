import { useState } from 'react'
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
  const resultText = summary.isTie
    ? `Tied. The organizer's vote decides: ${winner.name}`
    : `${winner.name} wins ${summary.voteCounts[winner.id]}–${summary.voted - summary.voteCounts[winner.id]}`

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

      {hasVoted && (
        <div className="animate-fade-up rounded-3xl bg-brand-50 p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            {summary.voteClosed ? 'Group decision' : `${summary.voted}/${summary.size} voted`}
          </p>
          <p className="mt-1 text-lg font-bold text-brand-700">{resultText}</p>
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
            budgetFit={summary.budgetFit[option.id]}
            myFit={me.budgetMax != null ? option.price <= me.budgetMax : null}
          />
        ))}
      </div>
    </Screen>
  )
}
