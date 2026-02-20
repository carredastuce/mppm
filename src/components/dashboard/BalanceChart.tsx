import { useState, useMemo } from 'react'
import { subDays, format, startOfDay, eachDayOfInterval } from 'date-fns'
import { fr } from 'date-fns/locale'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Transaction } from '../../types'

interface BalanceChartProps {
  transactions: Transaction[]
}

type Range = 7 | 30 | 'all'

function buildChartData(transactions: Transaction[], range: Range) {
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const today = startOfDay(new Date())
  let startDate: Date

  if (range === 'all') {
    startDate = sorted.length > 0 ? startOfDay(new Date(sorted[0].date)) : subDays(today, 30)
  } else {
    startDate = subDays(today, range - 1)
  }

  // Calculer le solde avant startDate (running balance initial)
  const initialBalance = sorted
    .filter((tx) => startOfDay(new Date(tx.date)) < startDate)
    .reduce((acc, tx) => (tx.type === 'income' ? acc + tx.amount : acc - tx.amount), 0)

  const days = eachDayOfInterval({ start: startDate, end: today })

  let balance = initialBalance
  return days.map((day) => {
    const dayStr = startOfDay(day).toISOString()
    const dayTxs = sorted.filter(
      (tx) => startOfDay(new Date(tx.date)).toISOString() === dayStr
    )
    dayTxs.forEach((tx) => {
      balance = tx.type === 'income' ? balance + tx.amount : balance - tx.amount
    })
    return {
      date: format(day, range === 7 ? 'EEE' : 'd MMM', { locale: fr }),
      solde: Math.round(balance * 100) / 100,
    }
  })
}

const RANGE_OPTIONS: { label: string; value: Range }[] = [
  { label: '7j', value: 7 },
  { label: '30j', value: 30 },
  { label: 'Tout', value: 'all' },
]

export default function BalanceChart({ transactions }: BalanceChartProps) {
  const [range, setRange] = useState<Range>(30)

  const data = useMemo(() => buildChartData(transactions, range), [transactions, range])
  const finalBalance = data.length > 0 ? data[data.length - 1].solde : 0
  const lineColor = finalBalance >= 0 ? '#22c55e' : '#ef4444'

  if (transactions.length === 0) return null

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-900">📈 Évolution du solde</h3>
        <div className="flex gap-1">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setRange(opt.value)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                range === opt.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}€`}
            width={45}
          />
          <Tooltip
            formatter={(value: number | undefined) => [`${(value ?? 0).toFixed(2)}€`, 'Solde']}
            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: 12 }}
          />
          <ReferenceLine y={0} stroke="#e5e7eb" strokeDasharray="3 3" />
          <Line
            type="monotone"
            dataKey="solde"
            stroke={lineColor}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
