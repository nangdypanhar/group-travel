import { AlarmClock, Vote } from 'lucide-react'
import { usd } from '../lib/format'
import Avatar from './Avatar'
import BottomSheet from './BottomSheet'
import StatusBadge from './StatusBadge'
import { Button, Caption } from './ui'

// Details for a member who hasn't paid, with the organizer's group-vote action.
// Shown after the payment deadline for a member who didn't pay.
export default function UnpaidSheet({ member, owed, organizer, onClose, onStartVote }) {
  return (
    <BottomSheet
      title={`${member.name} didn't pay`}
      subtitle="Missed the payment deadline"
      icon={<Avatar member={member} />}
      onClose={onClose}
    >
      <div className="mb-3 flex items-center gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
        <AlarmClock className="h-4 w-4 shrink-0" /> Payment deadline passed
      </div>
      <div className="rounded-3xl bg-slate-50 p-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted">Unpaid share</span>
          <span className="text-2xl font-extrabold">{usd(owed)}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <StatusBadge tone={member.info ? 'done' : 'pending'}>{member.info ? 'Information' : 'Information pending'}</StatusBadge>
          <StatusBadge tone="removed">Not paid</StatusBadge>
          {member.reminded && <StatusBadge tone="reminded">Auto-reminded</StatusBadge>}
        </div>
      </div>

      <Button className="mt-5" onClick={onStartVote}>
        <Vote className="h-5 w-5" /> Start group vote
      </Button>
      <Caption>
        Sent by {organizer.name}, the organizer. Paid members vote.
      </Caption>
    </BottomSheet>
  )
}
