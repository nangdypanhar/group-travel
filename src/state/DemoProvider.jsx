import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { DemoContext } from './context'
import { createInitialState, demoReducer, getSummary } from './demoState'
import { useAutoReminders } from './useAutoReminders'

export default function DemoProvider({ children }) {
  const [state, dispatch] = useReducer(demoReducer, undefined, createInitialState)

  useEffect(() => {
    if (!state.toast) return
    const timer = setTimeout(() => dispatch({ type: 'CLEAR_TOAST' }), 2600)
    return () => clearTimeout(timer)
  }, [state.toast])

  const toast = useCallback((message) => dispatch({ type: 'TOAST', message, id: Date.now() }), [])
  useAutoReminders(state, dispatch, toast)

  const value = useMemo(
    () => ({
      state,
      summary: getSummary(state),
      dispatch,
      go: (screen) => dispatch({ type: 'GO', screen }),
      toast,
    }),
    [state, toast],
  )

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}
