import { useEffect } from 'react'
import { LATE_PAYER_ID, MEMBER_ID, TRIP } from '../data/mockData'
import { usd } from '../lib/format'

// Pacing: slow enough to read each toast during the pitch.
const REMINDER_REPLY = 2600
const CONFIRM_STEP = 1000
// "Me" confirms last, so the presenter has time to switch to the member's view.
const MY_CONFIRM_DELAY = 2600

const toast = (message) => ({ type: 'TOAST', id: Date.now(), message })

// The rest of the group, simulated. Returns the next thing someone does, or null.
function nextStep(state, summary) {
  // A reminder works: reminded members pay shortly after.
  // In the dropout scenario, the late member never does.
  const neverPays = (m) => state.scenario === 'dropout' && m.id === LATE_PAYER_ID
  const responder = state.members.find((m) => m.reminded && !m.paid && !m.removed && !neverPays(m))
  if (responder) {
    return {
      key: `pay-${responder.id}`,
      delay: REMINDER_REPLY,
      actions: [
        { type: 'JOIN', id: responder.id },
        { type: 'SUBMIT_INFO', id: responder.id, info: responder.infoData },
        { type: 'PAY', id: responder.id },
        toast(`${responder.name} paid ${usd(TRIP.price)} after the reminder`),
      ],
    }
  }

  if (state.change?.status !== 'confirming') return null

  // "Replace member": the new traveler joins from the invite, then pays.
  const replacement = summary.active.find((m) => m.replacement)
  if (replacement && !replacement.joined) {
    return {
      key: `join-${replacement.id}`,
      delay: CONFIRM_STEP,
      actions: [
        { type: 'JOIN', id: replacement.id },
        { type: 'SUBMIT_INFO', id: replacement.id },
        toast(`${replacement.name} joined from the invite`),
      ],
    }
  }
  if (replacement && !replacement.paid) {
    return {
      key: `pay-${replacement.id}`,
      delay: CONFIRM_STEP * 1.5,
      actions: [{ type: 'PAY', id: replacement.id }, toast(`${replacement.name} paid ${usd(TRIP.price)}`)],
    }
  }

  const pending = summary.confirmers.filter((m) => !state.change.confirmed[m.id])
  const next = pending.find((m) => m.id !== MEMBER_ID) ?? pending[0]
  if (!next) return null
  const last = pending.length === 1
  return {
    key: `confirm-${next.id}`,
    delay: next.id === MEMBER_ID ? MY_CONFIRM_DELAY : CONFIRM_STEP,
    actions: [
      { type: 'CONFIRM_ARRANGEMENT', id: next.id },
      ...(last ? [toast('Everyone confirmed the new arrangement')] : []),
    ],
  }
}

export function useGroupSimulation(state, summary, dispatch) {
  const step = nextStep(state, summary)
  useEffect(() => {
    if (!step) return
    const timer = setTimeout(() => dispatch({ type: 'BATCH', actions: step.actions }), step.delay)
    return () => clearTimeout(timer)
  }, [step?.key]) // eslint-disable-line react-hooks/exhaustive-deps
}
