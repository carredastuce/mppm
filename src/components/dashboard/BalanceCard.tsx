import { Wallet } from 'lucide-react'
import { formatCurrency } from '../../utils/formatters'

interface BalanceCardProps {
  balance: number
}

export default function BalanceCard({ balance }: BalanceCardProps) {
  const isLow = balance < 10 && balance > 0
  const isNegative = balance < 0

  return (
    <div
      className={`bg-gradient-to-br from-primary to-blue-600 text-white rounded-2xl shadow-xl p-8 ${
        isNegative ? 'from-danger to-red-600' : isLow ? 'from-warning to-amber-600' : ''
      }`}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-white bg-opacity-20 p-4 rounded-full">
          <Wallet size={40} />
        </div>
        <div>
          <p className="text-lg opacity-90">Mon solde actuel</p>
          <p className="text-5xl font-bold">{formatCurrency(balance)}</p>
        </div>
      </div>

      {balance === 0 && (
        <p className="text-sm opacity-80">
          Commence par ajouter tes revenus pour voir ton solde augmenter ! 💪
        </p>
      )}

      {isLow && (
        <p className="text-sm opacity-80">
          Attention, ton solde est un peu faible ! 💡
        </p>
      )}

      {isNegative && (
        <p className="text-sm opacity-80">
          Oups ! Tu as dépensé plus que ce que tu avais. 😅
        </p>
      )}

      {balance > 50 && (
        <p className="text-sm opacity-80">
          Bravo ! Tu gères bien ton argent ! 🎉
        </p>
      )}
    </div>
  )
}
