import { useNow } from '../lib/useNow'

const pad = (n) => String(n).padStart(2, '0')

export default function Countdown({ deadline }) {
  const now = useNow()
  const total = Math.max(0, Math.floor((deadline - now) / 1000))
  if (total === 0) return <span>Deadline passed</span>

  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return (
    <span className="tabular-nums">
      {h}h {pad(m)}m {pad(s)}s
    </span>
  )
}
