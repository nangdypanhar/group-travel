import { Check, Luggage, ShieldCheck, ShieldPlus } from 'lucide-react'
import { useState } from 'react'
import { Button, Card, Screen, ScreenTitle } from '../components/ui'
import { BAGGAGE, ID_TYPES, INSURANCE_PLANS, MEMBER_ID, MEMBER_INFO_PREFILL } from '../data/mockData'
import { getExtras } from '../lib/extras'
import { usd } from '../lib/format'
import { useDemo } from '../state/useDemo'

const inputClass =
  'mt-1.5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[15px] font-medium outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100'

export default function MemberInfo() {
  const { summary, dispatch, go } = useDemo()
  const [form, setForm] = useState(summary.me.infoData ?? MEMBER_INFO_PREFILL)
  const setValue = (key, value) => setForm((f) => ({ ...f, [key]: value }))
  const set = (key) => (e) => setValue(key, e.target.value)
  const valid = form.firstName && form.lastName && form.idNumber && form.dob && (form.idType !== 'passport' || form.idExpiry)
  const extras = getExtras(form)
  const idLabel = ID_TYPES.find((t) => t.id === form.idType).label

  const setBagKg = (e) => {
    const kg = Math.min(BAGGAGE.maxExtraKg, Math.max(0, Math.round(Number(e.target.value) || 0)))
    setValue('extraBagKg', kg)
  }

  const save = () => {
    dispatch({ type: 'SUBMIT_INFO', id: MEMBER_ID, info: form })
    go('joined')
  }

  return (
    <Screen
      footer={
        <Button onClick={save} disabled={!valid}>
          Confirm Participation{extras.total ? ` · +${usd(extras.total)} extras` : ''}
        </Button>
      }
    >
      <ScreenTitle
        eyebrow="Your details"
        title="Your traveller details"
        subtitle={`${summary.organizer.name} doesn't collect your ID. You do.`}
      />

      <Card className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name">
            <input className={inputClass} value={form.firstName} onChange={set('firstName')} />
          </Field>
          <Field label="Last name">
            <input className={inputClass} value={form.lastName} onChange={set('lastName')} />
          </Field>
        </div>

        <div>
          <span className="text-sm font-medium text-muted">ID type</span>
          <div className="mt-1.5 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
            {ID_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setValue('idType', t.id)}
                aria-pressed={form.idType === t.id}
                className={`cursor-pointer rounded-xl py-2 text-sm font-semibold transition ${
                  form.idType === t.id ? 'bg-white text-brand-700 shadow-sm' : 'text-muted hover:text-ink'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <Field label={`${idLabel} number`}>
          <input className={`${inputClass} tracking-wider`} value={form.idNumber} onChange={set('idNumber')} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nationality">
            <input className={inputClass} value={form.nationality} onChange={set('nationality')} />
          </Field>
          <Field label={form.idType === 'passport' ? 'Expiry date' : 'Expiry (optional)'}>
            <input type="date" className={inputClass} value={form.idExpiry} onChange={set('idExpiry')} />
          </Field>
        </div>
        <Field label="Date of birth">
          <input type="date" className={inputClass} value={form.dob} onChange={set('dob')} />
        </Field>
      </Card>

      <div className="flex gap-3 rounded-3xl bg-brand-50 p-4 text-sm text-brand-700">
        <ShieldCheck className="h-5 w-5 shrink-0" />
        <p>Only you and the airline see this.</p>
      </div>

      {/* Baggage: pick a quick amount or type your own kg. */}
      <Card className="space-y-3">
        <SectionHead Icon={Luggage} title="Checked baggage" sub={`${BAGGAGE.includedKg} kg included · extra ${usd(BAGGAGE.pricePerKg)}/kg`} />
        <div className="flex flex-wrap gap-2">
          {BAGGAGE.quickPicks.map((kg) => {
            const selected = extras.bagKg === kg
            return (
              <button
                key={kg}
                type="button"
                onClick={() => setValue('extraBagKg', kg)}
                aria-pressed={selected}
                className={`cursor-pointer rounded-full border-2 px-3.5 py-1.5 text-sm font-semibold transition ${
                  selected ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-muted hover:border-slate-300'
                }`}
              >
                {kg ? `+${kg} kg` : 'None'}
              </button>
            )
          })}
        </div>
        <label className="flex items-center gap-3">
          <span className="flex-1 text-sm text-muted">Or enter extra kg</span>
          <div className="relative w-28">
            <input
              type="number"
              min={0}
              max={BAGGAGE.maxExtraKg}
              inputMode="numeric"
              className={`${inputClass.replace('mt-1.5', 'mt-0')} pr-10 text-right`}
              value={form.extraBagKg || ''}
              placeholder="0"
              onChange={setBagKg}
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted">kg</span>
          </div>
        </label>
        <div className="flex justify-between border-t border-slate-100 pt-3 text-sm">
          <span className="text-muted">
            Total allowance · <span className="font-semibold text-ink">{BAGGAGE.includedKg + extras.bagKg} kg</span>
          </span>
          <span className="font-semibold">{extras.bagCost ? `+${usd(extras.bagCost)}` : 'Included'}</span>
        </div>
      </Card>

      {/* Insurance: optional, each traveler decides for themselves. */}
      <Card className="space-y-3">
        <SectionHead Icon={ShieldPlus} title="Travel insurance" sub="Optional · only for you" />
        <div className="space-y-2">
          {INSURANCE_PLANS.map((p) => {
            const selected = extras.plan.id === p.id
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setValue('insurance', p.id)}
                aria-pressed={selected}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition ${
                  selected ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${selected ? 'text-brand-700' : ''}`}>{p.label}</p>
                  <p className="text-xs text-muted">{p.detail}</p>
                </div>
                <span className="text-sm font-semibold">{p.price ? `+${usd(p.price)}` : usd(0)}</span>
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition ${
                    selected ? 'border-brand-500 bg-brand-500' : 'border-slate-300'
                  }`}
                >
                  {selected && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                </span>
              </button>
            )
          })}
        </div>
      </Card>
    </Screen>
  )
}

function SectionHead({ Icon, title, sub }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-xs text-muted">{sub}</p>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-muted">{label}</span>
      {children}
    </label>
  )
}
