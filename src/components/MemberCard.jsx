import Avatar from './Avatar'
import StatusBadge from './StatusBadge'

// One row in a member list. `status` is the badge(s), `action` sits on the right.
// `done` puts a check on the avatar (defaults to: has paid).
export default function MemberCard({ member, isMe, isOrganizer, status, action, done = member.paid && !member.removed }) {
  return (
    <div
      className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 transition ${isMe ? 'bg-brand-50' : ''} ${
        member.removed ? 'opacity-60' : ''
      }`}
    >
      <Avatar member={member} done={done} />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-[15px] font-semibold">
          {member.name}
          {isMe && <span className="text-xs font-medium text-brand-600">(You)</span>}
          {isOrganizer && <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-muted">Organizer</span>}
          {member.replacement && <span className="rounded-md bg-brand-50 px-1.5 py-0.5 text-[10px] font-semibold text-brand-600">New</span>}
        </p>
        <div className="mt-1 flex flex-wrap gap-1.5">{status}</div>
      </div>
      {action}
    </div>
  )
}

// Payment status as the organizer sees it. `deadlinePassed` flags unpaid members as at risk.
export function PaymentStatus({ member, deadlinePassed }) {
  if (member.removed) return <StatusBadge tone="removed">Dropped from the group</StatusBadge>
  if (member.paid) return <StatusBadge key="paid" tone="done">Paid</StatusBadge>
  return (
    <>
      {member.graceUntil ? (
        <StatusBadge key="ext" tone="extended">2-hour extension</StatusBadge>
      ) : deadlinePassed ? (
        <StatusBadge key="due" tone="due">Missed deadline</StatusBadge>
      ) : member.joined ? (
        <StatusBadge key="pending" tone="pending">Payment pending</StatusBadge>
      ) : (
        <StatusBadge key="invited" tone="invited">Invited</StatusBadge>
      )}
      {member.reminded && (
        <StatusBadge key="reminded" tone="reminded">
          Reminded
        </StatusBadge>
      )}
    </>
  )
}
