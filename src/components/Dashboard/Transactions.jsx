import { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { CheckCircle, XCircle, Clock, DollarSign, Calendar, RefreshCw, Download, Plus, Send } from 'lucide-react';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [refreshingId, setRefreshingId] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const { data } = await axios.get('/transactions');
      setTransactions(data);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(
    (t) => filterStatus === 'all' || t.status === filterStatus
  );

  const refreshStatus = async (transactionId) => {
    setRefreshingId(transactionId);
    try {
      const { data } = await axios.get(`/payments/status/${transactionId}`);
      setTransactions(prev => prev.map(t => t._id === transactionId ? data.transaction : t));
      
      if (data.transaction.status === 'success') {
        alert('✅ Payment accepted by customer!');
      } else if (data.transaction.status === 'failed') {
        alert('❌ Payment was rejected or failed.');
      }
    } catch (error) {
      console.error('Failed to refresh status:', error);
      alert('Failed to refresh status');
    } finally {
      setRefreshingId(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'refunded':
        return <RefreshCw className="w-5 h-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'refunded':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const exportToCSV = () => {
    const csvData = filteredTransactions.map(t => ({
      Date: new Date(t.paymentDate).toLocaleDateString(),
      Customer: t.customerId?.name,
      Email: t.customerId?.email,
      Amount: t.amount,
      Status: t.status,
      Reference: t.transactionReference || 'N/A',
      ProcessedAt: t.processedAt ? new Date(t.processedAt).toLocaleString() : 'N/A',
    }));

    const headers = Object.keys(csvData[0]).join(',');
    const rows = csvData.map(row => Object.values(row).join(','));
    const csv = [headers, ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const calculateStats = () => {
    const total = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
    const successful = filteredTransactions.filter(t => t.status === 'success');
    const successAmount = successful.reduce((sum, t) => sum + t.amount, 0);
    const failed = filteredTransactions.filter(t => t.status === 'failed').length;

    return { total, successAmount, successful: successful.length, failed };
  };

  const stats = calculateStats();

  if (loading) {
    return <div className="text-center py-12 text-slate-600">Loading transactions...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Transactions</h2>

        <div className="flex gap-2">
          <button
            onClick={() => setShowPaymentModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
            Request Payment
          </button>
          <button
            onClick={exportToCSV}
            disabled={filteredTransactions.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <p className="text-xs text-blue-600 font-medium mb-1">Total Transactions</p>
          <p className="text-2xl font-bold text-blue-900">{filteredTransactions.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
          <p className="text-xs text-green-600 font-medium mb-1">Successful</p>
          <p className="text-2xl font-bold text-green-900">{stats.successful}</p>
          <p className="text-xs text-green-700">₹{stats.successAmount.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
          <p className="text-xs text-red-600 font-medium mb-1">Failed</p>
          <p className="text-2xl font-bold text-red-900">{stats.failed}</p>
        </div>
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-600 font-medium mb-1">Total Amount</p>
          <p className="text-2xl font-bold text-slate-900">₹{stats.total.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6">
        {['all', 'success', 'pending', 'failed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filterStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-600">
            {filterStatus === 'all' ? 'No transactions yet' : `No ${filterStatus} transactions`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction._id}
              className="border border-slate-200 rounded-lg p-5 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="mt-1">{getStatusIcon(transaction.status)}</div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">
                          {transaction.customerId?.name || 'Unknown Customer'}
                        </h3>
                        <p className="text-sm text-slate-600">{transaction.customerId?.email}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm mt-3">
                      <div>
                        <span className="text-slate-500">Amount:</span>{' '}
                        <span className="font-semibold text-slate-900">
                          ₹{transaction.amount.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-500">Frequency:</span>{' '}
                        <span className="font-medium text-slate-900 capitalize">
                          {transaction.mandateId?.frequency || 'N/A'}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-500">Payment Date:</span>{' '}
                        <span className="font-medium text-slate-900">
                          {new Date(transaction.paymentDate).toLocaleDateString()}
                        </span>
                      </div>

                      {transaction.processedAt && (
                        <div>
                          <span className="text-slate-500">Processed:</span>{' '}
                          <span className="font-medium text-slate-900">
                            {new Date(transaction.processedAt).toLocaleString()}
                          </span>
                        </div>
                      )}

                      {transaction.retryCount > 0 && (
                        <div>
                          <span className="text-slate-500">Retries:</span>{' '}
                          <span className="font-medium text-orange-600">{transaction.retryCount}</span>
                        </div>
                      )}
                    </div>

                    {transaction.failureReason && (
                      <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                        <span className="font-medium">Failure Reason:</span> {transaction.failureReason}
                      </div>
                    )}

                    {transaction.transactionReference && (
                      <div className="mt-3 text-xs text-slate-500">
                        Ref: <span className="font-mono">{transaction.transactionReference}</span>
                      </div>
                    )}

                    {/* Refresh Status Button */}
                    {transaction.status === 'pending' && transaction.gateway === 'razorpay' && (
                      <div className="mt-3">
                        <button
                          onClick={() => refreshStatus(transaction._id)}
                          disabled={refreshingId === transaction._id}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition disabled:opacity-50"
                        >
                          <RefreshCw className={`w-4 h-4 ${refreshingId === transaction._id ? 'animate-spin' : ''}`} />
                          {refreshingId === transaction._id ? 'Checking...' : 'Refresh Status'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showPaymentModal && (
        <PaymentRequestModal 
          onClose={() => setShowPaymentModal(false)} 
          onSuccess={loadTransactions} 
        />
      )}
    </div>
  );
}

function PaymentRequestModal({ onClose, onSuccess }) {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    customerId: '',
    amount: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [error, setError] = useState('');
  const [scriptLoading, setScriptLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
    loadRazorpayScript();
  }, []);

  const loadRazorpayScript = () => {
    // Check if script is already loaded
    if (window.Razorpay) {
      setScriptLoading(false);
      return Promise.resolve(true);
    }

    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        console.log('Razorpay script loaded successfully');
        setScriptLoading(false);
        resolve(true);
      };
      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        setScriptLoading(false);
        setError('Failed to load payment gateway. Please try again.');
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const loadCustomers = async () => {
    try {
      const { data } = await axios.get('/customers');
      setCustomers(data.filter(c => c.isActive !== false));
    } catch (error) {
      console.error('Failed to load customers:', error);
      setError('Failed to load customers');
    } finally {
      setLoadingCustomers(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.customerId || !formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please fill all fields correctly');
      return;
    }

    // Wait for Razorpay script to load
    if (scriptLoading) {
      setError('Payment gateway is still loading. Please wait a moment...');
      return;
    }

    if (!window.Razorpay) {
      setError('Payment gateway failed to load. Please refresh the page and try again.');
      return;
    }

    setLoading(true);

    try {
      // Create payment request
      const { data } = await axios.post('/payments/create', {
        customerId: formData.customerId,
        amount: parseFloat(formData.amount),
      });

      console.log('Payment request created:', data);

      // Open Razorpay Checkout
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: 'INR',
        name: 'E-Mandate Payment',
        description: 'Payment Request',
        order_id: data.orderId,
        prefill: {
          name: data.customer.name,
          email: data.customer.email,
          contact: data.customer.contact,
        },
        theme: {
          color: '#0b5cff',
        },
        handler: async function (response) {
          try {
            // Verify payment
            await axios.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            
            alert('✅ Payment accepted by customer! Notifications sent.');
            onSuccess();
            onClose();
          } catch (err) {
            console.error('Payment verification failed:', err);
            alert('Payment verification failed');
          }
        },
        modal: {
          ondismiss: function () {
            alert('⚠️ Payment cancelled by customer');
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        alert('❌ Payment rejected by customer');
        setLoading(false);
      });

      rzp.open();
    } catch (err) {
      console.error('Payment request error:', err);
      setError(err.response?.data?.error || 'Failed to create payment request');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Request Payment</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Customer <span className="text-red-500">*</span>
            </label>
            {loadingCustomers ? (
              <div className="text-sm text-slate-600">Loading customers...</div>
            ) : (
              <select
                required
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">Select a customer</option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.name} ({customer.email})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Amount (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="1"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="1000"
            />
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
            <p className="font-medium mb-1">📱 How it works:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Customer gets email notification</li>
              <li>Opens payment in UPI app (GPay/PhonePe/Paytm)</li>
              <li>Customer accepts or rejects the request</li>
              <li>You receive email notification of response</li>
              <li>Click refresh to check latest status</li>
            </ul>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {scriptLoading && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
              Loading payment gateway... Please wait.
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || loadingCustomers || scriptLoading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> Processing...</>
              ) : (
                <><Send className="w-4 h-4" /> Send Request</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}