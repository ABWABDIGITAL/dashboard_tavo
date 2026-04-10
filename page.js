'use client'

import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import RealtimeStats from './components/RealtimeStats'
import RevenueChart from './components/RevenueChart'
import TopRestaurants from './components/TopRestaurants'
import Alerts from './components/Alerts'
import UsersList from './components/UsersList'
import UserStats from './components/UserStats'
import UserDetail from './components/UserDetail'
import RestaurantsList from './components/RestaurantsList'
import RestaurantStats from './components/RestaurantStats'
import RestaurantDetail from './components/RestaurantDetail'
import StaffList from './components/StaffList'
import StaffDetail from './components/StaffDetail'
import OrdersList from './components/OrdersList'
import OrderStats from './components/OrderStats'
import OrderDetail from './components/OrderDetail'
import ReservationsList from './components/ReservationsList'
import ReservationDetail from './components/ReservationDetail'
import FinancialsOverview from './components/FinancialsOverview'
import FinancialsList from './components/FinancialsList'
import CreatePayoutModal from './components/CreatePayoutModal'
import TicketsList from './components/TicketsList'
import TicketDetail from './components/TicketDetail'
import TicketStats from './components/TicketStats'
import Settings from './components/Settings'
import Notifications from './components/Notifications'
import BlacklistList from './components/BlacklistList'
import AddBlacklistModal from './components/AddBlacklistModal'
import AuditLogs from './components/AuditLogs'
import LogStats from './components/LogStats'
import { get, post, put, del, patch, API_BASE } from './utils/api'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [realtimeStats, setRealtimeStats] = useState(null)
  const [revenueData, setRevenueData] = useState([])
  const [topRestaurants, setTopRestaurants] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // User management state
  const [users, setUsers] = useState([])
  const [userPagination, setUserPagination] = useState(null)
  const [userStats, setUserStats] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [usersPage, setUsersPage] = useState(1)
  const [usersLoading, setUsersLoading] = useState(false)

  // Restaurant management state
  const [restaurants, setRestaurants] = useState([])
  const [restaurantPagination, setRestaurantPagination] = useState(null)
  const [restaurantStats, setRestaurantStats] = useState(null)
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [restaurantsPage, setRestaurantsPage] = useState(1)
  const [restaurantsLoading, setRestaurantsLoading] = useState(false)
  const [isCreatingRestaurant, setIsCreatingRestaurant] = useState(false)

  // Staff management state
  const [staff, setStaff] = useState([])
  const [staffPagination, setStaffPagination] = useState(null)
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [staffPage, setStaffPage] = useState(1)
  const [staffLoading, setStaffLoading] = useState(false)
  const [isAssigningStaff, setIsAssigningStaff] = useState(false)

  // Orders management state
  const [orders, setOrders] = useState([])
  const [ordersPagination, setOrdersPagination] = useState(null)
  const [ordersStats, setOrdersStats] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [ordersPage, setOrdersPage] = useState(1)
  const [ordersLoading, setOrdersLoading] = useState(false)

  // Reservations management state
  const [reservations, setReservations] = useState([])
  const [reservationsPagination, setReservationsPagination] = useState(null)
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [reservationsPage, setReservationsPage] = useState(1)
  const [reservationsLoading, setReservationsLoading] = useState(false)

  // Financials management state
  const [financialsOverview, setFinancialsOverview] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [payouts, setPayouts] = useState([])
  const [refunds, setRefunds] = useState([])
  const [financialsPage, setFinancialsPage] = useState(1)
  const [financialsLoading, setFinancialsLoading] = useState(false)
  const [financialsSubTab, setFinancialsSubTab] = useState('overview')
  const [showCreatePayout, setShowCreatePayout] = useState(false)

  // Tickets management state
  const [tickets, setTickets] = useState([])
  const [ticketsPagination, setTicketsPagination] = useState(null)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [ticketsPage, setTicketsPage] = useState(1)
  const [ticketsLoading, setTicketsLoading] = useState(false)
  const [showCreateTicket, setShowCreateTicket] = useState(false)
  const [ticketStats, setTicketStats] = useState(null)

  // Settings management state
  const [settings, setSettings] = useState(null)
  const [settingsFeatures, setSettingsFeatures] = useState(null)
  const [settingsLoading, setSettingsLoading] = useState(false)

  // Notifications management state
  const [notificationsLoading, setNotificationsLoading] = useState(false)

  // Blacklist management state
  const [blacklistEntries, setBlacklistEntries] = useState([])
  const [blacklistPagination, setBlacklistPagination] = useState(null)
  const [blacklistPage, setBlacklistPage] = useState(1)
  const [blacklistLoading, setBlacklistLoading] = useState(false)
  const [showAddBlacklist, setShowAddBlacklist] = useState(false)

  // Audit logs management state
  const [auditLogs, setAuditLogs] = useState([])
  const [logsPagination, setLogsPagination] = useState(null)
  const [logsPage, setLogsPage] = useState(1)
  const [logsLoading, setLogsLoading] = useState(false)
  const [logStats, setLogStats] = useState(null)

  // Fetch dashboard data
  const fetchRealtimeStats = async () => {
    try {
      const res = await get('/admin/dashboard/realtime')
      if (!res) return
      if (!res.ok) throw new Error('Failed to fetch realtime stats')
      const data = await res.json()
      setRealtimeStats(data.data)
    } catch (err) {
      console.error('Realtime stats error:', err)
    }
  }

  const fetchRevenueTrend = async () => {
    try {
      const startDate = '2026-01-01'
      const endDate = '2026-12-31'
      const res = await get(`/admin/dashboard/revenue-trend?startDate=${startDate}&endDate=${endDate}`)
      if (!res) return
      if (!res.ok) throw new Error('Failed to fetch revenue trend')
      const data = await res.json()
      setRevenueData(data.data)
    } catch (err) {
      console.error('Revenue trend error:', err)
    }
  }

  const fetchTopRestaurants = async () => {
    try {
      const res = await get('/admin/dashboard/top-restaurants')
      if (!res) return
      if (!res.ok) throw new Error('Failed to fetch top restaurants')
      const data = await res.json()
      setTopRestaurants(data.data)
    } catch (err) {
      console.error('Top restaurants error:', err)
    }
  }

  const fetchAlerts = async () => {
    try {
      const res = await get('/admin/dashboard/alerts')
      if (!res) return
      if (!res.ok) throw new Error('Failed to fetch alerts')
      const data = await res.json()
      setAlerts(data.data)
    } catch (err) {
      console.error('Alerts error:', err)
    }
  }

  // User management functions
  const fetchUsers = async (page = 1) => {
    setUsersLoading(true)
    try {
      const res = await get(`/admin/users?page=${page}&limit=20`)
      if (!res) return
      if (!res.ok) throw new Error('Failed to fetch users')
      const data = await res.json()
      setUsers(data.users)
      setUserPagination(data.pagination)
    } catch (err) {
      console.error('Users error:', err)
    } finally {
      setUsersLoading(false)
    }
  }

  const fetchUserStats = async () => {
    try {
      const res = await get('/admin/users/stats')
      if (!res) return
      if (!res.ok) throw new Error('Failed to fetch user stats')
      const data = await res.json()
      setUserStats(data.data)
    } catch (err) {
      console.error('User stats error:', err)
    }
  }

  const handleUserUpdate = async (userId, userData) => {
    try {
      const res = await put(`/admin/users/${userId}`, userData)
      if (!res) return
      if (!res.ok) throw new Error('Failed to update user')
      await fetchUsers(usersPage)
      setSelectedUser(null)
    } catch (err) {
      console.error('Update user error:', err)
    }
  }

  const handleUserActivate = async (userId) => {
    try {
      const res = await patch(`/admin/users/${userId}/activate`)
      if (!res) return
      if (!res.ok) throw new Error('Failed to activate user')
      await fetchUsers(usersPage)
      setSelectedUser(null)
    } catch (err) {
      console.error('Activate user error:', err)
    }
  }

  const handleUserSuspend = async (userId, reason) => {
    try {
      const res = await patch(`/admin/users/${userId}/suspend`, { reason })
      if (!res) return
      if (!res.ok) throw new Error('Failed to suspend user')
      await fetchUsers(usersPage)
      setSelectedUser(null)
    } catch (err) {
      console.error('Suspend user error:', err)
    }
  }

  const handleUserDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      const res = await del(`/admin/users/${userId}`)
      if (!res) return
      if (!res.ok) throw new Error('Failed to delete user')
      await fetchUsers(usersPage)
      setSelectedUser(null)
    } catch (err) {
      console.error('Delete user error:', err)
    }
  }

  const handleExportUsers = async () => {
    try {
      const res = await get('/admin/users/export')
      if (!res) return
      if (!res.ok) throw new Error('Failed to export users')
      const data = await res.json()
      const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'users-export.json'
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Export users error:', err)
    }
  }

  // Restaurant management functions
  const fetchRestaurants = async (page = 1) => {
    setRestaurantsLoading(true)
    try {
      const res = await get(`/admin/restaurants?page=${page}&limit=20`)
      if (!res) return
      if (!res.ok) throw new Error('Failed to fetch restaurants')
      const data = await res.json()
      setRestaurants(data.restaurants)
      setRestaurantPagination(data.pagination)
    } catch (err) {
      console.error('Restaurants error:', err)
    } finally {
      setRestaurantsLoading(false)
    }
  }

  const fetchRestaurantStats = async () => {
    try {
      const res = await get('/admin/restaurants/stats')
      if (!res) return
      if (!res.ok) throw new Error('Failed to fetch restaurant stats')
      const data = await res.json()
      setRestaurantStats(data.data)
    } catch (err) {
      console.error('Restaurant stats error:', err)
    }
  }

  const handleRestaurantSave = async (restaurantId, restaurantData) => {
    try {
      if (restaurantId) {
        const res = await put(`/admin/restaurants/${restaurantId}`, restaurantData)
        if (!res) return
        if (!res.ok) throw new Error('Failed to update restaurant')
      } else {
        const res = await post('/admin/restaurants', restaurantData)
        if (!res) return
        if (!res.ok) throw new Error('Failed to create restaurant')
      }
      await fetchRestaurants(restaurantsPage)
      setSelectedRestaurant(null)
      setIsCreatingRestaurant(false)
    } catch (err) {
      console.error('Save restaurant error:', err)
    }
  }

  const handleRestaurantActivate = async (restaurantId) => {
    try {
      const res = await patch(`/admin/restaurants/${restaurantId}/activate`)
      if (!res) return
      if (!res.ok) throw new Error('Failed to activate restaurant')
      await fetchRestaurants(restaurantsPage)
      setSelectedRestaurant(null)
    } catch (err) {
      console.error('Activate restaurant error:', err)
    }
  }

  const handleRestaurantDeactivate = async (restaurantId) => {
    try {
      const res = await patch(`/admin/restaurants/${restaurantId}/deactivate`)
      if (!res) return
      if (!res.ok) throw new Error('Failed to deactivate restaurant')
      await fetchRestaurants(restaurantsPage)
      setSelectedRestaurant(null)
    } catch (err) {
      console.error('Deactivate restaurant error:', err)
    }
  }

  const handleRestaurantDelete = async (restaurantId) => {
    if (!confirm('Are you sure you want to delete this restaurant?')) return
    try {
      const res = await del(`/admin/restaurants/${restaurantId}`)
      if (!res) return
      if (!res.ok) throw new Error('Failed to delete restaurant')
      await fetchRestaurants(restaurantsPage)
      setSelectedRestaurant(null)
    } catch (err) {
      console.error('Delete restaurant error:', err)
    }
  }

  // Staff management functions
  const fetchStaff = async (page = 1) => {
    setStaffLoading(true)
    try {
      const res = await get(`/admin/staff?page=${page}&limit=20`)
      if (!res) return
      if (!res.ok) throw new Error('Failed to fetch staff')
      const data = await res.json()
      setStaff(data.staff)
      setStaffPagination(data.pagination)
    } catch (err) {
      console.error('Staff error:', err)
    } finally {
      setStaffLoading(false)
    }
  }

  const handleStaffSave = async (staffId, staffData) => {
    try {
      if (staffId) {
        // Update existing staff
        const res = await put(`/admin/staff/${staffId}`, staffData)
        if (!res) return
        if (!res.ok) throw new Error('Failed to update staff')
      } else {
        // Assign new staff
        const res = await post('/admin/staff', staffData)
        if (!res) return
        if (!res.ok) throw new Error('Failed to assign staff')
      }
      await fetchStaff(staffPage)
      setSelectedStaff(null)
      setIsAssigningStaff(false)
    } catch (err) {
      console.error('Save staff error:', err)
    }
  }

  const handleStaffActivate = async (staffId) => {
    try {
      const res = await patch(`/admin/staff/${staffId}/activate`)
      if (!res) return
      if (!res.ok) throw new Error('Failed to activate staff')
      await fetchStaff(staffPage)
      setSelectedStaff(null)
    } catch (err) {
      console.error('Activate staff error:', err)
    }
  }

  const handleStaffSuspend = async (staffId) => {
    try {
      const res = await patch(`/admin/staff/${staffId}/suspend`)
      if (!res) return
      if (!res.ok) throw new Error('Failed to suspend staff')
      await fetchStaff(staffPage)
      setSelectedStaff(null)
    } catch (err) {
      console.error('Suspend staff error:', err)
    }
  }

  const handleStaffDelete = async (staffId) => {
    if (!confirm('Are you sure you want to remove this staff member?')) return
    try {
      const res = await del(`/admin/staff/${staffId}`)
      if (!res) return
      if (!res.ok) throw new Error('Failed to remove staff')
      await fetchStaff(staffPage)
      setSelectedStaff(null)
    } catch (err) {
      console.error('Remove staff error:', err)
    }
  }

  // Orders management functions
  const fetchOrders = async (page = 1) => {
    setOrdersLoading(true)
    try {
      const res = await get(`/admin/orders?page=${page}&limit=20`)
      if (!res) return
      if (!res.ok) throw new Error('Failed to fetch orders')
      const data = await res.json()
      setOrders(data.orders)
      setOrdersPagination(data.pagination)
    } catch (err) {
      console.error('Orders error:', err)
    } finally {
      setOrdersLoading(false)
    }
  }

  const fetchOrdersStats = async () => {
    try {
      const res = await get('/admin/orders/stats')
      if (!res) return
      if (!res.ok) throw new Error('Failed to fetch orders stats')
      const data = await res.json()
      setOrdersStats(data.data)
    } catch (err) {
      console.error('Orders stats error:', err)
    }
  }

  const handleOrderRefund = async (orderId, refundData) => {
    try {
      const res = await post(`/admin/orders/${orderId}/refund`, refundData)
      if (!res) return
      if (!res.ok) throw new Error('Failed to process refund')
      await fetchOrders(ordersPage)
      setSelectedOrder(null)
    } catch (err) {
      console.error('Refund error:', err)
    }
  }

  // Reservations management functions
  const fetchReservations = async (page = 1) => {
    setReservationsLoading(true)
    try {
      const res = await get(`/admin/reservations?page=${page}&limit=20`)
      if (!res) return
      if (!res.ok) throw new Error('Failed to fetch reservations')
      const data = await res.json()
      setReservations(data.reservations || data.data || [])
      setReservationsPagination(data.pagination)
    } catch (err) {
      console.error('Reservations error:', err)
    } finally {
      setReservationsLoading(false)
    }
  }

  const handleReservationConfirm = async (reservationId) => {
    try {
      const res = await patch(`/admin/reservations/${reservationId}/confirm`)
      if (!res) return
      if (!res.ok) throw new Error('Failed to confirm reservation')
      await fetchReservations(reservationsPage)
      setSelectedReservation(null)
    } catch (err) {
      console.error('Confirm reservation error:', err)
    }
  }

  const handleReservationCancel = async (reservationId) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return
    try {
      const res = await patch(`/admin/reservations/${reservationId}/cancel`)
      if (!res) return
      if (!res.ok) throw new Error('Failed to cancel reservation')
      await fetchReservations(reservationsPage)
      setSelectedReservation(null)
    } catch (err) {
      console.error('Cancel reservation error:', err)
    }
  }

  const handleReservationComplete = async (reservationId) => {
    try {
      const res = await patch(`/admin/reservations/${reservationId}/complete`)
      if (!res) return
      if (!res.ok) throw new Error('Failed to complete reservation')
      await fetchReservations(reservationsPage)
      setSelectedReservation(null)
    } catch (err) {
      console.error('Complete reservation error:', err)
    }
  }

  const handleReservationNoShow = async (reservationId) => {
    try {
      const res = await patch(`/admin/reservations/${reservationId}/no-show`)
      if (!res) return
      if (!res.ok) throw new Error('Failed to mark no-show')
      await fetchReservations(reservationsPage)
      setSelectedReservation(null)
    } catch (err) {
      console.error('No-show reservation error:', err)
    }
  }

  // Financials management functions
  const fetchFinancialsOverview = async () => {
    try {
      const res = await get('/admin/financials/overview')
      if (!res) return
      if (!res.ok) throw new Error('Failed to fetch financials overview')
      const data = await res.json()
      setFinancialsOverview(data.data)
    } catch (err) {
      console.error('Financials overview error:', err)
    }
  }

  const fetchTransactions = async (page = 1) => {
    setFinancialsLoading(true)
    try {
      const res = await get(`/admin/financials/transactions?page=${page}&limit=20`)
      if (!res) return
      if (!res.ok) throw new Error('Failed to fetch transactions')
      const data = await res.json()
      setTransactions(data.transactions || [])
    } catch (err) {
      console.error('Transactions error:', err)
    } finally {
      setFinancialsLoading(false)
    }
  }

  const fetchPayouts = async (page = 1) => {
    setFinancialsLoading(true)
    try {
      const res = await get(`/admin/financials/payouts?page=${page}&limit=20`)
      if (!res) return
      if (!res.ok) throw new Error('Failed to fetch payouts')
      const data = await res.json()
      setPayouts(data.payouts || [])
    } catch (err) {
      console.error('Payouts error:', err)
    } finally {
      setFinancialsLoading(false)
    }
  }

  const fetchRefunds = async (page = 1) => {
    setFinancialsLoading(true)
    try {
      const res = await get(`/admin/financials/refunds?page=${page}&limit=20`)
      if (!res) return
      if (!res.ok) throw new Error('Failed to fetch refunds')
      const data = await res.json()
      setRefunds(data.refunds || [])
    } catch (err) {
      console.error('Refunds error:', err)
    } finally {
      setFinancialsLoading(false)
    }
  }

  const handleCreatePayout = async (payoutData) => {
    try {
      const res = await post('/admin/financials/payouts', payoutData)
      if (!res) return
      if (!res.ok) throw new Error('Failed to create payout')
      await fetchPayouts(financialsPage)
      setShowCreatePayout(false)
    } catch (err) {
      console.error('Create payout error:', err)
    }
  }

  const handleProcessPayout = async (payoutId) => {
    try {
      const res = await patch(`/admin/financials/payouts/${payoutId}/process`)
      if (!res) return
      if (!res.ok) throw new Error('Failed to process payout')
      await fetchPayouts(financialsPage)
    } catch (err) {
      console.error('Process payout error:', err)
    }
  }

  const handleProcessRefund = async (refundId) => {
    try {
      const res = await patch(`/admin/financials/refunds/${refundId}/process`)
      if (!res) return
      if (!res.ok) throw new Error('Failed to process refund')
      await fetchRefunds(financialsPage)
    } catch (err) {
      console.error('Process refund error:', err)
    }
  }

  // Tickets management functions
  const fetchTickets = async (page = 1) => {
    setTicketsLoading(true)
    try {
      const res = await get(`/admin/tickets?page=${page}&limit=20`)
      if (!res) return
      if (!res.ok) throw new Error('Failed to fetch tickets')
      const data = await res.json()
      setTickets(data.tickets || [])
      setTicketsPagination(data.pagination)
    } catch (err) {
      console.error('Tickets error:', err)
    } finally {
      setTicketsLoading(false)
    }
  }

  const fetchTicketStats = async () => {
    try {
      const res = await get('/admin/tickets/stats')
      if (!res) return
      if (!res.ok) throw new Error('Failed to fetch ticket stats')
      const data = await res.json()
      setTicketStats(data.data)
    } catch (err) {
      console.error('Ticket stats error:', err)
    }
  }

  const handleTicketReply = async (ticketId, replyData) => {
    try {
      const res = await post(`/admin/tickets/${ticketId}/reply`, replyData)
      if (!res) return
      if (!res.ok) throw new Error('Failed to reply to ticket')
      await fetchTickets(ticketsPage)
    } catch (err) {
      console.error('Ticket reply error:', err)
    }
  }

  const handleTicketAssign = async (ticketId) => {
    try {
      const res = await patch(`/admin/tickets/${ticketId}/assign`)
      if (!res) return
      if (!res.ok) throw new Error('Failed to assign ticket')
      await fetchTickets(ticketsPage)
      setSelectedTicket(null)
    } catch (err) {
      console.error('Ticket assign error:', err)
    }
  }

  const handleTicketResolve = async (ticketId) => {
    try {
      const res = await patch(`/admin/tickets/${ticketId}/resolve`)
      if (!res) return
      if (!res.ok) throw new Error('Failed to resolve ticket')
      await fetchTickets(ticketsPage)
      setSelectedTicket(null)
    } catch (err) {
      console.error('Ticket resolve error:', err)
    }
  }

  const handleTicketClose = async (ticketId) => {
    try {
      const res = await patch(`/admin/tickets/${ticketId}/close`)
      if (!res) return
      if (!res.ok) throw new Error('Failed to close ticket')
      await fetchTickets(ticketsPage)
      setSelectedTicket(null)
    } catch (err) {
      console.error('Ticket close error:', err)
    }
  }

  const handleCreateTicket = async (ticketData) => {
    try {
      const res = await post('/admin/tickets', ticketData)
      if (!res) return
      if (!res.ok) throw new Error('Failed to create ticket')
      await fetchTickets(ticketsPage)
      fetchTicketStats()
      setShowCreateTicket(false)
    } catch (err) {
      console.error('Create ticket error:', err)
    }
  }

  // Settings management functions
  const fetchSettings = async () => {
    setSettingsLoading(true)
    try {
      const [settingsRes, featuresRes] = await Promise.all([
        get('/admin/settings'),
        get('/admin/settings/features')
      ])
      if (settingsRes?.ok) {
        const data = await settingsRes.json()
        setSettings(data.data)
      }
      if (featuresRes?.ok) {
        const data = await featuresRes.json()
        setSettingsFeatures(data.data)
      }
    } catch (err) {
      console.error('Settings error:', err)
    } finally {
      setSettingsLoading(false)
    }
  }

  const handleSaveSettings = async (section, data) => {
    try {
      const currentSettings = settings || {}
      const updatedSettings = {
        ...currentSettings,
        [section]: data
      }
      const res = await put('/admin/settings', updatedSettings)
      if (!res) return
      if (!res.ok) throw new Error('Failed to save settings')
      await fetchSettings()
    } catch (err) {
      console.error('Save settings error:', err)
    }
  }

  const handleSaveFeatures = async (features) => {
    try {
      const res = await put('/admin/settings/features', features)
      if (!res) return
      if (!res.ok) throw new Error('Failed to save features')
      setSettingsFeatures(features)
    } catch (err) {
      console.error('Save features error:', err)
    }
  }

  const handleToggleMaintenance = async () => {
    try {
      const res = await patch('/admin/settings/maintenance')
      if (!res) return
      if (!res.ok) throw new Error('Failed to toggle maintenance mode')
      await fetchSettings()
    } catch (err) {
      console.error('Toggle maintenance error:', err)
    }
  }

  // Notifications management functions
  const handleSendNotification = async (notificationData) => {
    setNotificationsLoading(true)
    try {
      const res = await post('/admin/notifications/send', notificationData)
      if (!res) return
      if (!res.ok) throw new Error('Failed to send notification')
      alert('Notification sent successfully!')
    } catch (err) {
      console.error('Send notification error:', err)
      alert('Failed to send notification')
    } finally {
      setNotificationsLoading(false)
    }
  }

  const handleBroadcastNotification = async (notificationData) => {
    setNotificationsLoading(true)
    try {
      const res = await post('/admin/notifications/broadcast', notificationData)
      if (!res) return
      if (!res.ok) throw new Error('Failed to broadcast notification')
      alert('Notification broadcast successfully!')
    } catch (err) {
      console.error('Broadcast notification error:', err)
      alert('Failed to broadcast notification')
    } finally {
      setNotificationsLoading(false)
    }
  }

  // Blacklist management functions
  const fetchBlacklist = async (page = 1) => {
    setBlacklistLoading(true)
    try {
      const res = await get(`/admin/blacklist?page=${page}&limit=20`)
      if (!res) return
      if (!res.ok) throw new Error('Failed to fetch blacklist')
      const data = await res.json()
      setBlacklistEntries(data.entries || [])
      setBlacklistPagination(data.pagination)
    } catch (err) {
      console.error('Blacklist error:', err)
    } finally {
      setBlacklistLoading(false)
    }
  }

  const handleAddBlacklist = async (entryData) => {
    try {
      const res = await post('/admin/blacklist', entryData)
      if (!res) return
      if (!res.ok) throw new Error('Failed to add to blacklist')
      await fetchBlacklist(blacklistPage)
      alert('Phone number added to blacklist successfully!')
    } catch (err) {
      console.error('Add blacklist error:', err)
      alert('Failed to add to blacklist')
    }
  }

  const handleRemoveBlacklist = async (entryId) => {
    try {
      const res = await del(`/admin/blacklist/${entryId}`)
      if (!res) return
      if (!res.ok) throw new Error('Failed to remove from blacklist')
      await fetchBlacklist(blacklistPage)
      alert('Entry removed from blacklist successfully!')
    } catch (err) {
      console.error('Remove blacklist error:', err)
      alert('Failed to remove from blacklist')
    }
  }

  const handleCheckBlacklist = async (phone) => {
    try {
      const res = await get(`/admin/blacklist/check?phone=${encodeURIComponent(phone)}`)
      if (!res) return { blacklisted: false }
      if (!res.ok) throw new Error('Failed to check blacklist')
      const data = await res.json()
      return data.data || data
    } catch (err) {
      console.error('Check blacklist error:', err)
      return { blacklisted: false }
    }
  }

  // Audit logs management functions
  const fetchAuditLogs = async (page = 1) => {
    setLogsLoading(true)
    try {
      const res = await get(`/admin/logs/audit?page=${page}&limit=50`)
      if (!res) return
      if (!res.ok) throw new Error('Failed to fetch audit logs')
      const data = await res.json()
      setAuditLogs(data.logs || [])
      setLogsPagination(data.pagination)
    } catch (err) {
      console.error('Audit logs error:', err)
    } finally {
      setLogsLoading(false)
    }
  }

  const fetchLogStats = async () => {
    try {
      const res = await get('/admin/logs/stats')
      if (!res) return
      if (!res.ok) throw new Error('Failed to fetch log stats')
      const data = await res.json()
      setLogStats(data.data)
    } catch (err) {
      console.error('Log stats error:', err)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([
        fetchRealtimeStats(),
        fetchRevenueTrend(),
        fetchTopRestaurants(),
        fetchAlerts()
      ])
      setLoading(false)
    }
    loadData()

    // Refresh realtime stats every 30 seconds
    const interval = setInterval(fetchRealtimeStats, 30000)
    return () => clearInterval(interval)
  }, [])

  // Load user data when users tab is active
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers(usersPage)
      fetchUserStats()
    }
  }, [activeTab, usersPage])

  // Load restaurant data when restaurants tab is active
  useEffect(() => {
    if (activeTab === 'restaurants') {
      fetchRestaurants(restaurantsPage)
      fetchRestaurantStats()
    }
  }, [activeTab, restaurantsPage])

  // Load staff data when staff tab is active
  useEffect(() => {
    if (activeTab === 'staff') {
      fetchStaff(staffPage)
    }
  }, [activeTab, staffPage])

  // Load orders data when orders tab is active
  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders(ordersPage)
      fetchOrdersStats()
    }
  }, [activeTab, ordersPage])

  // Load reservations data when reservations tab is active
  useEffect(() => {
    if (activeTab === 'reservations') {
      fetchReservations(reservationsPage)
    }
  }, [activeTab, reservationsPage])

  // Load financials data when financials tab is active
  useEffect(() => {
    if (activeTab === 'financials') {
      fetchFinancialsOverview()
      if (financialsSubTab === 'transactions') fetchTransactions(financialsPage)
      if (financialsSubTab === 'payouts') fetchPayouts(financialsPage)
      if (financialsSubTab === 'refunds') fetchRefunds(financialsPage)
    }
  }, [activeTab, financialsPage, financialsSubTab])

  // Load tickets data when tickets tab is active
  useEffect(() => {
    if (activeTab === 'tickets') {
      fetchTickets(ticketsPage)
      fetchTicketStats()
    }
  }, [activeTab, ticketsPage])

  // Load settings data when settings tab is active
  useEffect(() => {
    if (activeTab === 'settings') {
      fetchSettings()
    }
  }, [activeTab])

  // Load blacklist data when blacklist tab is active
  useEffect(() => {
    if (activeTab === 'blacklist') {
      fetchBlacklist(blacklistPage)
    }
  }, [activeTab, blacklistPage])

  // Load audit logs data when logs tab is active
  useEffect(() => {
    if (activeTab === 'logs') {
      fetchAuditLogs(logsPage)
      fetchLogStats()
    }
  }, [activeTab, logsPage])

  const renderContent = () => {
    if (loading) return <div className="loading">Loading dashboard...</div>
    if (error) return <div className="error">Error: {error}</div>

    switch (activeTab) {
      case 'overview':
        return (
          <>
            <RealtimeStats data={realtimeStats} loading={!realtimeStats && loading} />
            <div className="dashboard-grid">
              <div className="dashboard-main">
                <RevenueChart data={revenueData} loading={loading} />
              </div>
              <div className="dashboard-side">
                <TopRestaurants data={topRestaurants} loading={loading} />
                <Alerts data={alerts} loading={loading} />
              </div>
            </div>
          </>
        )
      case 'users':
        return (
          <>
            <UserStats stats={userStats} loading={!userStats} />
            <div className="users-grid">
              <UsersList
                users={users}
                pagination={userPagination}
                onPageChange={(page) => setUsersPage(page)}
                onUserSelect={(user) => setSelectedUser(user)}
                onCreateUser={() => alert('Create user modal - implement as needed')}
                loading={usersLoading}
              />
            </div>
            {selectedUser && (
              <UserDetail
                user={selectedUser}
                onClose={() => setSelectedUser(null)}
                onUpdate={handleUserUpdate}
                onActivate={handleUserActivate}
                onSuspend={handleUserSuspend}
                onDelete={handleUserDelete}
              />
            )}
          </>
        )
      case 'restaurants':
        return (
          <>
            <RestaurantStats stats={restaurantStats} loading={!restaurantStats} />
            <RestaurantsList
              restaurants={restaurants}
              pagination={restaurantPagination}
              onPageChange={(page) => setRestaurantsPage(page)}
              onRestaurantSelect={(restaurant) => setSelectedRestaurant(restaurant)}
              onCreateRestaurant={() => setIsCreatingRestaurant(true)}
              loading={restaurantsLoading}
            />
            {(selectedRestaurant || isCreatingRestaurant) && (
              <RestaurantDetail
                restaurant={selectedRestaurant}
                onClose={() => {
                  setSelectedRestaurant(null)
                  setIsCreatingRestaurant(false)
                }}
                onSave={handleRestaurantSave}
                onActivate={handleRestaurantActivate}
                onDeactivate={handleRestaurantDeactivate}
                onDelete={handleRestaurantDelete}
                isCreating={isCreatingRestaurant}
              />
            )}
          </>
        )
      case 'staff':
        return (
          <>
            <StaffList
              staff={staff}
              pagination={staffPagination}
              onPageChange={(page) => setStaffPage(page)}
              onStaffSelect={(member) => setSelectedStaff(member)}
              onAssignStaff={() => setIsAssigningStaff(true)}
              loading={staffLoading}
            />
            {(selectedStaff || isAssigningStaff) && (
              <StaffDetail
                staff={selectedStaff}
                onClose={() => {
                  setSelectedStaff(null)
                  setIsAssigningStaff(false)
                }}
                onSave={handleStaffSave}
                onActivate={handleStaffActivate}
                onSuspend={handleStaffSuspend}
                onDelete={handleStaffDelete}
                isAssigning={isAssigningStaff}
                restaurants={restaurants}
                users={users}
              />
            )}
          </>
        )
      case 'orders':
        return (
          <>
            <OrderStats stats={ordersStats} loading={!ordersStats} />
            <OrdersList
              orders={orders}
              pagination={ordersPagination}
              onPageChange={(page) => setOrdersPage(page)}
              onOrderSelect={(order) => setSelectedOrder(order)}
              loading={ordersLoading}
            />
            {selectedOrder && (
              <OrderDetail
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
                onRefund={handleOrderRefund}
              />
            )}
          </>
        )
      case 'reservations':
        return (
          <>
            <ReservationsList
              reservations={reservations}
              pagination={reservationsPagination}
              onPageChange={(page) => setReservationsPage(page)}
              onReservationSelect={(reservation) => setSelectedReservation(reservation)}
              loading={reservationsLoading}
            />
            {selectedReservation && (
              <ReservationDetail
                reservation={selectedReservation}
                onClose={() => setSelectedReservation(null)}
                onConfirm={handleReservationConfirm}
                onCancel={handleReservationCancel}
                onComplete={handleReservationComplete}
                onNoShow={handleReservationNoShow}
              />
            )}
          </>
        )
      case 'financials':
        return (
          <>
            <FinancialsOverview data={financialsOverview} loading={!financialsOverview} />
            <div className="financials-tabs">
              <button 
                className={`tab ${financialsSubTab === 'overview' ? 'active' : ''}`}
                onClick={() => setFinancialsSubTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`tab ${financialsSubTab === 'transactions' ? 'active' : ''}`}
                onClick={() => setFinancialsSubTab('transactions')}
              >
                Transactions
              </button>
              <button 
                className={`tab ${financialsSubTab === 'payouts' ? 'active' : ''}`}
                onClick={() => setFinancialsSubTab('payouts')}
              >
                Payouts
              </button>
              <button 
                className={`tab ${financialsSubTab === 'refunds' ? 'active' : ''}`}
                onClick={() => setFinancialsSubTab('refunds')}
              >
                Refunds
              </button>
            </div>
            {financialsSubTab === 'transactions' && (
              <FinancialsList
                type="transactions"
                data={transactions}
                pagination={null}
                onPageChange={(page) => setFinancialsPage(page)}
                loading={financialsLoading}
              />
            )}
            {financialsSubTab === 'payouts' && (
              <FinancialsList
                type="payouts"
                data={payouts}
                pagination={null}
                onPageChange={(page) => setFinancialsPage(page)}
                onProcess={handleProcessPayout}
                onCreatePayout={() => setShowCreatePayout(true)}
                loading={financialsLoading}
              />
            )}
            {financialsSubTab === 'refunds' && (
              <FinancialsList
                type="refunds"
                data={refunds}
                pagination={null}
                onPageChange={(page) => setFinancialsPage(page)}
                onProcess={handleProcessRefund}
                loading={financialsLoading}
              />
            )}
            {showCreatePayout && (
              <CreatePayoutModal
                restaurants={restaurants}
                onClose={() => setShowCreatePayout(false)}
                onCreate={handleCreatePayout}
              />
            )}
          </>
        )
      case 'tickets':
        return (
          <>
            <TicketStats stats={ticketStats} loading={!ticketStats} />
            <TicketsList
              tickets={tickets}
              pagination={ticketsPagination}
              onPageChange={(page) => setTicketsPage(page)}
              onTicketSelect={(ticket) => setSelectedTicket(ticket)}
              onCreateTicket={() => setShowCreateTicket(true)}
              loading={ticketsLoading}
            />
            {selectedTicket && (
              <TicketDetail
                ticket={selectedTicket}
                onClose={() => setSelectedTicket(null)}
                onReply={handleTicketReply}
                onAssign={handleTicketAssign}
                onResolve={handleTicketResolve}
                onCloseTicket={handleTicketClose}
                users={users}
              />
            )}
          </>
        )
      case 'settings':
        return (
          <Settings
            settings={settings}
            features={settingsFeatures}
            onSaveGeneral={(data) => handleSaveSettings('general', data)}
            onSavePayment={(data) => handleSaveSettings('payment', data)}
            onSaveEmail={(data) => handleSaveSettings('email', data)}
            onSaveSMS={(data) => handleSaveSettings('sms', data)}
            onSaveNotifications={(data) => handleSaveSettings('notifications', data)}
            onSaveFeatures={handleSaveFeatures}
            onSaveLegal={(data) => handleSaveSettings('legal', data)}
            onToggleMaintenance={handleToggleMaintenance}
            loading={settingsLoading}
          />
        )
      case 'notifications':
        return (
          <Notifications
            users={users}
            onSendNotification={handleSendNotification}
            onBroadcastNotification={handleBroadcastNotification}
            loading={notificationsLoading}
          />
        )
      case 'blacklist':
        return (
          <>
            <BlacklistList
              entries={blacklistEntries}
              pagination={blacklistPagination}
              onPageChange={(page) => setBlacklistPage(page)}
              onAddEntry={() => setShowAddBlacklist(true)}
              onRemoveEntry={handleRemoveBlacklist}
              onCheckPhone={handleCheckBlacklist}
              loading={blacklistLoading}
            />
            {showAddBlacklist && (
              <AddBlacklistModal
                onClose={() => setShowAddBlacklist(false)}
                onSubmit={handleAddBlacklist}
              />
            )}
          </>
        )
      case 'logs':
        return (
          <>
            <LogStats stats={logStats} loading={!logStats} />
            <AuditLogs
              logs={auditLogs}
              pagination={logsPagination}
              onPageChange={(page) => setLogsPage(page)}
              loading={logsLoading}
            />
          </>
        )
      default:
        return <RealtimeStats data={realtimeStats} loading={!realtimeStats && loading} />
    }
  }

  return (
    <div className="dashboard">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="main-content">
        <Header title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} />
        {renderContent()}
      </main>
    </div>
  )
}
