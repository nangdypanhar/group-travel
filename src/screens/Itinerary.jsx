import { MapPin, Search, UsersRound } from 'lucide-react'
import TripCard from '../components/TripCard'
import { Button, Card, Screen } from '../components/ui'
import { TRIP } from '../data/mockData'
import { usd } from '../lib/format'
import { useDemo } from '../state/useDemo'

function SkylineScene() {
  return (
    <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="sg-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bcdcff" />
          <stop offset="1" stopColor="#ffe8cf" />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#sg-sky)" />
      <circle cx="78" cy="58" r="24" fill="#ffd27a" />
      <g fill="#a9c2e0">
        <rect x="14" y="98" width="22" height="60" />
        <rect x="40" y="82" width="16" height="76" />
        <rect x="298" y="86" width="20" height="72" />
        <rect x="322" y="102" width="28" height="56" />
        <rect x="354" y="74" width="18" height="84" />
        <rect x="376" y="96" width="24" height="62" />
      </g>
      {/* Three towers with a sky deck on top */}
      <g fill="#4f6f99">
        <path d="M182 158 L186 96 L198 96 L200 158Z" />
        <path d="M208 158 L210 96 L222 96 L226 158Z" />
        <path d="M234 158 L234 96 L246 96 L252 158Z" />
        <path d="M172 90 Q214 82 266 88 L266 95 L172 97Z" />
      </g>
      {/* Garden "supertrees" */}
      <g fill="#3f8f6b">
        <path d="M104 158 L108 126 L97 116 L123 116 L112 126 L116 158Z" />
        <path d="M134 158 L137 134 L128 126 L150 126 L141 134 L144 158Z" />
        <path d="M268 158 L271 130 L261 121 L285 121 L275 130 L278 158Z" />
      </g>
      <path d="M0 156 H400 V200 H0Z" fill="#3aaee0" />
      <path d="M0 168 Q100 162 200 168 T400 168 V200 H0Z" fill="#2c97cc" />
    </svg>
  )
}

// Trip.com-style starting point: the trip comes first, then it becomes a group trip.
export default function Itinerary() {
  const { go } = useDemo()

  return (
    <Screen
      footer={
        <>
          <Button onClick={() => go('places')}>
            <MapPin className="h-5 w-5" /> Plan our days
          </Button>
          <Button variant="ghost" onClick={() => go('create')}>
            <UsersRound className="h-4 w-4" /> Skip · Create Group Trip
          </Button>
        </>
      }
    >
      {/* Search summary, like the Trip.com results page */}
      <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-2.5 shadow-card">
        <Search className="h-4 w-4 shrink-0 text-brand-500" />
        <div className="min-w-0 flex-1 text-sm">
          <p className="truncate font-semibold">
            {TRIP.from.city} → {TRIP.to.city}
          </p>
          <p className="truncate text-xs text-muted">{TRIP.dates} · Group trip</p>
        </div>
        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-600">Selected</span>
      </div>

      <div className="h-36 overflow-hidden rounded-3xl">
        <SkylineScene />
      </div>

      <TripCard />

      <Card className="flex items-end justify-between">
        <div>
          <p className="text-sm text-muted">Group trip</p>
          <p className="mt-1 text-3xl font-extrabold tracking-tight">
            {usd(TRIP.price)}
            <span className="text-base font-semibold text-muted"> / person</span>
          </p>
        </div>
        <p className="text-right text-xs text-muted">
          Return flight
          <br />+ 20 kg baggage
        </p>
      </Card>

      <div className="flex gap-3 rounded-3xl bg-brand-50 p-4">
        <UsersRound className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
        <p className="text-sm leading-relaxed text-brand-700">
          <span className="font-semibold">Going with friends?</span> Pick places, get a day-by-day plan, then turn it into a Group Trip. Everyone pays their own share.
        </p>
      </div>
    </Screen>
  )
}
