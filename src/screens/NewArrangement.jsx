import { ArrowRight, CheckCircle2, Clock, Loader2, Send } from 'lucide-react'
import MemberCard, { PaymentStatus } from '../components/MemberCard'
import StatusBadge from '../components/StatusBadge'
import { Button, Caption, Card, Screen, ScreenTitle } from '../components/ui'
import { MEMBER_ID, ORGANIZER_ID } from '../data/mockData'
import { usd } from '../lib/format'
import { useDemo } from '../state/useDemo'

// Organizer: send the chosen arrangement to the group, and watch members confirm.
export default function NewArrangement() {
  const { state, summary, dispatch, go, toast } = useDemo()
  const { change } = state
  const { option, priceDiff } = summary
  const sent = change.status === 'confirming'
  const replacement = summary.active.find((m) => m.replacement)
  const waitingFor = summary.confirmers.filter((m) => !change.confirmed[m.id])

  const send = () => {
    dispatch({ type: 'SEND_ARRANGEMENT' })
    toast(`Sent to ${summary.confirmers.length - 1} members to confirm`)
  }

  let footer
  if (!sent)
    footer = (
      <>
        <Button onClick={send}>
          <Send className="h-4 w-4" /> Confirm New Arrangement
        </Button>
        <Button variant="ghost" onClick={() => go('options')}>
          Choose a different option
        </Button>
      </>
    )
  else if (!summary.arrangementDone)
    footer = (
      <>
        <Button disabled>
          <Loader2 className="h-5 w-5 animate-spin" /> Waiting for the group…
        </Button>
        <Caption>Each member confirms on their own phone</Caption>
      </>
    )
  else
    footer = (
      <Button onClick={() => go('ready')}>
        Continue to booking <ArrowRight className="h-4 w-4" />
      </Button>
    )

  return (
    <Screen footer={footer}>
      <ScreenTitle
        eyebrow="Group confirms"
        title="Confirm the new plan"
        subtitle={priceDiff > 0 ? 'Everyone staying agrees to the new price before booking.' : 'The price stays the same. The group still agrees before booking.'}
      />

      {/* Only the chosen plan. The before/after was on "Plans changed". */}
      <Card className="space-y-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-600">{option.title}</p>
          <p className="font-bold leading-snug">{option.headline}</p>
        </div>
        <div className="flex items-end justify-between border-t border-slate-100 pt-3">
          <div className="space-y-0.5 text-sm text-muted">
            <p>{summary.size} travelers · {summary.rooms}</p>
            <p>{summary.hotel.name}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-extrabold tracking-tight">{usd(summary.share)}</p>
            <p className={`whitespace-nowrap text-xs font-semibold ${priceDiff > 0 ? 'text-amber-700' : 'text-emerald-600'}`}>
              {priceDiff > 0 ? `+${usd(priceDiff)} / person` : 'No extra cost'}
            </p>
          </div>
        </div>
      </Card>

      <div>
        <div className="mb-2 flex items-center justify-between px-1">
          <h2 className="font-semibold">{sent ? 'Confirmations' : 'Needs to confirm'}</h2>
          {sent && (
            <span className="text-sm text-muted">
              {summary.confirmedCount}/{summary.confirmers.length} confirmed
            </span>
          )}
        </div>
        <Card className="space-y-1 p-2">
          {summary.confirmers.map((m) => (
            <MemberCard
              key={m.id}
              member={m}
              isMe={m.id === ORGANIZER_ID}
              isOrganizer={m.id === ORGANIZER_ID}
              done={Boolean(change.confirmed[m.id])}
              status={
                change.confirmed[m.id] ? (
                  <StatusBadge key="ok" tone="done">
                    Confirmed{summary.topUp ? ` · +${usd(summary.topUp)}` : ''}
                  </StatusBadge>
                ) : (
                  <StatusBadge key="wait" tone={sent ? 'pending' : 'invited'}>
                    {sent ? (m.id === MEMBER_ID ? 'Waiting on their phone' : 'Confirming…') : 'Needs to confirm'}
                  </StatusBadge>
                )
              }
            />
          ))}
          {replacement && <MemberCard member={replacement} status={<PaymentStatus member={replacement} />} />}
        </Card>
        {sent && waitingFor.length === 0 && summary.arrangementDone && (
          <p className="mt-3 flex animate-fade-up items-center justify-center gap-1.5 text-sm font-semibold text-emerald-600">
            <CheckCircle2 className="h-4 w-4" /> The group agreed. Booking can continue.
          </p>
        )}
        {!sent && (
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
            <Clock className="h-3.5 w-3.5" /> Nobody is charged until they confirm
          </p>
        )}
      </div>
    </Screen>
  )
}
