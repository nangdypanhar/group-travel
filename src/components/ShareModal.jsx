import { Link2, Send } from 'lucide-react'
import { JOIN_ORDER, MEMBERS, TRIP } from '../data/mockData'
import { usd } from '../lib/format'
import BottomSheet from './BottomSheet'
import { CHANNELS } from './shareChannels'
import { Button } from './ui'

const friend = MEMBERS.find((m) => m.id === JOIN_ORDER[0])

// Simulated share sheet.
export default function ShareModal({ channel, group, share, onClose, onSend }) {
  const c = CHANNELS[channel]
  return (
    <BottomSheet
      tall
      title={`Share to ${c.name}`}
      subtitle={`To: ${c.chat}`}
      icon={<div className={`grid h-10 w-10 place-items-center rounded-full ${c.badge}`}>{c.mark}</div>}
      onClose={onClose}
    >
      <div className="flex flex-1 flex-col justify-end gap-3 rounded-3xl bg-slate-50 p-4">
        <div className="max-w-[75%] rounded-2xl rounded-bl-md bg-white p-3 text-sm shadow-card">
          <p className="text-xs font-semibold text-brand-600">{friend.name}</p>
          <p>So are we doing {TRIP.to.city} or not? 😅</p>
        </div>
        <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-brand-500 p-3 text-sm text-white">
          <p>{TRIP.to.city} trip is ON {TRIP.emoji} Join, add your details and pay your own share here 👇</p>
          <div className="mt-2 overflow-hidden rounded-xl bg-white text-ink">
            <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2 text-xs text-muted">
              <Link2 className="h-3.5 w-3.5" /> {group.link}
            </div>
            <div className="px-3 py-2">
              <p className="font-semibold">{group.name}</p>
              <p className="text-xs text-muted">{TRIP.from.city} → {TRIP.to.city} · {TRIP.dates} · {usd(share)}/person</p>
            </div>
          </div>
        </div>
      </div>

      <Button className="mt-5" onClick={onSend}>
        <Send className="h-4 w-4" /> Send to group chat
      </Button>
    </BottomSheet>
  )
}
