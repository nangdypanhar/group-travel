// All demo data lives here. Edit this file to change the story:
// people, roles, destination and prices. Every screen derives from it.

export const TRIP = {
  title: 'Bali Beach Escape',
  from: { city: 'Phnom Penh', code: 'PNH' },
  to: { city: 'Bali', code: 'DPS' },
  emoji: '🌴',
  dates: 'Dec 18–22, 2026',
  nights: 4,
  flight: {
    depart: '07:40',
    arrive: '15:25',
    duration: '6h 45m',
    stops: '1 stop · KUL',
    perPerson: 180,
  },
}

// Day-by-day plan shown on the itinerary. `icon`: arrive | nature | island | temple | depart
export const DAY_PLAN = [
  { day: 1, date: 'Dec 18', title: 'Arrive & sunset', icon: 'arrive', places: ['Airport pickup', 'Villa check-in', 'Double Six Beach'] },
  { day: 2, date: 'Dec 19', title: 'Ubud', icon: 'nature', places: ['Tegallalang Rice Terraces', 'Monkey Forest', 'Ubud Market'] },
  { day: 3, date: 'Dec 20', title: 'Nusa Penida', icon: 'island', places: ['Kelingking Beach', 'Broken Beach', 'Crystal Bay snorkel'] },
  { day: 4, date: 'Dec 21', title: 'Uluwatu', icon: 'temple', places: ['Padang Padang Beach', 'Uluwatu Temple', 'Kecak fire dance'] },
  { day: 5, date: 'Dec 22', title: 'Fly home', icon: 'depart', places: ['Villa breakfast', 'Seminyak shopping', 'Flight to PNH'] },
]

export const STAY_OPTIONS = [
  {
    id: 'villa',
    name: 'Beach Villa',
    fullName: 'Seminyak Beach Villa',
    area: 'Seminyak',
    price: 400,
    rating: 4.8,
    perks: ['Private pool', '2 min to beach', '3 bedrooms'],
  },
  {
    id: 'hotel',
    name: 'Central Hotel',
    fullName: 'Kuta Central Hotel',
    area: 'Kuta',
    price: 370,
    rating: 4.5,
    perks: ['Breakfast included', 'Walk to nightlife', '3 twin rooms'],
  },
]

export const DEFAULT_STAY_ID = 'villa'

export const GROUP_DEFAULTS = {
  name: 'Bali Squad 2026',
  minMembers: 4,
  deadlineHours: 24,
}

// The travelers. Order is the order they appear in lists.
// Roles: 'organizer' creates the trip, 'me' is the member the demo follows,
// 'late' is the one who hasn't paid yet (pays later, or misses the deadline).
// `budget`: private max per person. Never shown, only counted on vote options.
// "me" picks their own budget in the app.
export const PEOPLE = [
  { name: 'Boramey', role: 'organizer', budget: 450 },
  { name: 'Chesda', budget: 400 },
  { name: 'Sengheng', budget: 380 },
  { name: 'Panhar', role: 'me' },
  { name: 'MengHeang', budget: 500 },
  { name: 'Tena', role: 'late', budget: 380 },
]

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

// Starting state: only the organizer is in, and nobody has added info or paid yet.
// Friends join from the invite link, then do their own part while time passes.
export const MEMBERS = PEOPLE.map((p, i) => ({
  id: toId(p.name),
  name: p.name,
  color: AVATAR_COLORS[i % AVATAR_COLORS.length],
  joined: toId(p.name) === ORGANIZER_ID,
  invited: false,
  info: false,
  paid: false,
  vote: null,
  budgetMax: null,
}))

// Where everyone else stands by the time "me" opens the group dashboard:
// everyone has added their info, and everyone except "me" and the late payer has paid.
// With 6 people that's 4/6 paid, and "me" paying makes it 5/6.
// Stay votes are split so the first option leads by one before "me" votes.
const voters = JOIN_ORDER
export const MEMBER_PROGRESS = Object.fromEntries(
  PEOPLE.filter((p) => toId(p.name) !== MEMBER_ID).map((p) => {
    const id = toId(p.name)
    const paid = id !== LATE_PAYER_ID
    const vote = id === ORGANIZER_ID || voters.indexOf(id) < Math.ceil(voters.length / 2) ? 'villa' : 'hotel'
    return [id, { joined: true, info: true, paid, vote, budgetMax: p.budget ?? 450 }]
  }),
)

// Scripted replies from the other paid members in the keep-or-remove vote,
// keyed by how "me" votes, so the presenter can show either outcome.
// Keep → all keep except one. Remove → only the organizer keeps.
const paidOthers = Object.keys(MEMBER_PROGRESS).filter((id) => MEMBER_PROGRESS[id].paid)
export const KEEP_VOTE_SCRIPT = {
  keep: Object.fromEntries(paidOthers.map((id, i) => [id, i === paidOthers.length - 1 ? 'remove' : 'keep'])),
  remove: Object.fromEntries(paidOthers.map((id) => [id, id === ORGANIZER_ID ? 'keep' : 'remove'])),
}

export const MEMBER_INFO_PREFILL = {
  firstName: PEOPLE.find((p) => p.role === 'me').name,
  lastName: 'Sok',
  passport: 'N04829157',
  dob: '1998-04-12',
  baggage: '20kg',
}

export const BAGGAGE_OPTIONS = [
  { id: 'carry', label: 'Carry-on' },
  { id: '20kg', label: '+20 kg' },
  { id: '30kg', label: '+30 kg' },
]

export const BUDGET_RANGES = [
  { id: 'low', label: '$300–$350', min: 300, max: 350 },
  { id: 'mid', label: '$350–$450', min: 350, max: 450 },
  { id: 'high', label: '$450–$550', min: 450, max: 550 },
  { id: 'flex', label: 'Flexible', min: 0, max: Infinity },
]

export const PAYMENT_METHODS = [
  { id: 'aba', label: 'ABA Pay', detail: 'Linked account' },
  { id: 'visa', label: 'Visa •••• 4821', detail: 'Expires 08/29' },
]
