import mongoose from 'mongoose'

const BudgetSchema = new mongoose.Schema({
  month: {
    type: String, // Format: '2025-07'
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
}, { timestamps: true })

BudgetSchema.index({ month: 1, category: 1 }, { unique: true }) 

export const Budget = mongoose.models.Budget || mongoose.model('Budget', BudgetSchema)
