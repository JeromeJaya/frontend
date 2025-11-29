import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Users, FileText, CreditCard, BarChart3, Bell } from 'lucide-react';

export default function DashboardLayout({ children, activeTab, onTabChange }) {
  const { merchantProfile, signOut } = useAuth();

  const navigation = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'customers', name: 'Customers', icon: Users },
    { id: 'mandates', name: 'Mandates', icon: FileText },
    { id: 'transactions', name: 'Transactions', icon: CreditCard },
    { id: 'notifications', name: 'Notifications', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">ER</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">E-Rubuy</h1>
                <p className="text-xs text-slate-500">{merchantProfile?.business_name}</p>
              </div>
            </div>

            <button
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          <aside className="w-64 flex-shrink-0">
            <nav className="bg-white rounded-xl shadow-sm border border-slate-200 p-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <main className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}