import { Check, CreditCard } from 'lucide-react'
import Avatar from '../components/Avatar'
import { Button, Card, Screen } from '../components/ui'
import { TRIP } from '../data/mockData'
import { usd } from '../lib/format'
import { useDemo } from '../state/useDemo'

// Member: participation confirmed. Shows who's going and what happens next,
// not the trip again (that was on the invite and is on "my trip").
export default function MemberJoined() {
  const { state, summary, go } = useDemo()
  const joined = summary.active.filter((m) => m.joined)

  const steps = [
    { title: 'Joined the group', done: true },
    { title: 'Added your traveller details', done: true },
    { title: `Pay your share · ${usd(summary.share)}`, detail: `By ${state.group.deadlineLabel}`, next: true },
    { title: 'Book together', detail: `${summary.organizer.name} books once everyone has paid` },
  ]

  return (
    <Screen
      center
      footer={
        <>
          <Button onClick={() => go('pay')}>
            <CreditCard className="h-5 w-5" /> Pay my share · {usd(summary.share)}
          </Button>
          <button type="button" onClick={() => go('home')} className="w-full cursor-pointer py-1 text-sm font-semibold text-brand-600">
            Later · go to my trip
          </button>
        </>
      }
    >
      <div className="flex flex-col items-center text-center">
        <div className="grid h-16 w-16 animate-pop place-items-center rounded-full bg-brand-500 shadow-xl shadow-brand-500/30">
          <Check className="h-8 w-8 text-white" strokeWidth={3} />
        </div>
        <h1 className="mt-3 text-[28px] font-bold tracking-tight">You&apos;re in!</h1>
        <p className="text-sm text-muted">
          {TRIP.from.city} → {TRIP.to.city} · {TRIP.dates}
        </p>
      </div>

      <Card className="p-4">
        <div className="flex items-baseline justify-between">
          <p className="font-semibold">Who&apos;s going</p>
          <p className="text-sm font-semibold">
            {summary.joined}/{summary.size} <span className="font-normal text-muted">joined</span>
          </p>
        </div>
        <div className="mt-3 flex justify-between">
          {summary.active.map((m, i) => {
            const isIn = joined.includes(m)
            return (
              <div
                key={m.id}
                className={`flex w-12 animate-fade-up flex-col items-center gap-1 ${isIn ? '' : 'opacity-40'}`}
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <Avatar member={m} size="sm" done={isIn} />
                <span className="w-full truncate text-center text-[11px] font-medium text-muted">{m.name === summary.me.name ? 'You' : m.name}</span>
              </div>
            )
          })}
        </div>
      </Card>

      <Card className="p-4">
        <p className="font-semibold">What happens next</p>
        <ol className="mt-3">
          {steps.map((s, i) => {
            const last = i === steps.length - 1
            return (
              <li key={s.title} className="relative flex gap-3 pb-3 last:pb-0">
                {!last && <span className={`absolute bottom-0 left-[13px] top-7 w-0.5 ${s.done ? 'bg-brand-500' : 'bg-slate-200'}`} />}
                <span
                  className={`relative grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                    s.done ? 'bg-brand-500 text-white' : s.next ? 'bg-white text-brand-600 ring-2 ring-brand-500' : 'bg-slate-100 text-muted'
                  }`}
                >
                  {s.done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                </span>
                <div className={`min-w-0 flex-1 pt-0.5 ${s.next ? 'rounded-2xl bg-brand-50 px-3 py-2 -mt-1.5' : ''}`}>
                  <p className={`text-sm font-semibold ${s.done ? 'text-muted' : ''}`}>{s.title}</p>
                  {s.detail && <p className={`text-xs ${s.next ? 'text-brand-700' : 'text-muted'}`}>{s.detail}</p>}
                </div>
              </li>
            )
          })}
        </ol>
      </Card>
    </Screen>
  )
}
