// All demo data lives here. Edit this file to change the story:
// people, roles, destination and prices. Every screen derives from it.

export const TRIP = {
  from: { city: 'Phnom Penh', code: 'PNH' },
  to: { city: 'Singapore', code: 'SIN' },
  emoji: '🇸🇬',
  dates: 'Dec 12 – Dec 16',
  nights: 4,
  // Trip package, per person, for the original group of 6.
  price: 520,
  flight: {
    depart: '08:15',
    arrive: '11:20',
    duration: '2h 05m',
    stops: 'Direct',
    cabin: 'Economy · 20 kg bag',
    returnDate: 'Dec 16',
    returnDepart: '19:40',
    perPerson: 210,
    // Shown in the flight details card (times are local).
    airline: 'Singapore Airlines',
    airlineCode: 'SQ',
    aircraft: 'Airbus A350-900',
    cabinClass: 'Economy',
    cabinBagKg: 7,
    checkedBagKg: 20,
    meal: 'Meal included',
    legs: [
      {
        id: 'out',
        label: 'Outbound',
        number: 'SQ 135',
        date: 'Sat, Dec 12',
        from: { code: 'PNH', time: '08:15', airport: 'Phnom Penh Intl', terminal: 'T1' },
        to: { code: 'SIN', time: '11:20', airport: 'Singapore Changi', terminal: 'T3' },
      },
      {
        id: 'back',
        label: 'Return',
        number: 'SQ 136',
        date: 'Wed, Dec 16',
        from: { code: 'SIN', time: '19:40', airport: 'Singapore Changi', terminal: 'T3' },
        to: { code: 'PNH', time: '20:45', airport: 'Phnom Penh Intl', terminal: 'T1' },
      },
    ],
  },
}

export const HOTELS = {
  main: { id: 'main', name: 'Marina Harbour Hotel', area: 'Marina Bay', rating: 4.6 },
  budget: { id: 'budget', name: 'Bugis Garden Inn', area: 'Bugis', rating: 4.3 },
}

// Places the organizer can pick for the day-by-day plan.
// `slot`: 'evening' best at night, 'full' takes a whole day, 'last' fits before the flight home.
export const PLACES = [
  { id: 'merlion', name: 'Merlion Park', area: 'Marina Bay', category: 'landmarks', duration: '1h', note: 'Classic photo stop by the bay' },
  { id: 'skypark', name: 'Marina Bay SkyPark', area: 'Marina Bay', category: 'landmarks', duration: '1–2h', note: 'Skyline views from 57 floors up' },
  { id: 'gardens', name: 'Gardens by the Bay', area: 'Marina Bay', category: 'nature', slot: 'evening', duration: '2–3h', note: 'Supertree light show at 19:45' },
  { id: 'sentosa', name: 'Sentosa & Universal Studios', area: 'Sentosa', category: 'fun', slot: 'full', duration: 'Full day', note: 'Rides, beaches and the cable car' },
  { id: 'chinatown', name: 'Chinatown', area: 'Chinatown', category: 'culture', duration: '2–3h', note: 'Buddha Tooth Relic Temple, street markets' },
  { id: 'maxwell', name: 'Maxwell Hawker Centre', area: 'Chinatown', category: 'food', duration: '1h', note: 'Famous Hainanese chicken rice' },
  { id: 'little-india', name: 'Little India', area: 'Little India', category: 'culture', duration: '2h', note: 'Temples, spice shops, Tekka Centre' },
  { id: 'kampong-glam', name: 'Kampong Glam & Haji Lane', area: 'Kampong Glam', category: 'culture', duration: '2h', note: 'Sultan Mosque, murals and cafés' },
  { id: 'orchard', name: 'Orchard Road', area: 'Orchard', category: 'shopping', duration: '3h', note: 'Malls and the main shopping street' },
  { id: 'night-safari', name: 'Night Safari', area: 'Mandai', category: 'nature', slot: 'evening', duration: '3h', note: 'The world’s first nocturnal zoo' },
  { id: 'clarke-quay', name: 'Clarke Quay', area: 'Riverside', category: 'nightlife', slot: 'evening', duration: '2h', note: 'River cruise and dinner by the water' },
  { id: 'jewel', name: 'Jewel Changi', area: 'Changi Airport', category: 'landmarks', slot: 'last', duration: '2h', note: 'Indoor waterfall before your flight' },
]

