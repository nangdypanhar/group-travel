import { Crown, Ticket } from 'lucide-react'
import ScenarioSwitch from '../components/ScenarioSwitch'
import { Button } from '../components/ui'
import { useDemo } from '../state/useDemo'

const CHOICES = [
  {
    role: 'organizer',
    Icon: Crown,
    title: 'Organizer',
    text: 'Create and manage a group trip',
    cta: 'Continue as Organizer',
    variant: 'primary',
    tile: 'bg-brand-500 text-white',
  },
  {
    role: 'member',
    Icon: Ticket,
    title: 'Member',
    text: 'Join a group trip using an invitation',
    cta: 'Join a Group',
    variant: 'secondary',
    tile: 'bg-amber-100 text-amber-700',
  },
]

// Role picker shown before the demo starts.
export default function Landing() {
  const { dispatch } = useDemo()
  return (
    // Centered in the phone so the role picker doesn't leave a big empty space below.
    <div className="flex min-h-full animate-fade-up flex-col justify-center gap-4 px-5 py-6">
      <div className="pb-2 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Group Travel</p>
        <h1 className="mt-3 text-[28px] font-bold leading-tight tracking-tight">
          Plan together.
          <br />
          Pay individually.
          <br />
          <span className="text-brand-500">Stay together when plans change.</span>
        </h1>
      </div>

      {CHOICES.map(({ role, Icon, title, text, cta, variant, tile }) => (
        <div key={role} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-card">
          <div className="flex items-center gap-4">
            <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${tile}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted">{title}</p>
              <p className="text-[15px] font-semibold">{text}</p>
            </div>
          </div>
          <Button variant={variant} className="mt-4" onClick={() => dispatch({ type: 'SET_ROLE', role })}>
            {cta}
          </Button>
        </div>
      ))}

      <div className="px-1 pt-2">
        <ScenarioSwitch />
      </div>
    </div>
  )
}
