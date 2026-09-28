import { Building2, Check, Crown, Lock, Palmtree, Wallet } from 'lucide-react'
import { usd } from '../lib/format'
import { AvatarStack } from './Avatar'

const ICONS = { villa: Palmtree, hotel: Building2 }
const TILE = { villa: 'bg-teal-50 text-teal-600', hotel: 'bg-indigo-50 text-indigo-600' }

// `budgetFit`: { fits, of } anonymous count of private budgets this option fits.
// `myFit`: whether it fits the viewer's own budget (shown only to them).
export default function VotingOption({ option, selected, onSelect, showResults, count, total, voters, isWinner, budgetFit, myFit }) {
  const Icon = ICONS[option.id]
  const pct = total ? Math.round((count / total) * 100) : 0
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={showResults}
      className={`w-full rounded-3xl border-2 bg-white p-4 text-left shadow-card transition ${
        selected ? 'border-brand-500' : 'border-transparent'
      } ${showResults ? 'cursor-default' : 'cursor-pointer hover:border-brand-200'}`}
    >
      <div className="flex gap-4">
        <div className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl ${TILE[option.id]}`}>
          <Icon className="h-7 w-7" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="flex items-center gap-1.5 text-[17px] font-bold">
                {option.name}
                {showResults && isWinner && (
                  <span className="inline-flex animate-pop items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                    <Crown className="h-3 w-3" /> Group pick
                  </span>
                )}
              </p>
              <p className="text-xs text-muted">{option.area}</p>
            </div>
            <div
              className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition ${
                selected ? 'border-brand-500 bg-brand-500' : 'border-slate-200'
              }`}
            >
              {selected && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
            </div>
          </div>
          <p className="mt-2 text-lg font-extrabold">
            {usd(option.price)}
            <span className="text-xs font-medium text-muted">/person</span>
          </p>
          {budgetFit && (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-700">
                <Wallet className="h-3 w-3" />
                {budgetFit.fits === budgetFit.of ? `Fits all ${budgetFit.of} budgets` : `Fits ${budgetFit.fits} of ${budgetFit.of} budgets`}
              </span>
              {myFit != null && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    myFit ? 'bg-slate-100 text-ink' : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  <Lock className="h-3 w-3" /> {myFit ? 'Within your budget' : 'Over your budget'}
                </span>
              )}
            </div>
          )}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {option.perks.map((perk) => (
              <span key={perk} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-muted">
                {perk}
              </span>
            ))}
          </div>
        </div>
      </div>

      {showResults && (
        <div className="mt-4 animate-fade-up space-y-2">
          <div className="flex items-center justify-between text-sm">
            <AvatarStack members={voters} />
            <span className="font-bold">
              {count} {count === 1 ? 'vote' : 'votes'} <span className="font-medium text-muted">· {pct}%</span>
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-700 ${isWinner ? 'bg-brand-500' : 'bg-slate-300'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}
    </button>
  )
}
