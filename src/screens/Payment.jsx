import { Check, CreditCard, Loader2, Lock, Wallet } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { DeadlineCard } from '../components/Countdown'
import PaymentCard, { Line, Stamp } from '../components/PaymentCard'
import { Button, Card, ProgressBar, Screen, ScreenTitle } from '../components/ui'
import { MEMBER_ID, PAYMENT_METHODS, TRIP } from '../data/mockData'
import { usd } from '../lib/format'
import { useDemo } from '../state/useDemo'

// Member: pays only their own share.
export default function Payment() {
  const { state, summary, dispatch, go, toast } = useDemo()
  const { me } = summary
  const [method, setMethod] = useState(PAYMENT_METHODS[0].id)
  const [processing, setProcessing] = useState(false)
  const timer = useRef(null)
  const share = TRIP.price

  useEffect(() => () => clearTimeout(timer.current), [])

  const pay = () => {
    setProcessing(true)
    timer.current = setTimeout(() => {
      dispatch({ type: 'PAY', id: MEMBER_ID })
      setProcessing(false)
    }, 1300)
  }

  const backToTrip = () => {
    toast(`Your share is in · ${summary.paid}/${summary.size} paid`)
    go('home')
  }

  // Success: a small receipt and where the group stands. The full ticket was on the previous step.
  if (me.paid) {
    const left = summary.unpaid.length
    return (
      <Screen center footer={<Button onClick={backToTrip}>Back to my trip</Button>}>
        <div className="flex flex-col items-center text-center">
          <div className="grid h-20 w-20 animate-pop place-items-center rounded-full bg-brand-500 shadow-xl shadow-brand-500/30">
            <Check className="h-10 w-10 text-white" strokeWidth={3} />
          </div>
          <h1 className="mt-4 text-[26px] font-bold tracking-tight">Your spot is secured</h1>
          <p className="mt-1 text-sm text-muted">You paid your own share. Nobody fronted it for you.</p>
        </div>

        <Card className="space-y-3 text-sm">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-medium text-muted">Amount paid</p>
              <p className="text-3xl font-extrabold tracking-tight">{usd(share)}</p>
            </div>
            <Stamp>PAID</Stamp>
          </div>
          <div className="space-y-2 border-t border-slate-100 pt-3">
            <Line label="Paid with" value={PAYMENT_METHODS.find((m) => m.id === method).label} />
            <Line label="Traveller" value={me.name} />
            <Line label="Trip" value={`${TRIP.from.code} → ${TRIP.to.code} · ${TRIP.dates}`} />
          </div>
        </Card>

        <Card className="space-y-3 p-4">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-semibold">Your group</span>
            <span className="font-semibold">
              {summary.paid}/{summary.size} <span className="font-normal text-muted">paid</span>
            </span>
          </div>
          <ProgressBar value={summary.paid} max={summary.size} />
          <p className="text-xs text-muted">
            {left ? `The trip is booked once everyone has paid · ${left} to go` : 'Everyone has paid. The organizer can book now.'}
          </p>
        </Card>
      </Screen>
    )
  }

  return (
    <Screen
      footer={
        <Button onClick={pay} disabled={processing}>
          {processing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-4 w-4" />}
          {processing ? 'Processing…' : `Pay ${usd(share)}`}
        </Button>
      }
    >
      <ScreenTitle eyebrow="Your payment" title="Pay only your share" />

      <DeadlineCard deadline={state.deadline} note={state.group.deadlineLabel} />

      <PaymentCard share={share} passenger={me.name} />

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
