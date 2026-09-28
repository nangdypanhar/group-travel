import { useEffect, useRef } from 'react'
import { MEMBER_ID } from '../data/mockData'
import { usd } from '../lib/format'
import { getSummary, isSpotSecured } from './demoState'

// Pacing of the auto-reminder story: quick, but slow enough to read each toast.
const STEP = 1300
// Short pause before the reminded member pays, so "added their info" lands first.
const PAY_DELAY = 1800

// Trip.com reminds unfinished members automatically, so nobody has to chase.
// Starts once "me" has paid and is looking at the dashboard.
export function useAutoReminders(state, dispatch, toast) {
  const timers = useRef([])
  const started = useRef(false)

  // Stop everything on reset.
  useEffect(() => {
    started.current = false
    return () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
  }, [state.runId])

  const summary = getSummary(state)
  const me = state.members.find((m) => m.id === MEMBER_ID)
  const others = summary.pending.filter((m) => m.id !== MEMBER_ID)
  // Skip if everyone left was already reminded (e.g. after the presenter's shortcut).
  const shouldStart =
    state.screen === 'dashboard' && me.paid && others.some((m) => !m.reminded) && !state.keepVote

  useEffect(() => {
    if (!shouldStart || started.current || Date.now() >= state.deadline) return
    started.current = true
    let t = 0
    const at = (delay, fn) => {
      t += delay
      timers.current.push(setTimeout(fn, t))
    }

    at(STEP, () => {
      others.forEach((m) => dispatch({ type: 'REMIND', id: m.id }))
      toast(`Auto-reminder sent to ${others.map((m) => m.name).join(', ')}`)
    })
    others.forEach((m) => {
      if (!m.joined) at(STEP, () => dispatch({ type: 'JOIN', id: m.id }))
      if (!m.info) {
        at(STEP, () => {
          dispatch({ type: 'SUBMIT_INFO', id: m.id })
          toast(`${m.name} added their info`)
        })
      }
      if (!m.vote) at(STEP, () => dispatch({ type: 'VOTE', id: m.id, option: summary.organizer.vote }))
    })
    others.forEach((m, i) => {
      if (isSpotSecured(m)) return
      at(i === 0 ? PAY_DELAY : STEP, () =>
        dispatch({ type: 'AUTO_PAY', id: m.id, toastId: Date.now(), message: `${m.name} paid ${usd(summary.share)}` }),
      )
    })
    // Timers are cleared on reset/unmount via the runId effect above.
  }, [shouldStart]) // eslint-disable-line react-hooks/exhaustive-deps
}
