import { Send } from 'lucide-react'
import { GROUP_DEFAULTS, TRIP } from '../data/mockData'

const chat = `${GROUP_DEFAULTS.name} ${TRIP.emoji}`

// Simulated share targets. No real Telegram/Facebook integration.
export const CHANNELS = {
  telegram: { name: 'Telegram', chat, badge: 'bg-sky-500', mark: <Send className="h-5 w-5 -translate-x-px text-white" /> },
  facebook: { name: 'Messenger', chat, badge: 'bg-blue-600', mark: <span className="text-lg font-extrabold text-white">f</span> },
}

