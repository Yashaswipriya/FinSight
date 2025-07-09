'use client'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { Pencil, Trash2, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from './ui/input'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { categoryForList } from '@/lib/constants/category'

interface Transaction {
  _id: string
  amount: number
  description: string
  date: string
  category: string
}

const EditableInput = ({
  value,
  onChange,
  type = 'text',
}: {
  value: string | number
  onChange: (value: string | number) => void
  type?: 'text' | 'number'
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <Input
      ref={inputRef}
      value={value.toString()}
      onChange={(e) => {
        const newValue = type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value
        onChange(newValue)
      }}
      type={type}
      className="w-full"
    />
  )
}

const DatePicker = ({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="relative flex items-center">
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type="date"
        className="w-full pr-10"
      />
    </div>
  )
}

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, _setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<{
    description: string
    amount: number
    date: string
    category: string
  }>({
    description: '',
    amount: 0,
    date: '',
    category: '',
  })

  const startEdit = (tx: Transaction) => {
    setEditingId(tx._id)
    setEditForm({
      description: tx.description,
      amount: tx.amount,
      date: tx.date.slice(0, 10),
      category: tx.category || 'Other',
    })
  }

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get('/api/transactions')
        setTransactions(res.data.data)
      } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Something went wrong.';
      toast.error(`Failed to load transaction transaction: ${errorMessage}`);
    }
      finally {
              setLoading(false)
            }
    }

    fetchTransactions()
  }, [])

  const handleEdit = async (id: string) => {
    try {
      const res = await axios.patch(`/api/transactions/${id}`, editForm)
      const updated = res.data.data

      setTransactions((prev) =>
        prev.map((tx) => (tx._id === id ? updated : tx))
      )

      toast.success('Transaction updated')
      setEditingId(null)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Something went wrong.';
      toast.error(`Failed to update: ${errorMessage}`);
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/transactions/${id}`)
      setTransactions((prev) => prev.filter((t) => t._id !== id))
    } catch {
      alert('Delete failed')
    }
  }

  const updateEditForm = (
    field: keyof typeof editForm,
    value: string | number
  ) => {
    setEditForm((prev) => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="flex justify-center mt-6">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>
  }

  return (
    <div className='px-2 sm:px-6 md:px-8 py-4'>
    <Card className="mt-8 w-full overflow-x-auto mb-4">
      <table className="min-w-full text-sm">
        <thead className="bg-blue-50">
          <tr>
            <th className="text-left px-4 py-2 font-semibold text-blue-700">Date</th>
            <th className="text-left px-4 py-2 font-semibold text-blue-700">Description</th>
            <th className="text-left px-4 py-2 font-semibold text-blue-700">Amount</th>
            <th className="text-left px-4 py-2 font-semibold text-blue-700">Category</th>
            <th className="text-left px-4 py-2 font-semibold text-blue-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx._id} className="border-t">
              <td className="px-4 py-2">
                {editingId === tx._id ? (
                  <DatePicker
                    value={editForm.date}
                    onChange={(value) => updateEditForm('date', value)}
                  />
                ) : (
                  tx.date
                )}
              </td>
              <td className="px-4 py-2">
                {editingId === tx._id ? (
                  <EditableInput
                    value={editForm.description}
                    onChange={(value) =>
                      updateEditForm('description', value as string)
                    }
                    type="text"
                  />
                ) : (
                  tx.description
                )}
              </td>
              <td className="px-4 py-2">
                {editingId === tx._id ? (
                  <EditableInput
                    value={editForm.amount}
                    onChange={(value) =>
                      updateEditForm('amount', value as number)
                    }
                    type="number"
                  />
                ) : (
                  tx.amount
                )}
              </td>
              <td className="px-4 py-2">
                {editingId === tx._id ? (
                  <select
                    value={editForm.category}
                    onChange={(e) =>
                      updateEditForm('category', e.target.value)
                    }
                    className="w-full border rounded px-2 py-1 text-sm"
                  >
                    {Object.keys(categoryForList).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span
                    className={cn(
                      'text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap',
                      categoryForList[tx.category] || 'bg-gray-100 text-gray-800'
                    )}
                  >
                    {tx.category || 'Other'}
                  </span>
                )}
              </td>
              <td className="px-4 py-2">
                {editingId === tx._id ? (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleEdit(tx._id)}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => startEdit(tx)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(tx._id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
    </div>
  )
}
