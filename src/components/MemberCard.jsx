import { ChevronRight } from 'lucide-react'
import { usd } from '../lib/format'
import { isMemberComplete } from '../state/demoState'
import Avatar from './Avatar'
import StatusBadge from './StatusBadge'

// `covering`: [{ name, amount }] this member is paying toward others' spots.
// `status` replaces the progress badges (e.g. the organizer on the invite screen).
// `onClick` makes the card tappable (used for unpaid members on the dashboard).
export default function MemberCard({ member, isMe, isOrganizer, covering = [], status, onClick }) {
  const complete = isMemberComplete(member)
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition ${isMe ? 'bg-brand-50' : ''} ${
        member.removed ? 'opacity-60' : ''
      } ${onClick ? 'cursor-pointer ring-1 ring-amber-200 hover:bg-amber-50' : ''}`}
    >
      <Avatar member={member} done={complete} />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-[15px] font-semibold">
          {member.name}
          {isMe && <span className="text-xs font-medium text-brand-600">(You)</span>}
          {isOrganizer && <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-muted">Organizer</span>}
        </p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {status ? (
            status
          ) : member.removed ? (
            <StatusBadge tone="removed">Removed · missed deadline</StatusBadge>
          ) : member.joined ? (
            <>
              <StatusBadge key={`info-${member.info}`} tone={member.info ? 'done' : 'pending'}>
                {member.info ? 'Information' : 'Information pending'}
              </StatusBadge>
              {member.coveredBy ? (
                <StatusBadge tone="cover">Covered by {Object.keys(member.coveredBy).length === 1 ? '1 friend' : `${Object.keys(member.coveredBy).length} friends`}</StatusBadge>
              ) : (
                <StatusBadge key={`pay-${member.paid}`} tone={member.paid ? 'done' : 'pending'}>
                  {member.paid ? 'Paid' : 'Not yet paid'}
                </StatusBadge>
              )}
              {member.reminded && !complete && (
                <StatusBadge key="reminded" tone="reminded">
                  Auto-reminded
                </StatusBadge>
              )}
              {covering.map((c) => (
                <StatusBadge key={c.name} tone="cover">
                  Covering {c.name} · {usd(c.amount)}
                </StatusBadge>
              ))}
            </>
          ) : (
            <StatusBadge tone="invited">{member.invited ? 'Invited' : 'Not invited yet'}</StatusBadge>
          )}
        </div>
      </div>
      {onClick && <ChevronRight className="h-5 w-5 shrink-0 text-amber-400" />}
    </Tag>
  )
}
