import { useState, useEffect } from 'react';
import { notificationApi } from '@/lib/api';
import type { Notification } from '@/lib/types';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      const response = await notificationApi.getNotifications();
      if (response && typeof response === 'object' && 'data' in response) {
        setNotifications(Array.isArray(response.data) ? response.data : []);
      } else {
        setNotifications([]);
      }
      setError(null);
    } catch (err) {
      console.error('[v0] Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Refresh every minute
  useEffect(() => {
    const intervalId = setInterval(fetchNotifications, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return {
    notifications,
    loading,
    error,
    refetch: fetchNotifications,
  };
}