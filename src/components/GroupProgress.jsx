import { CreditCard, FileCheck2, Users } from 'lucide-react'
import { Card, ProgressBar } from './ui'

export default function GroupProgress({ summary }) {
  const rows = [
    { Icon: Users, label: 'Members joined', value: summary.joined },
    { Icon: FileCheck2, label: 'Information completed', value: summary.infoDone },
    { Icon: CreditCard, label: 'Payments completed', value: summary.paid },
  ]
  return (
    <Card className="space-y-4">
      {rows.map(({ Icon, label, value }) => {
        const full = value === summary.size
        return (
          <div key={label} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium text-muted">
                <Icon className="h-4 w-4" />
                {label}
              </span>
              <span key={value} className={`animate-pop font-bold ${full ? 'text-brand-600' : 'text-ink'}`}>
                {value}/{summary.size}
              </span>
            </div>
            <ProgressBar value={value} max={summary.size} />
          </div>
        )
      })}
    </Card>
  )
}
