'use client'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from 'recharts'

type Props = {
  budgets: Record<string, number>
  transactions: { category: string; amount: number }[]
}

export default function BudgetComparisonChart({ budgets, transactions }: Props) {
  const chartData = Object.keys(budgets).map((category) => {
    const spent = transactions
      .filter((tx) => tx.category === category)
      .reduce((sum, tx) => sum + tx.amount, 0)

    return {
      category,
      Budget: budgets[category] || 0,
      Spent: spent,
    }
  })

  // In case some categories were spent on but not budgeted for:
 const allCategories = Array.from(
  new Set([
    ...Object.keys(budgets).filter((cat) => budgets[cat] > 0),
    ...transactions.map((tx) => tx.category),
  ])
)

  const completeData = allCategories.map((category) => {
    const spent = transactions
      .filter((tx) => tx.category === category)
      .reduce((sum, tx) => sum + tx.amount, 0)

    return {
      category,
      Budget: budgets[category] || 0,
      Spent: spent,
    }
  })

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-blue-600 mb-2">Budget vs Actual Spending</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={completeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Budget" fill="#8884d8" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Spent" fill="#82ca9d" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
