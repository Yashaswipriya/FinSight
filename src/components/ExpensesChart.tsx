'use client'
import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import axios from 'axios'
import { format, parseISO } from 'date-fns'

interface Transaction {
  _id: string
  amount: number
  description: string
  date: string
}

export default function ExpensesBarChart() {
  const [data, setData] = useState<{ month: string; total: number }[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get('/api/transactions')
      const transactions: Transaction[] = res.data.data

      const grouped: Record<string, number> = {}

      transactions.forEach(tx => {
        const month = format(parseISO(tx.date), 'MMM')
        grouped[month] = (grouped[month] || 0) + tx.amount
      })

      const formatted = Object.entries(grouped)
        .map(([month, total]) => ({ month, total }))
        .sort((a, b) => new Date(`2024 ${a.month}`).getMonth() - new Date(`2024 ${b.month}`).getMonth())

      setData(formatted)
    }

    fetchData()
  }, [])

  return (
    <div className='px-2 sm:px-6 md:px-8 py-4'>
    <Card className="w-full h-[330px]">
      <CardContent className="h-full p-4">
        <h2 className="text-lg font-semibold mb-4 text-blue-700">Monthly Expenses</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: number) => `₹${value}`} />
            <Bar dataKey="total" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
    </div>
  )
}
