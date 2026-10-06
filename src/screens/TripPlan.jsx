import { Pencil, UsersRound } from 'lucide-react'
import ItineraryDays from '../components/ItineraryDays'
import { Button, Screen, ScreenTitle } from '../components/ui'
import { TRIP } from '../data/mockData'
import { buildItinerary } from '../lib/itinerary'
import { useDemo } from '../state/useDemo'

// Organizer: the generated day-by-day plan, then turn it into a Group Trip.
export default function TripPlan() {
  const { state, go } = useDemo()
  const days = buildItinerary(state.plan.placeIds)

  return (
    <Screen
      footer={
        <Button onClick={() => go('create')}>
          <UsersRound className="h-5 w-5" /> Create Group Trip &amp; invite
        </Button>
      }
    >
      <div className="flex items-start justify-between gap-3">
        <ScreenTitle
          eyebrow="Your trip plan"
          title={`${days.length} days in ${TRIP.to.city}`}
          subtitle={`${state.plan.placeIds.length} places · ${TRIP.dates}`}
        />
        <button
          type="button"
          onClick={() => go('places')}
          className="mt-1 inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-brand-600 shadow-card"
        >
          <Pencil className="h-3.5 w-3.5" /> Edit places
        </button>
      </div>

      <ItineraryDays days={days} />
    </Screen>
  )
}
