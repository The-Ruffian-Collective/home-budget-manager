import React from 'react';
import { AlertCircle } from 'lucide-react';

interface Budget {
  category: string;
  budgeted: number;
  spent: number;
}

export default function BudgetOverview() {
  const budgets: Budget[] = [
    { category: 'Housing', budgeted: 2000, spent: 1500 },
    { category: 'Food', budgeted: 600, spent: 520 },
    { category: 'Transportation', budgeted: 400, spent: 350 },
    { category: 'Entertainment', budgeted: 300, spent: 280 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Budget Overview
      </h2>
      <div className="space-y-6">
        {budgets.map((budget) => {
          const percentage = (budget.spent / budget.budgeted) * 100;
          const isNearLimit = percentage >= 80;

          return (
            <div key={budget.category} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {budget.category}
                  </span>
                  {isNearLimit && (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ${budget.spent.toLocaleString()} / ${budget.budgeted.toLocaleString()}
                </span>
              </div>
              <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded">
                <div
                  className={`absolute left-0 top-0 h-full rounded ${
                    isNearLimit ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}