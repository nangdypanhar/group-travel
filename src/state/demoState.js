import {
  CHANGE_OPTIONS,
  GROUP_DEFAULTS,
  HOTELS,
  LATE_PAYER_ID,
  MEMBER_ID,
  MEMBER_INFO_PREFILL,
  MEMBER_PROGRESS,
  MEMBERS,
  ORGANIZER_ID,
  RECALC_OPTION_ID,
  REPLACEMENT,
  TRIP,
} from '../data/mockData'
import { getExtras } from '../lib/extras'

export const MINUTE = 60 * 1000
export const HOUR = 60 * MINUTE

export const PHASES = ['Plan', 'Join', 'Confirm & Pay', 'Handle Changes', 'Book']

export const ROLES = {
  organizer: { label: 'Organizer', viewerId: ORGANIZER_ID, start: 'trip', steps: ['Plan', 'Invite', 'Collect', 'Book'] },
  member: { label: 'Member', viewerId: MEMBER_ID, start: 'invitation', steps: ['Join', 'Traveller details', 'Pay'] },
}

// Roles that can be picked in the sidebar and the header menu.
// Hidden for now: the organizer, so the demo only shows the member. Add 'organizer' back to bring it back.
export const VISIBLE_ROLES = ['member']

// Each role has its own screens. `doing` is shown in the presenter's side panel.
// `step` indexes the role's own `steps` (the progress bar under the header).
export const SCREENS = {
  organizer: [
    { id: 'trip', label: 'Select a trip', phase: 0, step: 0, doing: 'Picks a Trip.com trip for the group' },
    { id: 'places', label: 'Pick places', phase: 0, step: 0, doing: 'Picks the places the group wants to see' },
    { id: 'plan', label: 'Day-by-day plan', phase: 0, step: 0, doing: 'Gets a day-by-day plan to share' },
    { id: 'create', label: 'Create Group Trip', phase: 0, step: 0, doing: 'Sets travelers, rooms and a deadline' },
    { id: 'created', label: 'Share invitation', phase: 1, step: 1, doing: 'Shares one invite link with friends' },
    { id: 'status', label: 'Group status', phase: 2, step: 2, doing: 'Spots payment risk before the deadline' },
    { id: 'changed', label: 'Plans changed', phase: 3, step: 2, doing: 'Sees the impact of one member dropping' },
    { id: 'options', label: 'Keep the trip together', phase: 3, step: 2, doing: 'Picks a way to continue' },
    { id: 'arrangement', label: 'Group confirms', phase: 3, step: 2, doing: 'Asks the group to confirm the new plan' },
    { id: 'ready', label: 'Ready to book', phase: 4, step: 3, doing: 'Books for the whole group' },
    { id: 'confirmed', label: 'Trip confirmed', phase: 4, step: 3, doing: 'Booked together. Nobody carried the trip' },
  ],
  member: [
    { id: 'invitation', label: 'Open invitation', phase: 1, step: 0, doing: 'Opens the invite link' },
    { id: 'details', label: 'Traveller details', phase: 1, step: 1, doing: 'Adds their own details' },
    { id: 'joined', label: "You're in", phase: 1, step: 2, doing: 'Confirms they are going' },
    { id: 'home', label: 'Your group trip', phase: 2, step: 2, doing: 'Sees their own share and deadline' },
    { id: 'pay', label: 'Pay your share', phase: 2, step: 2, doing: 'Pays only their own share' },
  ],
}

export const deadlineIn = (minutes, now = Date.now()) => now + minutes * MINUTE
const startDeadline = () => deadlineIn(GROUP_DEFAULTS.deadlineInMinutes)

// Time-skip: once "me" has joined (or the organizer checks the group),
// the rest of the group has had time to join and pay. Applied once per run.
function catchUp(state) {
  if (state.caughtUp) return state
  return {
    ...state,
    caughtUp: true,
    members: state.members.map((m) => ({ ...m, ...MEMBER_PROGRESS[m.id] })),
  }
}

// Demo scenarios: in 'everyone-pays' reminders get every member to pay;
// in 'dropout' the late member never pays and the group has to adapt.
export const SCENARIOS = {
  'everyone-pays': 'Everyone pays',
  dropout: 'Someone drops out',
}

