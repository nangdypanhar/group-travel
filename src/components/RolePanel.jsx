import { ChevronDown, Eye } from 'lucide-react'
import { useState } from 'react'
import { ORGANIZER_ID } from '../data/mockData'
import { isSpotSecured, SCREENS } from '../state/demoState'
import { useDemo } from '../state/useDemo'
import Avatar, { AvatarStack } from './Avatar'

const roleOf = (id) => (id === ORGANIZER_ID ? 'Organizer' : 'Member')

// Before the dashboard (`caughtUp`), nobody is expected to have paid yet.
function statusOf(m, caughtUp) {
  if (m.removed) return { label: 'Removed', className: 'text-rose-500' }
  if (!m.joined) return { label: m.invited ? 'Invited' : 'Not invited', className: 'text-muted' }
  if (m.id === ORGANIZER_ID && !caughtUp) return { label: 'Created trip', className: 'text-emerald-600' }
  if (m.coveredBy) return { label: 'Covered', className: 'text-brand-600' }
  if (isSpotSecured(m)) return { label: 'Paid', className: 'text-emerald-600' }
  return { label: 'Not paid', className: 'text-amber-600' }
}

// Desktop-only side panel so the audience always knows whose screen this is.
export default function RolePanel() {
  const { state, summary } = useDemo()
  const { viewer } = summary
  const screen = SCREENS.find((s) => s.id === state.screen)
  // The group list is optional detail for the presenter, so it starts folded.
  const [groupOpen, setGroupOpen] = useState(false)
  const isOrganizer = viewer.id === ORGANIZER_ID

  return (
    <aside className="hidden w-72 shrink-0 xl:block">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">On screen now</p>
      <div key={`${viewer.id}-${state.screen}`} className="mt-3 animate-fade-up rounded-[2rem] bg-white p-6 shadow-card">
        <Avatar member={viewer} size="xl" />
        <p className="mt-4 text-3xl font-extrabold leading-tight tracking-tight">{viewer.name}</p>
        <span
          className={`mt-2 inline-block rounded-full px-3.5 py-1 text-sm font-bold ${
            isOrganizer ? 'bg-brand-500 text-white' : 'bg-amber-100 text-amber-800'
          }`}
        >
          {roleOf(viewer.id)}
        </span>
        <p className="mt-5 flex items-start gap-2 border-t border-slate-100 pt-4 text-base font-medium leading-snug">
          <Eye className="mt-1 h-4 w-4 shrink-0 text-muted" />
          {screen.doing}
        </p>
      </div>

      <div className="mt-6 rounded-3xl bg-white/60">
        <button
          type="button"
          onClick={() => setGroupOpen((o) => !o)}
          aria-expanded={groupOpen}
          className="flex w-full cursor-pointer items-center gap-3 rounded-3xl px-4 py-3 text-left transition hover:bg-white"
        >
          <span className="min-w-0 flex-1">
            <span className="block whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-muted">The group</span>
            <span className="text-sm font-semibold">
              {summary.paid}/{summary.size} paid
            </span>
          </span>
          {!groupOpen && <AvatarStack members={summary.active} size="xs" />}
          <ChevronDown className={`h-5 w-5 shrink-0 text-muted transition ${groupOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Accordion body: animates height via grid rows. */}
        <div className={`grid transition-all duration-300 ${groupOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="overflow-hidden">
            <div className="space-y-1 px-2 pb-2 pt-1">
              {state.members.map((m) => {
                const status = statusOf(m, state.caughtUp)
                const onScreen = m.id === viewer.id
                return (
                  <div
                    key={m.id}
                    className={`flex items-center gap-3 rounded-2xl px-3 py-2 transition ${
                      onScreen ? 'bg-brand-50 ring-2 ring-inset ring-brand-500' : ''
                    } ${m.removed ? 'opacity-50' : ''}`}
                  >
                    <Avatar member={m} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold leading-tight">{m.name}</p>
                      <p className={`text-[11px] ${onScreen ? 'font-semibold text-brand-600' : 'text-muted'}`}>
                        {onScreen ? `${roleOf(m.id)} · On screen` : roleOf(m.id)}
                      </p>
                    </div>
                    <span key={status.label} className={`animate-pop text-[11px] font-semibold ${status.className}`}>
                      {status.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
