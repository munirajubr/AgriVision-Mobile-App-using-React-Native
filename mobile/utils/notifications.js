// Notifications are disabled - stub functions to prevent crashes

/**
 * Register the device for push notifications (disabled)
 */
export async function registerForPushNotificationsAsync() {
  return null;
}

/**
 * Schedule a local notification (disabled - just logs)
 */
export async function scheduleNotification(title, body, data = {}) {
  // Notification suppressed - no-op
}
