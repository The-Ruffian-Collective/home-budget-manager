import React, { Suspense } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import SummaryCards from '../components/SummaryCards';
import useDarkMode from '../hooks/useDarkMode';

const TransactionHistory = React.lazy(() => import('../components/TransactionHistory'));
const BudgetOverview = React.lazy(() => import('../components/BudgetOverview'));
const ExpenseChart = React.lazy(() => import('../components/ExpenseChart'));
const SpendingTrends = React.lazy(() => import('../components/SpendingTrends'));

function LoadingFallback() {
  return (
    <div className="animate-pulse">
      <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>
  );
}

export default function Dashboard() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <DashboardLayout toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}>
      <div className="space-y-6">
        <SummaryCards />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Suspense fallback={<LoadingFallback />}>
            <TransactionHistory />
          </Suspense>
          <Suspense fallback={<LoadingFallback />}>
            <BudgetOverview />
          </Suspense>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Suspense fallback={<LoadingFallback />}>
            <ExpenseChart />
          </Suspense>
          <Suspense fallback={<LoadingFallback />}>
            <SpendingTrends />
          </Suspense>
        </div>
      </div>
    </DashboardLayout>
  );
}