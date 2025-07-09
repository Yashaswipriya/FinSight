'use client'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import axios from "axios"
import { useEffect, useState } from "react"
import { categoryForPie } from "@/lib/constants/category"
import type { Transaction } from '../page'
import { toast } from 'sonner'
import BudgetComparisonChart from "@/components/BudgetComparisionChart"

export default function BudgetsPage() {
    const [month, setMonth] = useState(() => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
})

const [budgets, setBudgets] = useState<Record<string, number>>({})
const [transactions, setTransactions] = useState<Transaction[]>([])
const [saving, setSaving] = useState(false)

useEffect(() => {
  const fetchBudgets = async () => {
    try {
      const res = await axios.get(`/api/budgets?month=${month}`)
      const data: Transaction[] = res.data.data;
      const parsed = Object.fromEntries(data.map(b => [b.category, b.amount]))
      setBudgets(parsed)
    } catch (err) {
      console.error('Error fetching budgets:', err)
    }
  }

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('/api/transactions')
      const filtered = res.data.data.filter((tx: Transaction) => tx.date.startsWith(month))
      setTransactions(filtered)
    } catch (err) {
      console.error('Error fetching transactions:', err)
    }
  }

  fetchBudgets()
  fetchTransactions()
}, [month])

const handleSave = async () => {
  setSaving(true)
  const payload = Object.entries(budgets).map(([category, amount]) => ({
    category,
    amount,
    month,
  }))

  try {
    await axios.post('/api/budgets', payload)
    toast.success("Budget saved successfully!")
  } catch (err) {
    console.error(err)
    toast.error("Failed to save budget. Please try again.")
  } finally {
    setSaving(false)
  }
}

const generateInsights = () => {
  const insights: string[] = []

  Object.keys(categoryForPie).forEach((cat) => {
    const budget = budgets[cat]
    const spent = transactions
      .filter((tx) => tx.category === cat)
      .reduce((sum, tx) => sum + tx.amount, 0)

    if (budget === undefined) return // Skip if no budget set

    if (spent === 0) {
      insights.push(`No spending yet in ${cat} this month.`)
    } else if (spent > budget) {
      insights.push(`You've exceeded your ${cat} budget by ₹${(spent - budget).toFixed(2)}.`)
    } else if (spent < budget && spent > 0) {
      const percent = Math.round((spent / budget) * 100)
      insights.push(`You've used ${percent}% of your ${cat} budget.`)
    }
  })

  return insights
}
const insights = generateInsights()

    return(
        <>
        <div className="text-center mb-6 mt-8">
        <h1 className="text-2xl font-bold text-gray-800">Budgets</h1>
        <p className="text-sm text-gray-500">
            Set monthly spending limits by category and track how close you&apos;re getting.
        </p>
        </div>
    <div className="px-2 sm:px-6 md:px-8 py-4">
    <Card className="p-4 max-w-5xl mx-auto mt-6 mb-6">
  <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
    <h2 className="text-xl font-semibold text-blue-600">Monthly Budgets</h2>
    <Select value={month} onValueChange={setMonth}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select month" />
      </SelectTrigger>
      <SelectContent>
        {Array.from({ length: new Date().getMonth() + 1 }).map((_, i) => {
          const d = new Date()
          d.setMonth(d.getMonth() - i)
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
          return <SelectItem key={key} value={key}>{key}</SelectItem>
        })}
      </SelectContent>
    </Select>
  </div>

  <div className="overflow-x-auto">
    <table className="min-w-full text-sm">
      <thead className="text-left text-gray-600">
        <tr>
          <th className="p-2">Category</th>
          <th className="p-2">Budget (₹)</th>
          <th className="p-2">Spent (₹)</th>
          <th className="p-2">Difference</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(categoryForPie).map((cat) => {
          const budget = budgets[cat] ?? 0
          const spent = transactions.filter(tx => tx.category === cat).reduce((sum, tx) => sum + tx.amount, 0)
          const diff = budget - spent
          return (
            <tr key={cat} className="border-t">
              <td className="p-2">{cat}</td>
              <td className="p-2">
              <Input
                type="number"
                inputMode="numeric"
                value={budgets[cat] === 0 ? '' : budgets[cat]}
                onChange={(e) => {
                    const value = e.target.value
                    const parsed = value === '' ? 0 : parseFloat(value)
                    if (!isNaN(parsed) && parsed >= 0) {
                    setBudgets((prev) => ({ ...prev, [cat]: parsed }))
                    }
                }}
                min={0}
                />
              </td>
              <td className="p-2 text-blue-800">{spent.toFixed(2)}</td>
              <td className={`p-2 ${diff < 0 ? 'text-red-600' : 'text-green-600'}`}>
                {diff.toFixed(2)}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>

  <div className="flex justify-end mt-4">
    <Button onClick={handleSave} disabled={saving}>
      {saving ? 'Saving...' : 'Save Budgets'}
    </Button>


  </div>
</Card>
<Card className="p-4 max-w-5xl mx-auto mt-6 mb-6">
    <BudgetComparisonChart budgets={budgets} transactions={transactions} />
    <div className="mt-8">
  <h3 className="text-lg font-semibold mb-2 text-blue-600">Spending Insights</h3>
  {insights.length === 0 ? (
    <p className="text-gray-500 text-sm">No insights available yet. Set budgets and add transactions to see insights.</p>
  ) : (
    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
      {insights.map((insight, idx) => (
        <li key={idx} dangerouslySetInnerHTML={{ __html: insight }} />
      ))}
    </ul>
  )}
</div>
</Card>
</div>
</>
    )
}