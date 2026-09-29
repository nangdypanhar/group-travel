import { ArrowRight, Copy, PartyPopper, Send } from 'lucide-react'
import { useState } from 'react'
import MemberCard from '../components/MemberCard'
import ShareModal from '../components/ShareModal'
import StatusBadge from '../components/StatusBadge'
import { CHANNELS } from '../components/shareChannels'
import { Button, Caption, Card, Screen, ScreenTitle } from '../components/ui'
import { MEMBER_ID, ORGANIZER_ID } from '../data/mockData'
import { groupLink } from '../lib/format'
import { useDemo } from '../state/useDemo'

export default function Invite() {
  const { state, summary, dispatch, go, toast } = useDemo()
  const [channel, setChannel] = useState(null)
  const shared = state.members.some((m) => m.invited)

  const send = (name) => {
    setChannel(null)
    dispatch({ type: 'INVITE_ALL' })
    toast(`Invite sent to ${name}`)
  }

  const copyLink = () => {
    navigator.clipboard?.writeText(`https://${groupLink(state.group.name)}`).catch(() => {})
    send('your clipboard')
  }

  const link = groupLink(state.group.name)
  const me = state.members.find((m) => m.id === MEMBER_ID)

  return (
    <Screen
      footer={
        <>
          <Button onClick={() => go('join')} disabled={!shared}>
            Open {me.name}&apos;s invite <ArrowRight className="h-4 w-4" />
          </Button>
          {!shared && <Caption>Share the link first</Caption>}
        </>
      }
    >
      <ScreenTitle
        eyebrow="Step 2"
        title={
          <span className="flex items-center gap-2">
            {state.group.name} is live <PartyPopper className="h-6 w-6 text-amber-500" />
          </span>
        }
        subtitle="Share one link. Everyone handles their own part."
      />

      <Card className="space-y-4">
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

      <div className="flex items-center justify-between px-1 pt-1">
        <h2 className="font-semibold">Who&apos;s in</h2>
        <span className="text-sm text-muted">
          {summary.joined}/{summary.size} joined
        </span>
      </div>
      <Card className="space-y-1 p-2">
        {state.members.map((m) => (
          <MemberCard
            key={`${m.id}-${m.invited}`}
            member={m}
            isOrganizer={m.id === ORGANIZER_ID}
            isMe={m.id === ORGANIZER_ID}
            status={m.id === ORGANIZER_ID && <StatusBadge tone="done">Created the trip</StatusBadge>}
          />
        ))}
      </Card>
      {shared && (
        <p className="flex animate-fade-up items-center justify-center gap-1.5 text-sm text-muted">
          <Send className="h-3.5 w-3.5" />
          {me.name} just opened the link…
        </p>
      )}

      {channel && (
        <ShareModal
          channel={channel}
          group={{ name: state.group.name, link }}
          share={summary.share}
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
