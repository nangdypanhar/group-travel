import {
  BUDGET_RANGES,
  DEFAULT_STAY_ID,
  LATE_PAYER_ID,
  MEMBER_INFO_PREFILL,
  GROUP_DEFAULTS,
  MEMBER_ID,
  MEMBER_PROGRESS,
  MEMBERS,
  ORGANIZER_ID,
  STAY_OPTIONS,
} from '../data/mockData'

export const HOUR = 60 * 60 * 1000
// Demo time-skip: friends join over the first few hours, so by the time the
// dashboard is shown the countdown reads ~18h on a 24h deadline.
const TIME_SKIP_HOURS = 6
// The stay vote closes this long before the payment deadline,
// so everyone pays the final price.
const VOTE_CLOSES_BEFORE_HOURS = 6

export const PHASES = ['Plan', 'Join', 'Together', 'Book']

// `viewer` decides whose eyes we're looking through on each screen.
export const SCREENS = [
  { id: 'itinerary', label: 'Trip itinerary', phase: 0, viewer: ORGANIZER_ID, doing: 'Finds a trip for the group' },
  { id: 'create', label: 'Create Group Trip', phase: 0, viewer: ORGANIZER_ID, doing: 'Turns it into a Group Trip' },
  { id: 'invite', label: 'Invite friends', phase: 0, viewer: ORGANIZER_ID, doing: 'Shares one invite link' },
  { id: 'join', label: 'Member joins', phase: 1, viewer: MEMBER_ID, doing: 'Opens the invite link' },
  { id: 'info', label: 'Info & private budget', phase: 1, viewer: MEMBER_ID, doing: 'Adds their own details and a private budget' },
  { id: 'dashboard', label: 'Group dashboard', phase: 2, viewer: MEMBER_ID, doing: 'Tracks the whole group in one place' },
  { id: 'vote', label: 'Group voting', phase: 2, viewer: MEMBER_ID, doing: 'Votes on where to stay' },
  { id: 'pay', label: 'Individual payment', phase: 2, viewer: MEMBER_ID, doing: 'Pays only their own share' },
  // Reached from the dashboard (or the presenter's "Skip to deadline"), not the nav.
  { id: 'deadline', label: 'Unpaid member', phase: 2, viewer: ORGANIZER_ID, nav: false, doing: 'Decides what happens to an unpaid spot' },
  { id: 'keepVote', label: 'Keep or remove vote', phase: 2, viewer: MEMBER_ID, nav: false, doing: 'Votes: keep or remove the unpaid member' },
  { id: 'ready', label: 'Group ready', phase: 3, viewer: ORGANIZER_ID, doing: 'Books for the whole group in one tap' },
  { id: 'confirmed', label: 'Booking confirmed', phase: 3, viewer: ORGANIZER_ID, doing: 'Booked together, paid only their share' },
]

export const deadlineFromHours = (hours) => Date.now() + (hours - TIME_SKIP_HOURS) * HOUR

// Time-skip: once "me" reaches the dashboard, the rest of the group has had
// hours to join, add their info, vote and pay. Applied once per run.
const DASHBOARD_INDEX = SCREENS.findIndex((s) => s.id === 'dashboard')
function catchUp(state) {
  if (state.caughtUp) return state
  return {
    ...state,
    caughtUp: true,
    members: state.members.map((m) => ({ ...m, invited: true, ...MEMBER_PROGRESS[m.id] })),
  }
}

export function createInitialState(runId = 0) {
  return {
    screen: 'itinerary',
    // Bumped on reset so running timers (auto-reminders) know to stop.
    runId,
    group: { ...GROUP_DEFAULTS },
    deadline: deadlineFromHours(GROUP_DEFAULTS.deadlineHours),
    members: MEMBERS.map((m) => ({ ...m })),
    // True once the group's progress has been filled in (see catchUp).
    caughtUp: false,
    booked: false,
    // Keep-or-remove vote for a member who missed the payment deadline:
    // { targetId, votes: { [voterId]: 'keep' | 'remove' }, status: 'open' | 'awaiting-organizer' | 'kept' | 'removed' }
    keepVote: null,
    // Unpaid member whose details sheet is open on the dashboard.
    inspectingId: null,
    toast: null,
  }
}

const updateMember = (state, id, changes) => ({
  ...state,
  members: state.members.map((m) => (m.id === id ? { ...m, ...changes } : m)),
})

