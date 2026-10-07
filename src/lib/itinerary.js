import { PLACES, SUGGESTED_PLACE_IDS, TRIP } from '../data/mockData'

const DATES = ['Dec 12', 'Dec 13', 'Dec 14', 'Dec 15', 'Dec 16']
const TIMES = { morning: '09:30', afternoon: '14:30', evening: '19:00' }

// Arrange the picked places into days. Simple rules, no AI:
// full-day places get their own day, evening places go to evenings,
// and places in the same area are kept on the same day.
export function buildItinerary(placeIds) {
  const places = PLACES.filter((p) => placeIds.includes(p.id))
  const last = DATES.length

  // Free time slots: arrival day afternoon + evening, full middle days, departure morning.
  const slots = DATES.flatMap((_, i) => {
    const day = i + 1
    const parts = day === 1 ? ['afternoon', 'evening'] : day === last ? ['morning'] : ['morning', 'afternoon', 'evening']
    return parts.map((part) => ({ day, part, place: null }))
  })
  const free = (fits) => slots.find((s) => !s.place && fits(s))
  const sameAreaDay = (p) => (s) => slots.some((o) => o.day === s.day && o.place?.area === p.area)

  const by = (slot) => places.filter((p) => (p.slot ?? 'any') === slot)
  by('last').forEach((p) => {
    const s = free((x) => x.day === last) ?? free(() => true)
    if (s) s.place = p
  })
  by('full').forEach((p) => {
    const day = [2, 3, 4].find((d) => slots.every((s) => s.day !== d || s.part === 'evening' || !s.place))
    if (!day) return
    slots.filter((s) => s.day === day && s.part !== 'evening').forEach((s) => {
      s.place = p
      s.continued = s.part === 'afternoon'
    })
  })
  by('evening').forEach((p) => {
    const s = free((x) => x.part === 'evening') ?? free(() => true)
    if (s) s.place = p
  })
  by('any').forEach((p) => {
    const daytime = (s) => s.part !== 'evening'
    const s = free((x) => daytime(x) && sameAreaDay(p)(x)) ?? free(daytime) ?? free(() => true)
    if (s) s.place = p
  })

  return DATES.map((date, i) => {
    const day = i + 1
    const items = slots
      .filter((s) => s.day === day && s.place && !s.continued)
      .map((s) => ({
        time: s.place.slot === 'last' ? '16:00' : day === 1 && s.part === 'afternoon' ? '15:00' : TIMES[s.part],
        kind: 'place',
        ...s.place,
        title: s.place.name,
      }))
    const areas = [...new Set(items.map((x) => x.area))]

    if (day === 1) {
      items.push({ time: TRIP.flight.arrive, kind: 'arrive', title: 'Land in Singapore', area: 'Changi Airport', note: `Direct flight from ${TRIP.from.city}` })
    }
    if (day === last) {
      items.push({ time: TRIP.flight.returnDepart, kind: 'depart', title: `Fly home to ${TRIP.from.city}`, area: 'Changi Airport' })
    }
    if (day !== 1 && day !== last && !areas.length) {
      items.push({ time: '10:00', kind: 'free', title: 'Free day', area: 'Anywhere', note: 'Rest, or explore on your own' })
    }
    items.sort((a, b) => a.time.localeCompare(b.time))

    const title = day === 1 ? `Arrive · ${areas[0] ?? 'Settle in'}` : day === last ? 'Fly home' : areas.length ? areas.slice(0, 2).join(' & ') : 'Free day'
    return { day, date, title, items }
  })
}

// The organizer's plan, or a suggested one if they skipped planning.
export const planDays = (plan) => buildItinerary(plan.generated ? plan.placeIds : SUGGESTED_PLACE_IDS)