export const PLACE_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'landmarks', label: 'Landmarks' },
  { id: 'nature', label: 'Nature' },
  { id: 'culture', label: 'Culture' },
  { id: 'food', label: 'Food' },
  { id: 'fun', label: 'Fun' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'nightlife', label: 'Nightlife' },
]

export const MIN_PLACES = 3

// Shown to members when the organizer skipped picking places.
export const SUGGESTED_PLACE_IDS = ['merlion', 'skypark', 'gardens', 'sentosa', 'chinatown', 'maxwell', 'clarke-quay', 'jewel']

export const GROUP_DEFAULTS = {
  name: 'Singapore Squad 2026',
  travelers: 6,
  roomLabel: '3 rooms · 2 people/room',
  // Same arrangement, written like the options' rooms for side-by-side comparison.
  roomShort: '3 rooms (2+2+2)',
  deadlineLabel: 'Oct 15 · 8:00 PM',
  // How long is left on the payment deadline when the group is created (demo time).
  deadlineInMinutes: 18 * 60 + 32,
  extensionHours: 2,
  extensionLabel: 'Oct 15 · 10:00 PM',
  rules: ['Everyone pays their own share', 'Auto-reminders before the deadline', 'Organizer approves changes'],
}

// The travelers. Order is the order they appear in lists.
// Roles: 'organizer' creates the trip, 'me' is the member the demo follows,
// 'late' never pays and drops out, so the group has to adapt.
// `extras` are the add-ons each friend picks in their own traveller details.
export const PEOPLE = [
  { name: 'Boramey', role: 'organizer', extras: { extraBagKg: 0, insurance: 'basic' } },
  { name: 'Chesda', extras: { extraBagKg: 10, insurance: 'none' } },
  { name: 'Sengheng', extras: { extraBagKg: 0, insurance: 'plus' } },
  { name: 'Panhar', role: 'me' },
  { name: 'MengHeang', extras: { extraBagKg: 5, insurance: 'basic' } },
  { name: 'Tena', role: 'late', extras: { extraBagKg: 0, insurance: 'none' } },
]

// Joins from a new invite if the organizer chooses "Replace member".
export const REPLACEMENT_NAME = 'Dara'

// Ways to keep the trip going after one member drops (6 → 5 travelers).
// `share` is also what the trip recalculates to automatically.
export const CHANGE_OPTIONS = [
  {
    id: 'replace',
    title: 'Replace member',
    headline: 'Invite another traveler',
    effect: `${REPLACEMENT_NAME} takes the open spot. Original plan stays.`,
    travelers: 6,
    rooms: '3 rooms · 2 people/room',
    hotel: 'main',
    price: 520,
  },
  {
    id: 'repair',
    title: 'Re-pair rooms',
    headline: 'Adjust room assignments',
    effect: 'One room for 3, one room for 2. One less room to pay for.',
    travelers: 5,
    rooms: '2 rooms (3+2)',
    hotel: 'main',
    price: 530,
  },
  {
    id: 'share',
    title: 'Share the difference',
    headline: 'Remaining members cover the additional cost',
    effect: 'Same hotel and rooms. The extra cost is split by 5.',
    travelers: 5,
    rooms: '3 rooms (2+2+1)',
    hotel: 'main',
    price: 545,
  },
  {
    id: 'cheaper',
    title: 'Cheaper option',
    headline: 'Switch to a lower-cost hotel or room',
    effect: `${HOTELS.budget.name}, same dates. Price stays the same.`,
    travelers: 5,
    rooms: '3 rooms (2+2+1)',
    hotel: 'budget',
    price: 520,
  },
]
export const RECALC_OPTION_ID = 'share'