export function demoReducer(state, action) {
  switch (action.type) {
    case 'GO': {
      const next = { ...state, screen: action.screen }
      return SCREENS.findIndex((s) => s.id === action.screen) >= DASHBOARD_INDEX ? catchUp(next) : next
    }
    case 'SET_DEADLINE':
      return { ...state, deadline: action.deadline }
    case 'REMOVE_MEMBER':
      return updateMember(state, action.id, { removed: true })
    case 'START_KEEP_VOTE':
      return {
        ...updateMember(state, action.targetId, { hold: true }),
        inspectingId: null,
        keepVote: { targetId: action.targetId, votes: {}, status: 'open' },
      }
    case 'CAST_KEEP_VOTE':
      return {
        ...state,
        keepVote: { ...state.keepVote, votes: { ...state.keepVote.votes, [action.voterId]: action.choice } },
      }
    case 'SET_KEEP_VOTE_STATUS':
      return { ...state, keepVote: { ...state.keepVote, status: action.status } }
    case 'COVER_MEMBER':
      // contributions: { [coveringMemberId]: amount }
      return updateMember(state, action.id, { coveredBy: action.contributions })
    case 'CREATE_GROUP':
      return { ...state, group: { ...state.group, ...action.group }, deadline: action.deadline }
    case 'INVITE_ALL':
      return { ...state, members: state.members.map((m) => ({ ...m, invited: true })) }
    case 'JOIN':
      return updateMember(state, action.id, { joined: true })
    case 'SUBMIT_INFO':
      return updateMember(state, action.id, { info: true, infoData: action.info })
    case 'SET_BUDGET': {
      const range = BUDGET_RANGES.find((b) => b.id === action.budget)
      return updateMember(state, action.id, { budget: action.budget, budgetMax: range.max })
    }
    case 'VOTE':
      return updateMember(state, action.id, { vote: action.option })
    case 'PAY':
      return updateMember(state, action.id, { paid: true })
    case 'CONFIRM_BOOKING':
      return { ...state, booked: true }
    case 'TOAST':
      return { ...state, toast: { id: action.id, message: action.message } }
    case 'CLEAR_TOAST':
      return { ...state, toast: null }
    // Auto-reminded member pays, unless someone is looking into them (hold)
    // or the group is voting on them. Then the payment waits.
    case 'AUTO_PAY': {
      const m = state.members.find((x) => x.id === action.id)
      if (m.paid || m.coveredBy || m.removed) return state
      if (m.hold || state.keepVote?.targetId === m.id) return updateMember(state, m.id, { autoPayQueued: true })
      return { ...updateMember(state, m.id, { paid: true }), toast: { id: action.toastId, message: action.message } }
    }
    // Opening an unpaid member's sheet holds their auto-payment; closing releases it.
    case 'INSPECT':
      return { ...updateMember(state, action.id, { hold: true }), inspectingId: action.id }
    case 'CLOSE_INSPECT': {
      const m = state.members.find((x) => x.id === state.inspectingId)
      const pays = m.autoPayQueued && !m.paid && state.keepVote?.targetId !== m.id
      const next = { ...updateMember(state, m.id, { hold: false, autoPayQueued: false, paid: m.paid || pays }), inspectingId: null }
      return pays ? { ...next, toast: { id: action.toastId, message: action.message } } : next
    }
    // Presenter shortcut: the payment deadline has passed. Everyone did their part
    // except the late payer, who was auto-reminded but never paid.
    // Lands on the dashboard with their sheet open.
    case 'JUMP_TO_UNPAID': {
      const members = catchUp(state).members.map((m) => {
        const base = { ...m, invited: true, joined: true, removed: false, coveredBy: undefined, vote: m.vote ?? DEFAULT_STAY_ID }
        if (m.id === MEMBER_ID)
          return { ...base, info: true, infoData: MEMBER_INFO_PREFILL, budget: m.budget ?? BUDGET_RANGES[1].id, budgetMax: m.budgetMax ?? BUDGET_RANGES[1].max, paid: true }
        if (m.id === LATE_PAYER_ID)
          return { ...base, info: true, paid: false, reminded: true, hold: false, autoPayQueued: false }
        return base
      })
      return {
        ...state,
        caughtUp: true,
        members,
        keepVote: null,
        booked: false,
        deadline: action.deadline,
        screen: 'dashboard',
        inspectingId: LATE_PAYER_ID,
      }
    }
    case 'REMIND':
      return updateMember(state, action.id, { reminded: true })
    case 'RESET':
      return createInitialState(state.runId + 1)
    default:
      return state
  }
}

// A spot is secured when the member paid, or the group agreed to cover it.
export const isSpotSecured = (m) => m.paid || Boolean(m.coveredBy)

