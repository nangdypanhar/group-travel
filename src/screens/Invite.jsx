import { ArrowRight, Copy, PartyPopper, Send } from 'lucide-react'
import { useState } from 'react'
import ShareModal from '../components/ShareModal'
import { CHANNELS } from '../components/shareChannels'
import Ticket, { TicketFields, TicketRoute } from '../components/Ticket'
import { Button, Caption, Card, Screen, ScreenTitle } from '../components/ui'
import { TRIP } from '../data/mockData'
import { groupLink, usd } from '../lib/format'
import { useDemo } from '../state/useDemo'

// Organizer: the group exists, now share one link with friends.
export default function Invite() {
  const { state, dispatch, go, toast } = useDemo()
  const [channel, setChannel] = useState(null)
  const { group } = state
  const link = groupLink(group.name)

  const send = (name) => {
    setChannel(null)
    dispatch({ type: 'SHARE_INVITE' })
    toast(`Invite sent to ${name}`)
  }

  const copyLink = () => {
    navigator.clipboard?.writeText(`https://${link}`).catch(() => {})
    send('your clipboard')
  }

  return (
    <Screen
      footer={
        group.shared ? (
          <>
            <Button onClick={() => go('status')}>
              View group status <ArrowRight className="h-4 w-4" />
            </Button>
            <Caption>Friends join from the link on their own phones</Caption>
          </>
        ) : (
          <Button onClick={() => setChannel('telegram')}>
            <Send className="h-4 w-4" /> Share Invitation
          </Button>
        )
      }
    >
      <ScreenTitle
        eyebrow="Group created"
        title={
          <span className="flex items-center gap-2">
            Your group trip is ready <PartyPopper className="h-6 w-6 text-amber-500" />
          </span>
        }
      />

      <Ticket
        top={
          <>
            <TicketRoute label={group.name} />
            <TicketFields fields={[['Travelers', group.travelers], ['Rooms', '3 × 2 people'], ['Price', `${usd(TRIP.price)}/pp`]]} />
          </>
        }
      >
        <div className="flex items-center justify-between">
          <span className="text-muted">Payment deadline</span>
          <span className="font-semibold">{group.deadlineLabel}</span>
        </div>
      </Ticket>

      <Card className="space-y-4">
        <p className="font-semibold">Invitation link</p>
        <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3">
          <span className="flex-1 truncate text-sm font-medium">{link}</span>
          <button type="button" onClick={copyLink} className="cursor-pointer text-sm font-semibold text-brand-600">
            Copy
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(CHANNELS).map(([id, c]) => (
            <ShareButton key={id} label={c.name} badge={c.badge} onClick={() => setChannel(id)}>
              {c.mark}
            </ShareButton>
          ))}
          <ShareButton label="Copy link" badge="bg-slate-700" onClick={copyLink}>
            <Copy className="h-5 w-5 text-white" />
          </ShareButton>
        </div>
      </Card>

      {channel && (
        <ShareModal
          channel={channel}
          group={{ name: group.name, link }}
          share={TRIP.price}
          onClose={() => setChannel(null)}
          onSend={() => send(CHANNELS[channel].chat)}
        />
      )}
    </Screen>
  )
}

function ShareButton({ label, badge, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl py-3 transition hover:bg-slate-50"
    >
      <span className={`grid h-11 w-11 place-items-center rounded-full ${badge}`}>{children}</span>
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}
