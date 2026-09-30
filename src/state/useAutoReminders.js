import { useEffect, useRef } from 'react'
import { MEMBER_ID, PAY_ON_TIME } from '../data/mockData'
import { usd } from '../lib/format'
import { getSummary, HOUR, isSpotSecured } from './demoState'

// Pacing of the auto-reminder story: quick, but slow enough to read each toast.
const STEP = 1300
// Let "me"'s payment toast land before friends' payments start coming in.
const FIRST_DELAY = 1800
// Pause after the last on-time payment before the reminder goes out.
const REMIND_DELAY = 2200
// Longer pause before the reminded member pays, so the reminder clearly comes first.
const PAY_DELAY = 4000

// Once "me" has paid and is looking at the dashboard, friends pay their own
// share one by one. Then Trip.com reminds whoever is left, so nobody has to chase.
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

    // Friends who pay on time, each with their own toast.
    const onTime = others.filter((m) => PAY_ON_TIME.includes(m.id) && !isSpotSecured(m))
    onTime.forEach((m, i) => {
      at(i === 0 ? FIRST_DELAY : STEP, () => {
        dispatch({ type: 'PAY', id: m.id })
        toast(`${m.name} paid ${usd(summary.share)}`)
      })
    })

    const late = others.filter((m) => !onTime.includes(m))
    if (late.length === 0) return
    at(onTime.length ? REMIND_DELAY : FIRST_DELAY, () => {
      const hoursLeft = Math.ceil((state.deadline - Date.now()) / HOUR)
      late.forEach((m) => dispatch({ type: 'REMIND', id: m.id }))
      toast(`${hoursLeft}h left · auto-reminder sent to ${late.map((m) => m.name).join(', ')}`)
    })
    late.forEach((m) => {
      if (!m.joined) at(STEP, () => dispatch({ type: 'JOIN', id: m.id }))
      if (!m.info) {
        at(STEP, () => {
          dispatch({ type: 'SUBMIT_INFO', id: m.id })
          toast(`${m.name} added their info`)
        })
      }
      if (!m.vote) at(STEP, () => dispatch({ type: 'VOTE', id: m.id, option: summary.organizer.vote }))
    })
    late.forEach((m, i) => {
      if (isSpotSecured(m)) return
      at(i === 0 ? PAY_DELAY : STEP, () =>
        dispatch({ type: 'AUTO_PAY', id: m.id, toastId: Date.now(), message: `${m.name} paid ${usd(summary.share)}` }),
      )
    })
    // Timers are cleared on reset/unmount via the runId effect above.
  }, [shouldStart]) // eslint-disable-line react-hooks/exhaustive-deps
}
