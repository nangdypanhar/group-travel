import { CalendarDays, Moon, Users, UsersRound } from 'lucide-react'
import DayPlan from '../components/DayPlan'
import TripCard from '../components/TripCard'
import { Button, Card, Screen } from '../components/ui'
import { DEFAULT_STAY_ID, STAY_OPTIONS, TRIP } from '../data/mockData'
import { usd } from '../lib/format'
import { useDemo } from '../state/useDemo'

function BeachScene() {
  return (
    <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfe3ff" />
          <stop offset="1" stopColor="#fdf1dc" />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#sky)" />
      <circle cx="305" cy="70" r="30" fill="#ffd27a" />
      <path d="M0 128 Q100 116 200 128 T400 128 V200 H0Z" fill="#7fd0ef" />
      <path d="M0 146 Q100 136 200 146 T400 146 V200 H0Z" fill="#3aaee0" />
      <path d="M0 178 Q130 160 260 176 T400 170 V200 H0Z" fill="#f4dcae" />
      <path d="M78 182 Q86 130 108 88" stroke="#8a5a3b" strokeWidth="6" fill="none" strokeLinecap="round" />
      <g fill="#2f9e63">
        <path d="M108 88 Q82 72 56 86 Q84 80 108 92Z" />
        <path d="M108 88 Q130 62 160 72 Q132 76 109 92Z" />
        <path d="M108 88 Q104 58 84 48 Q101 66 105 90Z" />
        <path d="M108 88 Q138 88 152 110 Q130 94 107 92Z" />
        <path d="M108 88 Q80 94 68 114 Q88 98 109 92Z" />
      </g>
    </svg>
  )
}

export default function Itinerary() {
  const { go, toast, summary } = useDemo()
  const stay = STAY_OPTIONS.find((o) => o.id === DEFAULT_STAY_ID)

  return (
    <Screen
      footer={
        <>
          <Button onClick={() => go('create')}>
            <UsersRound className="h-5 w-5" /> Create Group Trip
          </Button>
          <button
            type="button"
            onClick={() => toast(`Old way: you front all ${usd(summary.total)}`)}
            className="w-full cursor-pointer py-1 text-xs font-medium text-muted hover:text-ink"
          >
            or pay {usd(summary.total)} alone
          </button>
        </>
      }
    >
      <div className="-mx-5 -mt-5 h-44 overflow-hidden">
        <BeachScene />
      </div>

      <div className="space-y-2">
        <h1 className="text-[26px] font-bold leading-tight tracking-tight">{TRIP.title}</h1>
        <p className="text-[15px] text-muted">
          {TRIP.from.city} → {TRIP.to.city}
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {[
            [CalendarDays, TRIP.dates],
            [Moon, `${TRIP.nights} nights`],
            [Users, `${summary.size} travelers`],
          ].map(([Icon, label]) => (
            <span key={label} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium shadow-card">
              <Icon className="h-3.5 w-3.5 text-brand-500" /> {label}
            </span>
          ))}
        </div>
      </div>

      <TripCard stay={stay} />

      <Card className="flex items-end justify-between">
        <div>
          <p className="text-sm text-muted">Flight + Hotel · {summary.size} travelers</p>
          <p className="mt-1 text-3xl font-extrabold tracking-tight">{usd(summary.total)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted">Per person</p>
          <p className="text-lg font-bold text-brand-600">≈ {usd(summary.share)}</p>
        </div>
      </Card>

      <DayPlan />

      <div className="flex gap-3 rounded-3xl bg-brand-50 p-4">
        <UsersRound className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
        <p className="text-sm leading-relaxed text-brand-700">
          <span className="font-semibold">Going with friends?</span> Everyone pays their own share.
        </p>
      </div>
    </Screen>
  )
}
