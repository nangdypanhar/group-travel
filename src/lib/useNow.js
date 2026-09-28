import { useEffect, useState } from 'react'

// Current time, re-rendered every second (drives countdowns and deadline checks).
export function useNow() {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])
  return now
}
