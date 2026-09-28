import { HandCoins, UserMinus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Avatar from '../components/Avatar'
import KeepVoteTally from '../components/KeepVoteTally'
import { Button, Caption, Card, Screen, ScreenTitle } from '../components/ui'
import { KEEP_VOTE_SCRIPT, MEMBER_ID } from '../data/mockData'
import { usd } from '../lib/format'
import { keepVoters, splitAmount, tallyKeepVote } from '../state/demoState'
import { useDemo } from '../state/useDemo'

const VOTE_DELAY = 700

// Member's view: paid members vote to keep (and help pay) or remove an unpaid member.
export default function KeepVote() {
  const { state, summary, dispatch, go, toast } = useDemo()
  const vote = state.keepVote
  const [choice, setChoice] = useState(vote?.votes[MEMBER_ID] ?? null)
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  if (!vote) {
    return (
      <Screen footer={<Button onClick={() => go('dashboard')}>Back to group</Button>}>
        <ScreenTitle title="No vote open" subtitle="Nothing to vote on yet." />
      </Screen>
    )
  }

  const target = state.members.find((m) => m.id === vote.targetId)
  const voters = keepVoters(state, vote.targetId)
  const owed = summary.share
  const myVote = vote.votes[MEMBER_ID]
  const { keep } = tallyKeepVote(vote.votes)

  const submit = () => {
    dispatch({ type: 'CAST_KEEP_VOTE', voterId: MEMBER_ID, choice })
    // The other paid members' votes arrive one by one (scripted for the demo).
    const finalVotes = { ...vote.votes, [MEMBER_ID]: choice }
    const others = voters.filter((v) => !finalVotes[v.id])
    others.forEach((v, i) => {
      finalVotes[v.id] = KEEP_VOTE_SCRIPT[choice][v.id] ?? 'keep'
      const c = finalVotes[v.id]
      timers.current.push(
        setTimeout(() => dispatch({ type: 'CAST_KEEP_VOTE', voterId: v.id, choice: c }), VOTE_DELAY * (i + 1)),
      )
    })
    timers.current.push(setTimeout(() => resolve(finalVotes), VOTE_DELAY * (others.length + 1)))
  }

  const resolve = (finalVotes) => {
    const result = tallyKeepVote(finalVotes)
    if (result.keepWins) {
      dispatch({ type: 'COVER_MEMBER', id: target.id, contributions: splitAmount(owed, result.keep) })
      dispatch({ type: 'SET_KEEP_VOTE_STATUS', status: 'kept' })
      toast(`${target.name} stays. ${result.keep.length} members split ${usd(owed)}`)
    } else {
      dispatch({ type: 'SET_KEEP_VOTE_STATUS', status: 'awaiting-organizer' })
      toast(`${summary.organizer.name} was alerted to confirm removing ${target.name}`)
    }
  }

  const perKeeper = keep.length ? usd(Math.round((owed / keep.length) * 100) / 100) : null

  let footer
  if (!myVote) footer = <Button onClick={submit} disabled={!choice}>Submit my vote</Button>
  else if (vote.status === 'open') footer = <Button disabled>Waiting for votes…</Button>
  else if (vote.status === 'awaiting-organizer')
    footer = (
      <>
        <Button onClick={() => go('deadline')}>Open {summary.organizer.name}&apos;s alert</Button>
      </>
    )
  else footer = <Button onClick={() => go('dashboard')}>Back to group</Button>

  return (
    <Screen footer={footer}>
      <ScreenTitle
        eyebrow="Payment deadline passed"
        title={`Keep ${target.name} on the trip?`}
        subtitle={`${target.name} missed the deadline. ${usd(owed)} unpaid.`}
      />

      {!myVote ? (
        <div className="space-y-3">
          <Option
            selected={choice === 'keep'}
            onClick={() => setChoice('keep')}
            Icon={HandCoins}
            title={`Keep ${target.name}`}
            text={`I'll help pay ${usd(owed)}`}
          />
          <Option
            selected={choice === 'remove'}
            onClick={() => setChoice('remove')}
            Icon={UserMinus}
            title={`Remove ${target.name}`}
            text={`Bill drops by ${usd(owed)}`}
            danger
          />
        </div>
      ) : (
        <KeepVoteTally vote={vote} voters={voters} members={state.members} />
      )}

      {vote.status === 'open' && myVote && keep.length > 0 && (
        <Caption>
          If Keep wins: {usd(owed)} ÷ {keep.length} = {perKeeper} each
        </Caption>
      )}

      {vote.status === 'kept' && target.coveredBy && (
        <Card className="animate-fade-up space-y-3 border-brand-100">
          <div className="flex items-center gap-3">
            <Avatar member={target} done />
            <p className="text-sm font-semibold">
              {target.name} stays. {Object.keys(target.coveredBy).length} members split {usd(owed)}
            </p>
          </div>
          <div className="space-y-1.5 rounded-2xl bg-brand-50 p-3 text-sm">
            {Object.entries(target.coveredBy).map(([id, amount]) => (
              <div key={id} className="flex justify-between">
                <span className="text-muted">
                  {state.members.find((m) => m.id === id).name}
                  {id === MEMBER_ID && ' (You)'}
                </span>
                <span className="font-semibold">+{usd(amount)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {vote.status === 'awaiting-organizer' && (
        <div className="flex animate-fade-up gap-3 rounded-3xl bg-rose-50 p-4 text-sm text-rose-700">
          <UserMinus className="h-5 w-5 shrink-0" />
          <p>
            <span className="font-semibold">Majority voted remove.</span> {summary.organizer.name} decides.
          </p>
        </div>
      )}
    </Screen>
  )
}

function Option({ selected, onClick, Icon, title, text, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full cursor-pointer items-center gap-4 rounded-3xl border-2 bg-white p-4 text-left shadow-card transition ${
        selected ? (danger ? 'border-rose-400' : 'border-brand-500') : 'border-transparent'
      }`}
    >
      <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${danger ? 'bg-rose-50 text-rose-500' : 'bg-brand-50 text-brand-600'}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="font-bold">{title}</p>
        <p className="text-xs text-muted">{text}</p>
      </div>
    </button>
  )
}
