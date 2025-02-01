import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Search } from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}

export default function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      date: '2024-02-01',
      description: 'Salary',
      amount: 5000,
      type: 'income',
      category: 'Salary'
    },
    {
      id: '2',
      date: '2024-02-02',
      description: 'Rent',
      amount: 1500,
      type: 'expense',
      category: 'Housing'
    },
    // Add more sample transactions here
  ]);

  const filteredTransactions = transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Recent Transactions
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search transactions..."
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      <div className="space-y-4">
        {filteredTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-full ${
                transaction.type === 'income'
                  ? 'bg-green-100 dark:bg-green-900'
                  : 'bg-red-100 dark:bg-red-900'
              }`}>
                {transaction.type === 'income' ? (
                  <ArrowUpRight className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <ArrowDownRight className="h-5 w-5 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {transaction.description}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <p className={`font-semibold ${
              transaction.type === 'income'
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}>
              {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}