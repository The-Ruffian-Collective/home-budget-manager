import React from 'react';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  trend?: number;
}

function SummaryCard({ title, amount, icon, trend }: SummaryCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            ${amount.toLocaleString()}
          </p>
          {trend !== undefined && (
            <p className={`mt-2 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? '+' : ''}{trend}% from last month
            </p>
          )}
        </div>
        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SummaryCard
        title="Total Balance"
        amount={25000}
        icon={<Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
      />
      <SummaryCard
        title="Monthly Income"
        amount={8500}
        icon={<TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />}
        trend={12.5}
      />
      <SummaryCard
        title="Monthly Expenses"
        amount={3200}
        icon={<TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />}
        trend={-8.3}
      />
    </div>
  );
}