export function createInitialState(runId = 0, scenario = 'everyone-pays') {
  return {
    scenario,
    // null shows the role picker. For now the demo opens straight on the member's invitation.
    // role: null,
    role: 'member',
    // Each role keeps its own place, so the presenter can switch back and forth.
    // For now the demo starts on the member's side, so the organizer has already shared the invite
    // and opens on the group status. (Was: organizer: ROLES.organizer.start)
    screens: { organizer: 'status', member: ROLES.member.start },
    // Screens each role came from, for the back button.
    history: { organizer: [], member: [] },
    runId,
    // group: { ...GROUP_DEFAULTS, created: false, shared: false },
    group: { ...GROUP_DEFAULTS, created: true, shared: true },
    // Places picked for the day-by-day plan; `generated` once the plan was built.
    plan: { placeIds: [], generated: false },
    deadline: startDeadline(),
    // members: MEMBERS.map((m) => ({ ...m })),
    members: MEMBERS.map((m) => ({ ...m, invited: true })),
    caughtUp: false,
    // When a member drops: { droppedId, reason: 'unpaid' | 'left', optionId, status: 'choosing' | 'confirming', confirmed: { [id]: true } }
    change: null,
    booked: false,
    toast: null,
  }
}

const updateMember = (state, id, changes) => ({
  ...state,
  members: state.members.map((m) => (m.id === id ? { ...m, ...changes } : m)),
})

export function demoReducer(state, action) {
  switch (action.type) {
    // Several actions as one step (used by the simulated group).
    case 'BATCH':
      return action.actions.reduce(demoReducer, state)
    // Once the group has made progress (people joined or paid, or someone dropped),
    // the other scenario can't play out from here, so start a clean run.
    case 'SET_SCENARIO':
      if (action.scenario === state.scenario) return state
      return state.caughtUp || state.change
        ? createInitialState(state.runId + 1, action.scenario)
        : { ...state, scenario: action.scenario }
    case 'SET_ROLE':
      return { ...state, role: action.role }
    case 'GO': {
      const role = action.role ?? state.role
      const from = state.screens[role]
      const history = from === action.screen ? state.history : { ...state.history, [role]: [...state.history[role], from] }
      const next = { ...state, role, history, screens: { ...state.screens, [role]: action.screen } }
      return action.screen === 'status' ? catchUp(next) : next
    }
    // Back to the previous screen of this role. (Role picker is disabled for now, so the first screen stays put.)
    case 'BACK': {
      const stack = state.history[state.role]
      // if (!stack.length) return { ...state, role: null }
      if (!stack.length) return state
      return {
        ...state,
        screens: { ...state.screens, [state.role]: stack[stack.length - 1] },
        history: { ...state.history, [state.role]: stack.slice(0, -1) },
      }
    }
    case 'TOGGLE_PLACE': {
      const { placeIds } = state.plan
      const next = placeIds.includes(action.id) ? placeIds.filter((id) => id !== action.id) : [...placeIds, action.id]
      return { ...state, plan: { ...state.plan, placeIds: next } }
    }
    case 'GENERATE_PLAN':
      return { ...state, plan: { ...state.plan, generated: true } }
    case 'CREATE_GROUP':
      return { ...state, group: { ...state.group, created: true }, deadline: action.deadline }
    case 'SHARE_INVITE':
      return {
        ...state,
        group: { ...state.group, created: true, shared: true },
        members: state.members.map((m) => ({ ...m, invited: true })),
      }
    case 'JOIN':
      return updateMember(state, action.id, { invited: true, joined: true })
    case 'SUBMIT_INFO':
      return catchUp(updateMember(state, action.id, { info: true, infoData: action.info }))
    case 'PAY':
      return updateMember(state, action.id, { paid: true })
    case 'REMIND':
      return updateMember(state, action.id, { reminded: true })
    case 'SET_DEADLINE':
      return { ...state, deadline: action.deadline }
    case 'EXTEND':
      return updateMember(state, action.id, { graceUntil: action.until })
    case 'DROP_MEMBER':
      return {
        ...updateMember(state, action.id, { removed: true }),
        change: { droppedId: action.id, reason: action.reason, optionId: null, status: 'choosing', confirmed: {} },
      }
    case 'CHOOSE_OPTION':
      return { ...state, change: { ...state.change, optionId: action.optionId } }
    // Organizer confirms and sends the new arrangement to the group.
    case 'SEND_ARRANGEMENT': {
      const change = { ...state.change, status: 'confirming', confirmed: { [ORGANIZER_ID]: true } }
      const members =
        change.optionId === 'replace' ? [...state.members, { ...REPLACEMENT, invited: true }] : state.members
      return { ...state, change, members }
    }
    case 'CONFIRM_ARRANGEMENT':
      return { ...state, change: { ...state.change, confirmed: { ...state.change.confirmed, [action.id]: true } } }
    case 'CONFIRM_BOOKING':
      return { ...state, booked: true }
    case 'TOAST':
      return { ...state, toast: { id: action.id, message: action.message } }
    case 'CLEAR_TOAST':
      return { ...state, toast: null }
    // Presenter shortcut: everyone paid except the late member, who was reminded,
    // got an extension, and still didn't pay. Lands on "Plans changed".
    case 'JUMP_TO_CHANGE': {
      const fresh = createInitialState(state.runId, 'dropout')
      return {
        ...fresh,
        role: 'organizer',
        screens: { organizer: 'changed', member: 'home' },
        history: { organizer: ['status'], member: [] },
        group: { ...fresh.group, created: true, shared: true },
        // Keep any plan the organizer already built.
        plan: state.plan,
        caughtUp: true,
        deadline: action.now - HOUR,
        members: fresh.members.map((m) =>
          m.id === LATE_PAYER_ID
            ? { ...m, invited: true, reminded: true, graceUntil: action.now - 1000, removed: true }
            : { ...m, invited: true, joined: true, info: true, paid: true, ...(m.id === MEMBER_ID && { infoData: MEMBER_INFO_PREFILL }) },
        ),
        change: { droppedId: LATE_PAYER_ID, reason: 'unpaid', optionId: null, status: 'choosing', confirmed: {} },
      }
    }
    case 'RESET':
      return createInitialState(state.runId + 1, state.scenario)
    default:
      return state
  }
}

