import { useState } from 'react'
import { Button, Card, Screen, ScreenTitle } from '../components/ui'
import { usd } from '../lib/format'
import { deadlineFromHours } from '../state/demoState'
import { useDemo } from '../state/useDemo'

const DEADLINES = [24, 48, 72]

export default function CreateGroup() {
  const { state, summary, dispatch, go } = useDemo()
  const [name, setName] = useState(state.group.name)
  const [deadlineHours, setDeadlineHours] = useState(state.group.deadlineHours)

  const create = () => {
    dispatch({
      type: 'CREATE_GROUP',
      group: { name: name.trim() || state.group.name, deadlineHours },
      deadline: deadlineFromHours(deadlineHours),
    })
    go('invite')
  }

  return (
    <Screen footer={<Button onClick={create}>Create &amp; get invite link</Button>}>
      <ScreenTitle
        eyebrow="Step 1"
        title="Create Group Trip"
        subtitle="One booking. Everyone pays their share."
      />

      <Card className="space-y-5">
        <label className="block">
          <span className="text-sm font-medium text-muted">Group name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-3 text-[15px] font-semibold outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />
        </label>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Travelers</p>
            <p className="text-xs text-muted">{usd(summary.share)} each</p>
          </div>
          <span className="text-lg font-bold">{summary.size}</span>
        </div>

        <div>
          <p className="text-sm font-medium">Everyone pays within</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {DEADLINES.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setDeadlineHours(h)}
                className={`cursor-pointer rounded-2xl border py-2.5 text-sm font-semibold transition ${
                  deadlineHours === h ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-muted'
                }`}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>
      </Card>
    </Screen>
  )
}
