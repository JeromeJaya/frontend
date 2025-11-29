import { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { Plus, Search, Mail, Phone, Calendar, Users, Edit2, Trash2 } from 'lucide-react';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const { data } = await axios.get('/customers');
      setCustomers(data);
    } catch (error) {
      console.error('Failed to load customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setShowEditModal(true);
  };

  const handleDelete = async (customerId) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) {
      return;
    }

    try {
      await axios.delete(`/customers/${customerId}`);
      loadCustomers();
    } catch (error) {
      console.error('Failed to delete customer:', error);
      alert(error.response?.data?.error || 'Failed to delete customer');
    }
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  if (loading) {
    return <div className="text-center py-12 text-slate-600">Loading customers...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Customers</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search customers by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 mb-4">
            {searchTerm ? 'No customers found matching your search' : 'No customers yet'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowAddModal(true)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your first customer
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((customer) => (
            <div
              key={customer._id}
              className="border border-slate-200 rounded-lg p-5 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-900">{customer.name}</h3>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      customer.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {customer.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-4 h-4" />
                  <span>{customer.phone}</span>
                </div>
                {customer.service && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="font-medium">Service:</span>
                    <span className="capitalize">{customer.service}</span>
                  </div>
                )}
                {customer.upiId && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="font-medium">UPI:</span>
                    <span>{customer.upiId}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-500 text-xs mt-3">
                  <Calendar className="w-3 h-3" />
                  <span>Added {new Date(customer.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-200">
                <button
                  onClick={() => handleEdit(customer)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(customer._id)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddCustomerModal 
          onClose={() => setShowAddModal(false)} 
          onSuccess={loadCustomers} 
        />
      )}

      {showEditModal && selectedCustomer && (
        <EditCustomerModal 
          customer={selectedCustomer}
          onClose={() => {
            setShowEditModal(false);
            setSelectedCustomer(null);
          }} 
          onSuccess={loadCustomers} 
        />
      )}
    </div>
  );
}

function AddCustomerModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    upiId: '',
    service: 'website',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('/customers', formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Add New Customer</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="+91 9876543210"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Service <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="website">Website</option>
              <option value="f3">F3</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              UPI ID (Optional)
            </label>
            <input
              type="text"
              value={formData.upiId}
              onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="user@upi"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditCustomerModal({ customer, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    upiId: customer.upiId || '',
    service: customer.service || 'website',
    isActive: customer.isActive,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.put(`/customers/${customer._id}`, formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Edit Customer</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Service <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="website">Website</option>
              <option value="f3">F3</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              UPI ID (Optional)
            </label>
            <input
              type="text"
              value={formData.upiId}
              onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="user@upi"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-slate-700">
              Active Customer
            </label>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}