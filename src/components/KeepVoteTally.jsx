import { HandCoins, UserMinus } from 'lucide-react'
import { tallyKeepVote } from '../state/demoState'
import { AvatarStack } from './Avatar'
import { Card } from './ui'

// Live results of a keep-or-remove vote.
export default function KeepVoteTally({ vote, voters, members }) {
  const { keep, remove } = tallyKeepVote(vote.votes)
  const byId = (ids) => ids.map((id) => members.find((m) => m.id === id))
  const rows = [
    { label: 'Keep & help pay', ids: keep, Icon: HandCoins, bar: 'bg-brand-500', text: 'text-brand-600' },
    { label: 'Remove', ids: remove, Icon: UserMinus, bar: 'bg-rose-400', text: 'text-rose-500' },
  ]
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold">Votes</span>
        <span className="text-muted">
          {keep.length + remove.length}/{voters.length} paid members voted
        </span>
      </div>
      {rows.map(({ label, ids, Icon, bar, text }) => (
        <div key={label} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={`flex items-center gap-2 text-sm font-semibold ${text}`}>
              <Icon className="h-4 w-4" /> {label}
            </span>
            <div className="flex items-center gap-2">
              <AvatarStack members={byId(ids)} />
              <span key={ids.length} className="w-4 animate-pop text-right font-bold">
                {ids.length}
              </span>
            </div>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-500 ${bar}`}
              style={{ width: `${(ids.length / voters.length) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </Card>
  )
}
