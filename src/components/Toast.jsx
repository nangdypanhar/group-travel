import { CheckCircle2 } from 'lucide-react'
import { useDemo } from '../state/useDemo'

export default function Toast() {
  const { state } = useDemo()
  if (!state.toast) return null
  return (
    // Sits just below the header so it never hides the back button or "whose screen" pill.
    <div className="pointer-events-none absolute inset-x-0 top-[112px] z-40 flex justify-center px-6">
      <div
        key={state.toast.id}
        className="flex animate-toast items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-white shadow-xl"
      >
        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
        {state.toast.message}
      </div>
    </div>
  )
}
