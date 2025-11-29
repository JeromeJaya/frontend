import { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { Bell, CheckCircle, XCircle, AlertCircle, Calendar, Check } from 'lucide-react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const { data } = await axios.get('/notifications');
      setNotifications(data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'mandate_approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'payment_success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'payment_failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'mandate_expiring':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'mandate_cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Bell className="w-5 h-5 text-blue-600" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return <div className="text-center py-12 text-slate-600">Loading notifications...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Notifications</h2>
          {unreadCount > 0 && (
            <p className="text-sm text-slate-600 mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
          >
            <Check className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-600">No notifications yet</p>
          <p className="text-sm text-slate-500 mt-2">
            You'll receive notifications about mandates and transactions here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`border rounded-lg p-4 transition cursor-pointer ${
                notification.isRead
                  ? 'border-slate-200 bg-white hover:bg-slate-50'
                  :'border-blue-200 bg-blue-50 hover:bg-blue-100'
              }`}
              onClick={() => !notification.isRead && markAsRead(notification._id)}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">{getNotificationIcon(notification.notificationType)}</div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className={`font-semibold ${notification.isRead ? 'text-slate-900' : 'text-blue-900'}`}>
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                  </div>

                  <p className={`text-sm mb-2 ${notification.isRead ? 'text-slate-600' : 'text-blue-800'}`}>
                    {notification.message}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(notification.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}