import { CreditCard, FileText, Vote } from 'lucide-react'
import Avatar, { AvatarStack } from '../components/Avatar'
import DayPlan from '../components/DayPlan'
import TripCard from '../components/TripCard'
import { Button, Card, Screen } from '../components/ui'
import { MEMBER_ID } from '../data/mockData'
import { usd } from '../lib/format'
import { useDemo } from '../state/useDemo'

export default function Join() {
  const { state, summary, dispatch, go, toast } = useDemo()
  const { organizer } = summary
  const friends = state.members.filter((m) => m.id !== MEMBER_ID)

  const join = () => {
    dispatch({ type: 'JOIN', id: MEMBER_ID })
    toast(`You joined ${state.group.name}`)
    go('info')
  }

  const yourPart = [
    { Icon: FileText, title: 'Add your own details' },
    { Icon: CreditCard, title: `Pay only your share · ${usd(summary.share)}` },
    { Icon: Vote, title: 'Vote on group decisions' },
  ]

  return (
    <Screen footer={<Button onClick={join}>Join {state.group.name}</Button>}>
      <div className="flex flex-col items-center pt-2 text-center">
        <Avatar member={organizer} size="lg" />
        <p className="mt-3 text-sm text-muted">{organizer.name} invited you to</p>
        <h1 className="mt-1 text-[26px] font-bold tracking-tight">{state.group.name}</h1>
        <div className="mt-3 flex items-center gap-2">
          <AvatarStack members={friends} />
          <span className="text-xs font-medium text-muted">{friends.length} friends invited</span>
        </div>
      </div>

      <TripCard stay={summary.stay} />

      <DayPlan compact />

      <Card className="space-y-4">
        <p className="font-semibold">Your part of the trip</p>
        {yourPart.map(({ Icon, title }) => (
          <div key={title} className="flex items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <Icon className="h-4 w-4" />
            </div>
            <p className="text-sm font-semibold">{title}</p>
          </div>
        ))}
      </Card>
    </Screen>
  )
}
