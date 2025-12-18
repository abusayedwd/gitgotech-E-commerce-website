import React from 'react';
import { Bell, CheckCircle, XCircle } from 'lucide-react';

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Payment Successful',
      message: 'Your payment of $35.00 for ORD-1158 was processed successfully.',
      date: '12 Jul 2025',
      time: 'Yesterday'
    },
    {
      id: 2,
      type: 'error',
      title: 'Your custom order got cancelled',
      message: 'View Reason',
      date: '15 Jul 2025',
      time: '15 Jul 2025'
    },
    {
      id: 3,
      type: 'success',
      title: 'Payment Successful',
      message: 'Your payment of $35.00 for ORD-1158 was processed successfully.',
      date: '12 Jul 2025',
      time: '12 Jul 2025'
    },
    {
      id: 4,
      type: 'success',
      title: 'Payment Successful',
      message: 'Your payment of $35.00 for ORD-1158 was processed successfully.',
      date: '12 Jul 2025',
      time: '12 Jul 2025'
    },
    {
      id: 5,
      type: 'success',
      title: 'Payment Successful',
      message: 'Your payment of $35.00 for ORD-1158 was processed successfully.',
      date: '18 Jul 2025',
      time: '18 Jul 2025'
    },
    {
      id: 6,
      type: 'success',
      title: 'Payment Successful',
      message: 'Your payment of $35.00 for ORD-1158 was processed successfully.',
      date: '12 Jul 2025',
      time: '12 Jul 2025'
    },
    {
      id: 7,
      type: 'success',
      title: 'Payment Successful',
      message: 'Your payment of $35.00 for ORD-1158 was processed successfully.',
      date: '18 Jul 2025',
      time: '18 Jul 2025'
    },
    {
      id: 8,
      type: 'success',
      title: 'Payment Successful',
      message: 'Your payment of $35.00 for ORD-1158 was processed successfully.',
      date: '12 Jul 2025',
      time: '12 Jul 2025'
    },
    {
      id: 9,
      type: 'success',
      title: 'Payment Successful',
      message: 'Your payment of $35.00 for ORD-1158 was processed successfully.',
      date: 'Yesterday',
      time: 'Yesterday'
    }
  ];

  return (
    <div className="min-h-screen text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1 text-center">
            <h1 className="text-3xl font-semibold mb-2">Notifications</h1>
            <p className="text-gray-400 text-sm">
              Get notified for everything, Never miss anything!
            </p>
          </div>
          <div className="absolute top-4 right-4">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-[#251E2F] bg-opacity-50 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 hover:bg-opacity-70 transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  notification.type === 'success' ? 'bg-blue-500' : 'bg-red-500'
                }`}>
                  {notification.type === 'success' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium mb-1">
                    {notification.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {notification.message}
                  </p>
                </div>

                {/* Date */}
                <div className="flex-shrink-0 text-xs text-gray-500">
                  {notification.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}