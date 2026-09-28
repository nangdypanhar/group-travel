import { useDemo } from '../state/useDemo'
import { ORGANIZER_ID } from '../data/mockData'
import Avatar from './Avatar'
import PresenterPanel from './PresenterPanel'
import RolePanel from './RolePanel'
import StepIndicator from './StepIndicator'
import Toast from './Toast'

// Phone-sized frame centered on desktop; full-screen on mobile.
export default function AppShell({ children }) {
  const { state, summary } = useDemo()
  const { viewer } = summary
  return (
    <div className="min-h-dvh lg:flex lg:items-center lg:justify-center lg:gap-10 lg:p-8 xl:mx-auto xl:max-w-[1440px] xl:justify-between xl:px-16">
      <PresenterPanel />
      <div id="phone-frame" className="relative mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-white lg:mx-0 lg:h-[min(860px,calc(100dvh-3rem))] lg:rounded-[2.75rem] lg:border-[10px] lg:border-ink lg:shadow-2xl">
        <header className="shrink-0 bg-white pt-4">
          <div className="flex items-center justify-between px-5 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight text-brand-500">Trip.com</span>
              <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-600">Group Trip</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-slate-50 py-1 pl-1 pr-3">
              <Avatar member={viewer} size="sm" className="scale-75" />
              <span className="text-xs font-medium">
                {viewer.name} <span className="text-muted">· {viewer.id === ORGANIZER_ID ? 'Organizer' : 'Member'}</span>
              </span>
            </div>
          </div>
          <StepIndicator screen={state.screen} />
        </header>
        <main key={state.screen} className="no-scrollbar flex-1 overflow-y-auto bg-slate-50/60">
          {children}
        </main>
        <Toast />
      </div>
      <RolePanel />
    </div>
  )
}
