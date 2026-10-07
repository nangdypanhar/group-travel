import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { ROLES, VISIBLE_ROLES } from '../state/demoState'
import { useDemo } from '../state/useDemo'
import Avatar from './Avatar'

// Organizer screens are blue, member screens amber, so it's obvious whose phone this is.
const PILL = {
  organizer: 'bg-brand-500 text-white',
  member: 'bg-amber-100 text-amber-900',
}

const DESCRIPTIONS = {
  organizer: 'Creates and manages the group trip',
  member: 'Joins from the invite and pays their share',
}

// Header pill showing whose screen this is. Opens a menu to switch role during the demo.
export default function RoleSwitch() {
  const { state, dispatch } = useDemo()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const personOf = (role) => state.members.find((m) => m.id === ROLES[role].viewerId)
  const current = personOf(state.role)

  useEffect(() => {
    if (!open) return
    const close = (e) => {
      if (e.type === 'keydown' ? e.key === 'Escape' : !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', close)
    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', close)
    }
  }, [open])

  const choose = (role) => {
    dispatch({ type: 'SET_ROLE', role })
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Demo as"
        onClick={() => setOpen((o) => !o)}
        className={`flex cursor-pointer items-center gap-1.5 rounded-full py-1 pl-1 pr-2.5 text-xs font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-brand-200 active:scale-[0.97] ${PILL[state.role]}`}
      >
        <Avatar member={current} size="xs" />
        <span className="whitespace-nowrap">
          {/* Very narrow phones show just the role. */}
          <span className="hidden min-[380px]:inline">{current.name} · </span>
          {ROLES[state.role].label}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 opacity-70 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-40 mt-2 w-64 origin-top-right animate-pop rounded-3xl border border-slate-100 bg-white p-2 shadow-2xl shadow-ink/15"
        >
          <p className="px-3 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-wider text-muted">Demo as</p>
          {Object.entries(ROLES).filter(([role]) => VISIBLE_ROLES.includes(role)).map(([role, r]) => {
            const person = personOf(role)
            const active = role === state.role
            return (
              <button
                key={role}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => choose(role)}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition ${
                  active ? 'bg-brand-50' : 'hover:bg-slate-50'
                }`}
              >
                <Avatar member={person} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-sm font-semibold">
                    {person.name}
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                        role === 'member' ? 'bg-amber-100 text-amber-800' : 'bg-brand-100 text-brand-700'
                      }`}
                    >
                      {r.label}
                    </span>
                  </p>
                  <p className="text-[11px] leading-snug text-muted">{DESCRIPTIONS[role]}</p>
                </div>
                {active && <Check className="h-4 w-4 shrink-0 text-brand-600" strokeWidth={3} />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
