'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Card } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import Link from 'next/link'
import { categoryForPie } from '@/lib/constants/category'
import { format, parseISO } from 'date-fns'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

export interface Transaction {
  _id: string
  amount: number
  category: string
  description: string
  date: string
}

const monthOptions = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'MMM'))

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/transactions')
        setTransactions(res.data.data)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredTransactions = transactions.filter((tx) =>
    format(parseISO(tx.date), 'MMM') === selectedMonth
  )

  const totalExpenses = filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0)
  const pieColors = Object.values(categoryForPie)

  const categoryTotals = filteredTransactions.reduce<Record<string, number>>((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount
    return acc
  }, {})

  const pieData = Object.entries(categoryTotals).map(([category, total]) => ({
    name: category,
    value: total,
  }))

  const highestCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0]

  const mostRecent = [...transactions].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 5)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center mb-2 mt-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of your finances at a glance</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Summary Cards */}
        <Card className="p-4">
          <h2 className="text-blue-600 text-md">Total Expenses ({selectedMonth})</h2>
          <p className="text-2xl font-bold text-blue-800">₹{totalExpenses.toFixed(2)}</p>
        </Card>
        <Card className="p-4">
          <h2 className="text-blue-600 text-md">Highest Spending Category ({selectedMonth})</h2>
          <p className="text-2xl font-semibold text-blue-800">{highestCategory || 'N/A'}</p>
        </Card>
        <Card className="p-4">
          <h2 className="text-blue-600 text-md">Total Transactions in {selectedMonth}</h2>
          <p className="text-2xl font-semibold text-blue-800">{filteredTransactions.length}</p>
        </Card>

        {/* Pie Chart with Month Selector */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-2 p-4 relative min-h-[300px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-blue-600">
                Spending Overview: Category-wise
              </h2>

              {/* Month Selector */}
              <Select onValueChange={setSelectedMonth} defaultValue={selectedMonth}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {pieData.length === 0 ? (
              <div className="flex flex-col justify-center items-center text-gray-500 text-sm">
                 <h2 className="text-xl font-semibold text-gray-700 mb-2">No transactions for {selectedMonth}</h2>
                  <p className="text-gray-500 text-sm">You haven't added any transactions this month yet.</p>
                  <Link href="/transactions" className="mt-4 text-blue-600 underline text-sm">Add your first transaction</Link>
              </div>
            ) :  (
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-between gap-2">
                {/* Pie Chart */}
                <ResponsiveContainer width={550} height={350}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                    >
                      {pieData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={pieColors[index % pieColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                {/* colour index */}
                <div className="space-y-2 text-sm bg-white/80 p-2 rounded-md">
                  {Object.entries(categoryForPie).map(([category, color]) => (
                    <div key={category} className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      ></span>
                      <span className="text-gray-700">{category}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        {/* Recent Transactions */}
        <Card className="col-span-1 lg:col-span-1 p-4 overflow-auto">
          <h2 className="text-lg font-semibold text-blue-600 mb-4">Recent Transactions</h2>
          <ul className="space-y-2 text-sm">
            {mostRecent.map((tx) => (
              <li key={tx._id} className="border-b pb-2">
                <div className="font-medium text-gray-800">
                  ₹{tx.amount.toFixed(2)} - {tx.category}
                </div>
                <div className="text-gray-500">{tx.description}</div>
                <div className="text-gray-400 text-xs">
                  {new Date(tx.date).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
          <Link href="/transactions" className="text-blue-600 text-sm mt-2 inline-block">
            View all →
          </Link>
        </Card>
      </div>
    </>
  )
}
