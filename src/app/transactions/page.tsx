'use client'
import ExpensesBarChart from '@/components/ExpensesChart'
import TransactionForm from '@/components/TransactionForm'
import TransactionList from '@/components/TransactionList'
import { useState } from 'react'

export default function TransactionsPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
   <div className="max-w-5xl mx-auto mt-8 space-y-6">
    <div className="text-center mb-6">
  <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
  <p className="text-sm text-gray-500">Track your expenses, add transactions, and visualize your spending habits.</p>
</div>

  <div className="flex flex-col md:flex-row gap-6">
    <div className="md:w-1/2">
      <TransactionForm onSuccess={handleSuccess} />
    </div>
    <div className="md:w-1/2">
      <ExpensesBarChart key={refreshKey} />
    </div>
  </div>
    <TransactionList key={refreshKey}/>
</div>

  )
}
