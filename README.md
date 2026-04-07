# 💸 FinSight – Personal Finance Tracker

FinSight is a full-stack web application that helps users efficiently manage their personal finances. It allows users to track **transactions**, **visualize expenses**, **categorize spending**, and even **set monthly budgets** — all in a clean and intuitive interface.

This project was built with modern tools like **Next.js**, **MongoDB**, **Tailwind CSS**, **shadcn/ui**, and **Recharts**, ensuring both performance and scalability.

> ✅ Live Demo: [https://fin-sight-flame.vercel.app/]

---

## ✨ Features

### ✅ Stage 1: Basic Transaction Tracking
- Add, edit, and delete transactions
- View transactions in a scrollable, responsive list
- Monthly expense **bar chart** to visualize spending trends
- Input form with validation and error handling

### 🧠 Stage 2: Categorization & Dashboard
- Predefined categories for transactions (Food, Transport, etc.)
- Category-wise **Pie Chart** showing proportional spending
- Interactive dashboard with:
  - Total monthly expenses
  - Breakdown by category
  - Most recent transactions list

### 📊 Stage 3: Budgeting
- Set monthly budgets per category
- Compare budget vs actual spend
- Smart insights highlighting overspending or safe zones
- Intuitive UI for monthly planning and financial awareness

---

## 🛠️ Tech Stack

| Layer        | Tech Used                                |
|--------------|-------------------------------------------|
| Frontend     | React, Next.js, Tailwind CSS, shadcn/ui   |
| Charts       | Recharts                                  |
| Backend      | Next.js API Routes                        |
| Database     | MongoDB (Mongoose ORM)                    |
| Validation   | React Hook Form, Zod                      |
| Deployment   | Vercel                                     |

---

## 📁 Folder Structure
```text
src/
├── app/
│   ├── api/
│   │   ├── transactions/       # Backend API route for transactions (GET, POST, DELETE)
│   │   └── budgets/            # Backend API route for budgets
│   ├── transactions/           # Transactions page (page.tsx)
│   ├── budgets/                # Budgets page (page.tsx)
│   └── page.tsx                # Dashboard (homepage)
│
├── components/
│   ├── charts/                 # Reusable BarCharts
│   ├── forms/                  # TransactionForm, BudgetForm
│   └── ui/                     # shadcn/ui components (Button, Card, etc.)
│
├── lib/
│   ├── db.ts                   # MongoDB connection helper
│   └── utils.ts                # Chart helpers, category-color mapping
│
└── models/
    ├── transaction.ts          # Mongoose schema for transactions
    └── budget.ts               # Mongoose schema for budgets
```



