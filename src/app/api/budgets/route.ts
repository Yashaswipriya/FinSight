import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { Budget } from '@/models/budget'

export async function GET(req: Request) {
  await connectToDatabase()
  const { searchParams } = new URL(req.url)
  const month = searchParams.get('month')
//for a single month
  if (!month) {
    return NextResponse.json({ error: 'Month is required' }, { status: 400 })
  }

  const budgets = await Budget.find({ month })
  return NextResponse.json({ data: budgets })
}

// to insert budgets
export async function POST(req: Request) {
  await connectToDatabase()
  const body = await req.json()

  if (!Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  try {
    const ops = body.map((item) => ({
      updateOne: {
        filter: { month: item.month, category: item.category },
        update: { $set: { amount: item.amount } },
        upsert: true,
      },
    }))

    await Budget.bulkWrite(ops)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving budgets:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