// ---- Everything below is derived from PEOPLE. No need to edit. ----

const AVATAR_COLORS = [
  'bg-sky-100 text-sky-700',
  'bg-emerald-100 text-emerald-700',
  'bg-rose-100 text-rose-700',
  'bg-amber-100 text-amber-700',
  'bg-violet-100 text-violet-700',
  'bg-teal-100 text-teal-700',
  'bg-indigo-100 text-indigo-700',
  'bg-orange-100 text-orange-700',
]

const toId = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
const idOfRole = (role) => toId(PEOPLE.find((p) => p.role === role).name)

export const ORGANIZER_ID = idOfRole('organizer')
export const MEMBER_ID = idOfRole('me')
export const LATE_PAYER_ID = idOfRole('late')

// Friends who join from the invite link (everyone but the organizer and "me").
export const JOIN_ORDER = PEOPLE.map((p) => toId(p.name)).filter((id) => id !== ORGANIZER_ID && id !== MEMBER_ID)

const blankMember = (name, i) => ({
  id: toId(name),
  name,
  color: AVATAR_COLORS[i % AVATAR_COLORS.length],
  joined: false,
  invited: false,
  info: false,
  paid: false,
  reminded: false,
  graceUntil: null,
  removed: false,
})

// Starting state: only the organizer is in, and nobody has added info or paid yet.
// Friends' extras are what they'll pick when they add their details ("me" picks live).
export const MEMBERS = PEOPLE.map((p, i) => ({ ...blankMember(p.name, i), joined: toId(p.name) === ORGANIZER_ID, infoData: p.extras }))

export const REPLACEMENT = { ...blankMember(REPLACEMENT_NAME, PEOPLE.length), replacement: true }

// Where everyone else stands once time has passed after the invite
// (everyone but "me" has joined and paid; "me" pays last to complete the group).
export const MEMBER_PROGRESS = Object.fromEntries(
  PEOPLE.map((p) => toId(p.name))
    .filter((id) => id !== MEMBER_ID)
    // For now Tena pays like everyone else (no late payer, no dropout in the demo).
    // .map((id) => [id, id === LATE_PAYER_ID ? { invited: true } : { invited: true, joined: true, info: true, paid: true }]),
    .map((id) => [id, { invited: true, joined: true, info: true, paid: true }]),
)

const nameOf = (id) => PEOPLE.find((p) => toId(p.name) === id).name


export const MEMBER_INFO_PREFILL = {
  firstName: nameOf(MEMBER_ID),
  lastName: 'Sok',
  idType: 'passport',
  idNumber: 'N04829157',
  idExpiry: '2031-06-30',
  nationality: 'Cambodian',
  dob: '1998-04-12',
  // Extra checked baggage on top of what the fare includes.
  extraBagKg: 0,
  insurance: 'none',
}

// ID documents a traveler can book with, like Trip.com's passenger form.
export const ID_TYPES = [
  { id: 'passport', label: 'Passport' },
  { id: 'national-id', label: 'National ID' },
]

// The fare includes `includedKg`; each extra kg is charged per person.
export const BAGGAGE = {
  includedKg: TRIP.flight.checkedBagKg,
  pricePerKg: 4,
  quickPicks: [0, 5, 10, 15, 20],
  maxExtraKg: 30,
}

// Optional travel insurance, paid by each traveler for themselves.
export const INSURANCE_PLANS = [
  { id: 'none', label: 'No insurance', detail: 'Travel without cover', price: 0 },
  { id: 'basic', label: 'Basic cover', detail: 'Medical + flight delay', price: 9 },
  { id: 'plus', label: 'Full cover', detail: 'Medical, cancellation, lost baggage', price: 19 },
]

export const PAYMENT_METHODS = [
  { id: 'aba', label: 'ABA Pay', detail: 'Linked account' },
  { id: 'visa', label: 'Visa •••• 4821', detail: 'Expires 08/29' },
]
