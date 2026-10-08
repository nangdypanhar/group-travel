import { AlarmClock, CreditCard, FileText, Users } from 'lucide-react'
import Avatar, { AvatarStack } from '../components/Avatar'
import TripCard from '../components/TripCard'
import { Button, Card, Screen } from '../components/ui'
import { MEMBER_ID, TRIP } from '../data/mockData'
import { usd } from '../lib/format'
import { useDemo } from '../state/useDemo'

// Member: opens the invitation link.
export default function Join() {
  const { state, summary, dispatch, go } = useDemo()
  const { organizer, me } = summary
  const { group } = state
  const friends = state.members.filter((m) => m.id !== MEMBER_ID && !m.replacement)

  const join = () => {
    if (!me.joined) dispatch({ type: 'JOIN', id: MEMBER_ID })
    go('details')
  }

  const details = [
    { Icon: CreditCard, label: 'Group trip', value: `${usd(TRIP.price)} / person` },
    { Icon: AlarmClock, label: 'Payment deadline', value: group.deadlineLabel },
  ]

  return (
    <Screen footer={<Button onClick={join}>Join Group Trip</Button>}>
      <div className="flex flex-col items-center pt-2 text-center">
        <Avatar member={organizer} size="lg" />
        <p className="mt-3 text-sm text-muted">
          <span className="font-semibold text-ink">{organizer.name}</span> invited you to a group trip
        </p>
        <h1 className="mt-1 text-[26px] font-bold tracking-tight">
          {TRIP.from.city} → {TRIP.to.city}
        </h1>
        <p className="text-sm text-muted">{TRIP.dates}</p>
        <div className="mt-3 flex items-center gap-2">
          <AvatarStack members={friends} />
          <span className="text-xs font-medium text-muted">{group.travelers} travelers</span>
        </div>
      </div>

      <TripCard />

      <Card className="space-y-3">
        {details.map(({ Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3 text-sm">
            <Icon className="h-4 w-4 shrink-0 text-brand-500" />
            <span className="flex-1 text-muted">{label}</span>
            <span className="font-semibold">{value}</span>
          </div>
        ))}
      </Card>

      <div className="flex gap-3 rounded-3xl bg-brand-50 p-4 text-sm text-brand-700">
        <Users className="h-5 w-5 shrink-0" />
        <p>
          <span className="font-semibold">Your part:</span> add your own details <FileText className="inline h-3.5 w-3.5" /> and pay only
          your share.
        </p>
      </div>
    </Screen>
  )
}
