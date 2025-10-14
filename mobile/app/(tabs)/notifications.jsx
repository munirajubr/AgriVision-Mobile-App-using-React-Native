import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import styles from '../../assets/styles/notifications.styles';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'alert',
      icon: 'warning-outline',
      iconColor: '#FF9800',
      title: 'High Temperature Alert',
      message: 'Sensor IOT-001 detected temperature above 35°C in Field A',
      time: '10 mins ago',
      isRead: false,
    },
    {
      id: 2,
      type: 'device',
      icon: 'hardware-chip-outline',
      iconColor: '#4CAF50',
      title: 'New Device Connected',
      message: 'Smart Farm Sensor Beta (IOT-002) is now online',
      time: '2 hours ago',
      isRead: false,
    },
    {
      id: 3,
      type: 'info',
      icon: 'water-outline',
      iconColor: '#2196F3',
      title: 'Low Soil Moisture',
      message: 'Field B requires irrigation. Current moisture: 45%',
      time: '5 hours ago',
      isRead: true,
    },
    {
      id: 4,
      type: 'market',
      icon: 'trending-up-outline',
      iconColor: '#4CAF50',
      title: 'Market Price Update',
      message: 'Rice price increased by 5.2% to ₹2,850 per quintal',
      time: '1 day ago',
      isRead: true,
    },
    {
      id: 5,
      type: 'weather',
      icon: 'cloudy-outline',
      iconColor: '#607D8B',
      title: 'Weather Alert',
      message: 'Heavy rain expected in your area tomorrow',
      time: '1 day ago',
      isRead: true,
    },
    {
      id: 6,
      type: 'success',
      icon: 'checkmark-circle-outline',
      iconColor: '#4CAF50',
      title: 'NPK Analysis Complete',
      message: 'Your soil analysis report is ready to view',
      time: '2 days ago',
      isRead: true,
    },
    {
      id: 7,
      type: 'alert',
      icon: 'battery-half-outline',
      iconColor: '#F44336',
      title: 'Low Battery Warning',
      message: 'Device IOT-003 battery is at 15%. Please recharge soon.',
      time: '3 days ago',
      isRead: true,
    },
  ]);

  const [filter, setFilter] = useState('all'); // all, unread

  const markAsRead = (notificationId) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSubtitle}>
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </Text>
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'unread' && styles.filterTabActive]}
          onPress={() => setFilter('unread')}
        >
          <Text style={[styles.filterText, filter === 'unread' && styles.filterTextActive]}>
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <ScrollView 
        style={styles.notificationsList}
        contentContainerStyle={styles.notificationsContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationCard,
                !notification.isRead && styles.notificationCardUnread
              ]}
              onPress={() => markAsRead(notification.id)}
              activeOpacity={0.7}
            >
              {!notification.isRead && <View style={styles.unreadIndicator} />}
              
              <View style={[styles.iconContainer, { backgroundColor: `${notification.iconColor}15` }]}>
                <Ionicons name={notification.icon} size={24} color={notification.iconColor} />
              </View>

              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationMessage} numberOfLines={2}>
                  {notification.message}
                </Text>
                <Text style={styles.notificationTime}>{notification.time}</Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color={COLORS.border} />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={64} color={COLORS.border} />
            <Text style={styles.emptyText}>No notifications</Text>
            <Text style={styles.emptySubtext}>
              {filter === 'unread' 
                ? "You're all caught up!"
                : 'Notifications will appear here'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default NotificationsPage;