// Presenter navigation: screens that need earlier steps done first.
export function isLocked(state, summary, role, id) {
  if (role === 'member' && ['home', 'pay'].includes(id)) return !summary.me.joined
  if (role === 'member' && id === 'joined') return !summary.me.info
  if (id === 'plan') return !state.plan.generated
  if (['changed', 'options'].includes(id)) return !state.change
  if (id === 'arrangement') return !state.change?.optionId
  if (id === 'ready') return !summary.isReady
  if (id === 'confirmed') return !state.booked
  return false
}

// Everything the screens show is derived here, so it always stays in sync.
export function getSummary(state) {
  // Dropped members leave every count and total.
  const active = state.members.filter((m) => !m.removed)
  const { change } = state
  // Before the organizer picks an option, the trip shows the automatic recalculation.
  const option = change ? CHANGE_OPTIONS.find((o) => o.id === (change.optionId ?? RECALC_OPTION_ID)) : null
  const share = option?.price ?? TRIP.price
  const priceDiff = share - TRIP.price
  const topUp = Math.max(0, priceDiff)
  const size = active.length
  const paid = active.filter((m) => m.paid).length

  // Everyone who stays confirms a new arrangement; a replacement joins at the original price.
  const confirmers = change ? active.filter((m) => !m.replacement) : []
  const confirmedCount = confirmers.filter((m) => change.confirmed[m.id]).length
  const allPaid = active.every((m) => m.joined && m.paid)
  const arrangementDone = change?.status === 'confirming' && confirmedCount === confirmers.length && allPaid

  const total = share * size
  // Paid members paid the original price; confirming a price rise adds their top-up.
  const secured = paid * TRIP.price + confirmedCount * topUp

  const role = state.role ?? 'organizer'
  const screen = SCREENS[role].find((s) => s.id === state.screens[role])
  // A member's job ends once they've paid: past the last step means "all done".
  const me = state.members.find((m) => m.id === MEMBER_ID)
  const step = role === 'member' && me.paid ? ROLES.member.steps.length : screen.step
  // My own add-ons (baggage, insurance) are paid by me on top of the group share.
  const myExtras = getExtras(me.infoData)

  return {
    role,
    screen,
    step,
    doing: screen.doing,
    viewer: state.members.find((m) => m.id === ROLES[role].viewerId),
    organizer: state.members.find((m) => m.id === ORGANIZER_ID),
    me,
    myExtras,
    myTotal: TRIP.price + myExtras.total,
    dropped: change ? state.members.find((m) => m.id === change.droppedId) : null,
    active,
    size,
    joined: active.filter((m) => m.joined).length,
    paid,
    unpaid: active.filter((m) => !m.paid),
    share,
    priceDiff,
    topUp,
    option,
    hotel: HOTELS[option?.hotel ?? 'main'],
    rooms: option?.rooms ?? state.group.roomLabel,
    total,
    secured,
    remaining: Math.max(0, total - secured),
    confirmers,
    confirmedCount,
    arrangementDone,
    isReady: allPaid && active.every((m) => m.info) && (!change || arrangementDone),
  }
}
