'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const formSchema = z.object({
  description: z.string().min(1, 'Required'),
  amount: z.number({ invalid_type_error: 'Must be a number' }),
  date: z.string().min(1, 'Required'),
  category: z.string().min(1, 'Required'),
})

type FormValues = z.infer<typeof formSchema>

export default function TransactionForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true)

      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error('Failed to add')

      toast.success('Transaction added')
      reset()
      onSuccess?.()
    } catch (error)
     {
      toast.error('Error adding transaction')
    } finally {
      setLoading(false)
    }
  }

  const selectedCategory = watch('category')

  return (
    <div className='px-2 sm:px-6 md:px-8 py-4'>
    <Card className="md:max-w-md flex-1 h-full">
      <CardContent className="p-4-2 space-y-6 flex flex-col justify-between h-full">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-blue-700">Add Transaction</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Category Select */}
            <div>
              <Select
                onValueChange={(value) => setValue('category', value)}
                value={selectedCategory}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    'Food',
                    'Transportation',
                    'Utilities',
                    'Housing',
                    'Entertainment',
                    'Healthcare',
                    'Shopping',
                    'Education',
                    'Savings',
                    'Other',
                  ].map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <Input placeholder="Description" {...register('description')} />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* Amount */}
            <div>
              <Input
                placeholder="Amount"
                type="number"
                {...register('amount', { valueAsNumber: true })}
              />
              {errors.amount && (
                <p className="text-sm text-red-500 mt-1">{errors.amount.message}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <Input type="date" {...register('date')} />
              {errors.date && (
                <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Adding...' : 'Add Transaction'}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}
