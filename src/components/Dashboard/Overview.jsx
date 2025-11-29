import { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { TrendingUp, Users, FileText, DollarSign } from 'lucide-react';

export default function Overview() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeMandates: 0,
    totalRevenue: 0,
    successfulTransactions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [customers, mandates, transactions] = await Promise.all([
        axios.get('/customers'),
        axios.get('/mandates'),
        axios.get('/transactions'),
      ]);

      const activeMandatesCount = mandates.data.filter(m => m.status === 'active').length;
      const successfulTxns = transactions.data.filter(t => t.status === 'success');
      const totalRevenue = successfulTxns.reduce((sum, t) => sum + (t.amount || 0), 0);

      setStats({
        totalCustomers: customers.data.filter(c => c.isActive).length,
        activeMandates: activeMandatesCount,
        totalRevenue,
        successfulTransactions: successfulTxns.length,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Mandates',
      value: stats.activeMandates,
      icon: FileText,
      color: 'bg-green-500',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
      icon: DollarSign,
      color: 'bg-orange-500',
    },
    {
      title: 'Successful Payments',
      value: stats.successfulTransactions,
      icon: TrendingUp,
      color: 'bg-teal-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Loading statistics...</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl p-6 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-slate-600 text-sm font-medium mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Welcome to E-Rubuy</h3>
        <p className="text-blue-700 leading-relaxed">
          Your automated payment collection system is ready. Manage customers, set up recurring mandates,
          and track all transactions in one secure platform. All payments are processed through our secure
          payment gateway with military-grade encryption.
        </p>
      </div>
    </div>
  );
}