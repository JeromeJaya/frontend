import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import Overview from './components/Dashboard/Overview';
import Customers from './components/Dashboard/Customers';
import Mandates from './components/Dashboard/Mandates';
import Transactions from './components/Dashboard/Transactions';
import Notifications from './components/Dashboard/Notifications';
import LandingPage from './components/LandingPage';
import PrivacyPolicy from './components/Legal/PrivacyPolicy';
import TermsConditions from './components/Legal/TermsConditions';

function AuthWrapper() {
  const [isLogin, setIsLogin] = useState(true);
  
  console.log('AuthWrapper rendered, isLogin:', isLogin);

  return isLogin ? (
    <Login onToggleMode={() => {
      console.log('Toggling to Register mode');
      setIsLogin(false);
    }} />
  ) : (
    <Register onToggleMode={() => {
      console.log('Toggling to Login mode');
      setIsLogin(true);
    }} />
  );
}

function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'customers':
        return <Customers />;
      case 'mandates':
        return <Mandates />;
      case 'transactions':
        return <Transactions />;
      case 'notifications':
        return <Notifications />;
      default:
        return <Overview />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-conditions" element={<TermsConditions />} />
      <Route path="/login" element={<AuthWrapper />} />
      <Route path="/dashboard/*" element={user ? <Dashboard /> : <AuthWrapper />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;