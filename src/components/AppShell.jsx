import { ChevronLeft, ListOrdered } from 'lucide-react'
import { useState } from 'react'
import { useDemo } from '../state/useDemo'
import BottomSheet from './BottomSheet'
import PresenterPanel, { DemoNav } from './PresenterPanel'
import RolePanel from './RolePanel'
import RoleSwitch from './RoleSwitch'
import StepIndicator from './StepIndicator'
import Toast from './Toast'

// Phone-sized frame centered on desktop; full-screen on mobile.
export default function AppShell({ children }) {
  const { state, summary, dispatch } = useDemo()
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="min-h-dvh lg:flex lg:items-center lg:justify-center lg:gap-10 lg:p-8 xl:mx-auto xl:max-w-[1440px] xl:justify-between xl:px-16">
      <PresenterPanel />
      <div id="phone-frame" className="relative mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-white lg:mx-0 lg:h-[min(860px,calc(100dvh-3rem))] lg:rounded-[2.75rem] lg:border-[10px] lg:border-ink lg:shadow-2xl">
        <header className="shrink-0 bg-white pt-4">
          <div className="flex items-center justify-between gap-2 px-5 pb-3">
            <div className="flex items-center gap-2">
              {state.role && (
                <button
                  type="button"
                  aria-label="Back"
                  onClick={() => dispatch({ type: 'BACK' })}
                  className="-ml-1 grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-slate-100 text-ink transition hover:bg-slate-200 active:scale-95"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}
              {/* Brand lockup: stacked so it never wraps next to the role pill. */}
              <div className="whitespace-nowrap leading-none">
                <p className="text-lg font-extrabold tracking-tight text-brand-500">Trip.com</p>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-ink/60">Group Trip</p>
              </div>
            </div>
            {state.role && (
              <div className="flex items-center gap-1.5">
                <RoleSwitch />
                {/* On phones the presenter panel isn't visible, so it opens from here. */}
                <button
                  type="button"
                  aria-label="Demo steps"
                  onClick={() => setMenuOpen(true)}
                  className="grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-slate-100 text-muted lg:hidden"
                >
                  <ListOrdered className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          {state.role && <StepIndicator phase={summary.phase} label={summary.screen.label} />}
        </header>
        <main key={`${state.role}-${summary.screen.id}`} className="no-scrollbar flex-1 overflow-y-auto bg-slate-50/60">
          {children}
        </main>
        <Toast />
        {menuOpen && (
          <BottomSheet title="Demo steps" subtitle="Jump to any screen, switch role or reset" onClose={() => setMenuOpen(false)}>
            <div className="no-scrollbar -mt-5 max-h-[60dvh] overflow-y-auto">
              <DemoNav onDone={() => setMenuOpen(false)} />
            </div>
          </BottomSheet>
        )}
      </div>
      <RolePanel />
    </div>
  )
}
