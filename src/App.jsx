import AppShell from './components/AppShell'
import Confirmed from './screens/Confirmed'
import CreateGroup from './screens/CreateGroup'
import Dashboard from './screens/Dashboard'
import DeadlineDecision from './screens/DeadlineDecision'
import GroupReady from './screens/GroupReady'
import Invite from './screens/Invite'
import Itinerary from './screens/Itinerary'
import Join from './screens/Join'
import KeepVote from './screens/KeepVote'
import MemberInfo from './screens/MemberInfo'
import Payment from './screens/Payment'
import Voting from './screens/Voting'
import DemoProvider from './state/DemoProvider'
import { useDemo } from './state/useDemo'

const SCREEN_COMPONENTS = {
  itinerary: Itinerary,
  create: CreateGroup,
  invite: Invite,
  join: Join,
  info: MemberInfo,
  dashboard: Dashboard,
  vote: Voting,
  pay: Payment,
  deadline: DeadlineDecision,
  keepVote: KeepVote,
  ready: GroupReady,
  confirmed: Confirmed,
}

function CurrentScreen() {
  const { state } = useDemo()
  const ScreenComponent = SCREEN_COMPONENTS[state.screen]
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