export const isMemberComplete = (m) => m.joined && m.info && isSpotSecured(m) && Boolean(m.vote)

// Members who paid their own share vote on keeping an unpaid member.
export const keepVoters = (state, targetId) =>
  state.members.filter((m) => !m.removed && m.paid && m.id !== targetId)

export function tallyKeepVote(votes) {
  const keep = Object.keys(votes).filter((id) => votes[id] === 'keep')
  const remove = Object.keys(votes).filter((id) => votes[id] === 'remove')
  // Only a strict majority keeps the member. Otherwise the organizer decides.
  return { keep, remove, keepWins: keep.length > remove.length }
}

// Split an amount evenly, to the cent. Leftover cents go to the first people.
export function splitAmount(amount, ids) {
  const cents = Math.round(amount * 100)
  const base = Math.floor(cents / ids.length)
  const extra = cents - base * ids.length
  return Object.fromEntries(ids.map((id, i) => [id, (base + (i < extra ? 1 : 0)) / 100]))
}

// Everything the dashboard shows is derived here, so it always stays in sync.
export function getSummary(state) {
  // Released members drop out of every count, total and vote.
  const members = state.members.filter((m) => !m.removed)
  const size = members.length
  const joinedMembers = members.filter((m) => m.joined)
  const countJoined = (key) => joinedMembers.filter((m) => m[key]).length

  const voteCounts = Object.fromEntries(STAY_OPTIONS.map((o) => [o.id, 0]))
  joinedMembers.forEach((m) => {
    if (m.vote) voteCounts[m.vote] += 1
  })
  const voted = joinedMembers.filter((m) => m.vote).length
  const topCount = Math.max(...Object.values(voteCounts))
  const leaders = STAY_OPTIONS.filter((o) => voteCounts[o.id] === topCount)
  const organizerVote = members.find((m) => m.id === ORGANIZER_ID)?.vote
  const isTie = voted > 0 && leaders.length > 1
  // Ties are broken by the organizer's vote.
  const winnerId = voted === 0
    ? DEFAULT_STAY_ID
    : isTie
      ? leaders.find((o) => o.id === organizerVote)?.id ?? leaders[0].id
      : leaders[0].id
  const stay = STAY_OPTIONS.find((o) => o.id === winnerId)

  // Anonymous budget signal per stay option: how many private budgets it fits.
  const withBudget = members.filter((m) => m.budgetMax != null)
  const budgetFit = Object.fromEntries(
    STAY_OPTIONS.map((o) => [o.id, { fits: withBudget.filter((m) => o.price <= m.budgetMax).length, of: withBudget.length }]),
  )

  const share = stay.price
  const paid = joinedMembers.filter(isSpotSecured).length

  // How much each member is covering for others: { [id]: [{ name, amount }] }
  const covering = {}
  members.forEach((m) => {
    Object.entries(m.coveredBy ?? {}).forEach(([id, amount]) => {
      covering[id] = [...(covering[id] ?? []), { name: m.name, amount }]
    })
  })
  const screen = SCREENS.find((s) => s.id === state.screen)
  // The unpaid member's sheet on the dashboard is the organizer's action,
  // so the demo switches to their eyes while it's open.
  const organizerReviewing = state.screen === 'dashboard' && Boolean(state.inspectingId)
  const viewerId = organizerReviewing ? ORGANIZER_ID : screen?.viewer ?? MEMBER_ID

  return {
    size,
    joined: joinedMembers.length,
    infoDone: countJoined('info'),
    paid,
    voted,
    voteCounts,
    budgetFit,
    voteClosed: voted === size,
    voteDeadline: state.deadline - VOTE_CLOSES_BEFORE_HOURS * HOUR,
    isTie,
    stay,
    share,
    total: share * size,
    secured: share * paid,
    isReady: members.every(isMemberComplete),
    viewer: state.members.find((m) => m.id === viewerId),
    doing: organizerReviewing ? 'Reviews the member who missed the deadline' : screen?.doing,
    organizer: state.members.find((m) => m.id === ORGANIZER_ID),
    active: members,
    pending: members.filter((m) => !isMemberComplete(m)),
    unpaid: members.filter((m) => !isSpotSecured(m)),
    // The unpaid member the group decides on next (the viewer is never voted on).
    voteTarget: members.find((m) => !isSpotSecured(m) && m.id !== MEMBER_ID) ?? null,
    covering,
    // A spot can only be released if the group stays at or above the minimum.
    canRemove: size - 1 >= state.group.minMembers,
  }
}
