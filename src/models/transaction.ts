import { Schema, Document, models, model } from "mongoose";

export interface TransactionType extends Document {
  description: string;
  amount: number;
  date: string;
  category: string;
}

const TransactionSchema = new Schema<TransactionType>(
  {
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: String, required: true },
    category: {
    type: String,
    required: true,
    enum: [
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
    ],
    },
  },
  { timestamps: true }
);

export const Transaction =
  models.Transaction || model<TransactionType>("Transaction", TransactionSchema);
