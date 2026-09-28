import { Check, CreditCard, Loader2, Lock, Wallet } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import PaymentCard from '../components/PaymentCard'
import { Button, Screen, ScreenTitle } from '../components/ui'
import { MEMBER_ID, PAYMENT_METHODS } from '../data/mockData'
import { usd } from '../lib/format'
import { useDemo } from '../state/useDemo'

export default function Payment() {
  const { state, summary, dispatch, go, toast } = useDemo()
  const me = state.members.find((m) => m.id === MEMBER_ID)
  const [method, setMethod] = useState(PAYMENT_METHODS[0].id)
  const [processing, setProcessing] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const pay = () => {
    setProcessing(true)
    timer.current = setTimeout(() => {
      dispatch({ type: 'PAY', id: MEMBER_ID })
      setProcessing(false)
    }, 1300)
  }

  const backToGroup = () => {
    toast(`Group updated: ${summary.paid}/${summary.size} paid`)
    go('dashboard')
  }

  if (me.paid) {
    return (
      <Screen footer={<Button onClick={backToGroup}>Back to group</Button>}>
        <div className="flex flex-col items-center pt-4 text-center">
          <div className="grid h-20 w-20 animate-pop place-items-center rounded-full bg-brand-500 shadow-xl shadow-brand-500/30">
            <Check className="h-10 w-10 text-white" strokeWidth={3} />
          </div>
          <h1 className="mt-4 text-[26px] font-bold tracking-tight">Your spot is secured</h1>
        </div>
        <PaymentCard
          paid
          share={summary.share}
          stay={summary.stay}
          passenger={me.name}
          method={PAYMENT_METHODS.find((m) => m.id === method).label}
          extras={(summary.covering[MEMBER_ID] ?? []).map((c) => ({ label: `Covering ${c.name}`, amount: c.amount }))}
        />
      </Screen>
    )
  }

  return (
    <Screen
      footer={
        <Button onClick={pay} disabled={processing}>
          {processing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-4 w-4" />}
          {processing ? 'Processing…' : `Pay ${usd(summary.share)}`}
        </Button>
      }
    >
      <ScreenTitle
        eyebrow="Individual payment"
        title="Pay only your share"
      />

      <PaymentCard share={summary.share} stay={summary.stay} passenger={me.name} />

      <div className="space-y-2">
        <p className="px-1 text-sm font-semibold">Payment method</p>
        {PAYMENT_METHODS.map((m, i) => {
          const selected = method === m.id
          const Icon = i === 0 ? Wallet : CreditCard
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethod(m.id)}
              aria-pressed={selected}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition ${
                selected ? 'border-brand-500 bg-brand-50 ring-4 ring-brand-100' : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                  selected ? 'bg-brand-500 text-white' : 'bg-slate-100 text-muted'
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${selected ? 'text-brand-700' : ''}`}>{m.label}</p>
                <p className="text-xs text-muted">{m.detail}</p>
              </div>
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
    </Screen>
  )
}
