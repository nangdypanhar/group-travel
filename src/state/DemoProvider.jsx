import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { DemoContext } from './context'
import { createInitialState, demoReducer, getSummary } from './demoState'
import { useGroupSimulation } from './useGroupSimulation'

export default function DemoProvider({ children }) {
  const [state, dispatch] = useReducer(demoReducer, undefined, createInitialState)

  useEffect(() => {
    if (!state.toast) return
    const timer = setTimeout(() => dispatch({ type: 'CLEAR_TOAST' }), 2600)
    return () => clearTimeout(timer)
  }, [state.toast])

  const summary = useMemo(() => getSummary(state), [state])
  const toast = useCallback((message) => dispatch({ type: 'TOAST', message, id: Date.now() }), [])
  useGroupSimulation(state, summary, dispatch)

  const value = useMemo(
    () => ({
      state,
      summary,
      dispatch,
      // `role` switches perspective too (e.g. presenter jumping to the member's screen).
      go: (screen, role) => dispatch({ type: 'GO', screen, role }),
      toast,
    }),
    [state, summary, toast],
  )

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}
