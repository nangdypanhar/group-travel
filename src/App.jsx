import AppShell from './components/AppShell'
import Confirmed from './screens/Confirmed'
import CreateGroup from './screens/CreateGroup'
import Dashboard from './screens/Dashboard'
import GroupReady from './screens/GroupReady'
import Invite from './screens/Invite'
import Itinerary from './screens/Itinerary'
import Join from './screens/Join'
import KeepTogether from './screens/KeepTogether'
import Landing from './screens/Landing'
import MemberHome from './screens/MemberHome'
import MemberInfo from './screens/MemberInfo'
import MemberJoined from './screens/MemberJoined'
import NewArrangement from './screens/NewArrangement'
import Payment from './screens/Payment'
import Places from './screens/Places'
import PlansChanged from './screens/PlansChanged'
import TripPlan from './screens/TripPlan'
import DemoProvider from './state/DemoProvider'
import { useDemo } from './state/useDemo'

const SCREEN_COMPONENTS = {
  organizer: {
    trip: Itinerary,
    places: Places,
    plan: TripPlan,
    create: CreateGroup,
    created: Invite,
    status: Dashboard,
    changed: PlansChanged,
    options: KeepTogether,
    arrangement: NewArrangement,
    ready: GroupReady,
    confirmed: Confirmed,
  },
  member: {
    invitation: Join,
    details: MemberInfo,
    joined: MemberJoined,
    home: MemberHome,
    pay: Payment,
  },
}

function CurrentScreen() {
  const { state } = useDemo()
  if (!state.role) return <Landing />
  const ScreenComponent = SCREEN_COMPONENTS[state.role][state.screens[state.role]]
  return <ScreenComponent />
}

export default function App() {
  return (
    <DemoProvider>
      <AppShell>
        <CurrentScreen />
      </AppShell>
    </DemoProvider>
  )
}
