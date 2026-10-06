import { AlarmClock, BedDouble, ShieldCheck, Users } from 'lucide-react'
import { Button, Card, Screen, ScreenTitle } from '../components/ui'
import { TRIP } from '../data/mockData'
import { usd } from '../lib/format'
import { deadlineIn } from '../state/demoState'
import { useDemo } from '../state/useDemo'

export default function CreateGroup() {
  const { state, dispatch, go } = useDemo()
  const { group } = state

  const create = () => {
    dispatch({ type: 'CREATE_GROUP', deadline: deadlineIn(group.deadlineInMinutes) })
    go('created')
  }

  const settings = [
    { Icon: Users, label: 'Number of travelers', value: `${group.travelers} travelers` },
    { Icon: BedDouble, label: 'Room arrangement', value: group.roomLabel },
    { Icon: AlarmClock, label: 'Payment deadline', value: group.deadlineLabel },
    { Icon: ShieldCheck, label: 'Group rules', value: 'Organizer-defined' },
  ]

  return (
    <Screen footer={<Button onClick={create}>Create Group Trip</Button>}>
      <ScreenTitle eyebrow="Set up" title="Create Group Trip" subtitle="One booking. Everyone pays their own share." />

      <div className="flex items-center justify-between rounded-2xl bg-ink px-4 py-3 text-white">
        <div>
          <p className="text-sm font-semibold">
            {TRIP.from.city} → {TRIP.to.city}
          </p>
          <p className="text-xs text-white/60">{TRIP.dates} · Flight + Hotel</p>
        </div>
        <span className="text-xs font-semibold text-white/60">
          {TRIP.from.code} → {TRIP.to.code}
        </span>
      </div>

      <Card className="divide-y divide-slate-100 p-0">
        {settings.map(({ Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3 px-5 py-4">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <Icon className="h-4 w-4" />
            </div>
            <p className="flex-1 text-sm text-muted">{label}</p>
            <p className="text-right text-sm font-semibold">{value}</p>
          </div>
        ))}
        <div className="flex flex-wrap gap-1.5 px-5 py-3">
          {group.rules.map((r) => (
            <span key={r} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-muted">
              {r}
            </span>
          ))}
        </div>
      </Card>

      <Card className="flex items-center justify-between">
        <p className="text-sm text-muted">Estimated price</p>
        <p className="text-2xl font-extrabold tracking-tight">
          {usd(TRIP.price)}
          <span className="text-sm font-semibold text-muted"> / person</span>
        </p>
      </Card>
    </Screen>
  )
}
