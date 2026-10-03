import { ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Button, Card, Screen, ScreenTitle } from '../components/ui'
import { BAGGAGE_OPTIONS, MEMBER_ID, MEMBER_INFO_PREFILL } from '../data/mockData'
import { useDemo } from '../state/useDemo'

const inputClass =
  'mt-1.5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[15px] font-medium outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100'

export default function MemberInfo() {
  const { summary, dispatch, go, toast } = useDemo()
  const [form, setForm] = useState(MEMBER_INFO_PREFILL)
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const valid = form.firstName && form.lastName && form.passport && form.dob

  const save = () => {
    dispatch({ type: 'SUBMIT_INFO', id: MEMBER_ID, info: form })
    toast('Saved. Your details stay private')
    go('dashboard')
  }

  return (
    <Screen footer={<Button onClick={save} disabled={!valid}>Save &amp; open group</Button>}>
      <ScreenTitle
        eyebrow="Your details"
        title="Enter your own information"
        subtitle={`${summary.organizer.name} doesn't collect your passport. You do.`}
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
        <Field label="Passport number">
          <input className={`${inputClass} tracking-wider`} value={form.passport} onChange={set('passport')} />
        </Field>
        <Field label="Date of birth">
          <input type="date" className={inputClass} value={form.dob} onChange={set('dob')} />
        </Field>
        <div>
          <span className="text-sm font-medium text-muted">Checked baggage</span>
          <div className="mt-1.5 grid grid-cols-3 gap-2">
            {BAGGAGE_OPTIONS.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setForm((f) => ({ ...f, baggage: b.id }))}
                className={`cursor-pointer rounded-2xl border py-2.5 text-sm font-semibold transition ${
                  form.baggage === b.id ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-muted'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="flex gap-3 rounded-3xl bg-brand-50 p-4 text-sm text-brand-700">
        <ShieldCheck className="h-5 w-5 shrink-0" />
        <p>Only you and the airline see this.</p>
      </div>

    </Screen>
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
