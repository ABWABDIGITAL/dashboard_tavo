'use client'

import { useState } from 'react'

export default function OrdersList({ 
  orders, 
  pagination, 
  onPageChange, 
  onOrderSelect,
  loading 
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')

  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = 
      order.orderNumber?.toLowerCase().includes(searchLower) ||
      order.userId?.name?.toLowerCase().includes(searchLower) ||
      order.userId?.phone?.includes(searchTerm) ||
      order.restaurantId?.en?.name?.toLowerCase().includes(searchLower) ||
      order.restaurantId?.ar?.name?.toLowerCase().includes(searchLower)
    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter
    return matchesSearch && matchesStatus && matchesPayment
  })

  const getOrderStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="status-badge confirmed">Confirmed</span>
      case 'draft':
        return <span className="status-badge draft">Draft</span>
      case 'cancelled':
        return <span className="status-badge cancelled">Cancelled</span>
      case 'delivered':
        return <span className="status-badge delivered">Delivered</span>
      default:
        return <span className="status-badge">{status}</span>
    }
  }

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <span className="payment-badge paid">Paid</span>
      case 'pending':
        return <span className="payment-badge pending">Pending</span>
      case 'refunded':
        return <span className="payment-badge refunded">Refunded</span>
      default:
        return <span className="payment-badge">{status}</span>
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price) => {
    return `SAR ${price?.toFixed(2) || '0.00'}`
  }

  if (loading) {
    return (
      <div className="card orders-list loading-card">
        <div className="card-header">
          <h3 className="card-title">Orders Management</h3>
        </div>
        <div className="filters-bar skeleton-filters">
          <div className="skeleton-text" style={{ width: '200px', height: '40px' }}></div>
          <div className="skeleton-text" style={{ width: '120px', height: '40px' }}></div>
          <div className="skeleton-text" style={{ width: '120px', height: '40px' }}></div>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Restaurant</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {[1,2,3,4,5].map(i => (
                <tr key={i}>
                  <td><div className="skeleton-text" style={{ width: '120px' }}></div></td>
                  <td><div className="skeleton-text" style={{ width: '150px' }}></div></td>
                  <td><div className="skeleton-text" style={{ width: '180px' }}></div></td>
                  <td><div className="skeleton-text" style={{ width: '80px' }}></div></td>
                  <td><div className="skeleton-text" style={{ width: '70px' }}></div></td>
                  <td><div className="skeleton-text" style={{ width: '60px' }}></div></td>
                  <td><div className="skeleton-text" style={{ width: '120px' }}></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="card orders-list">
      <div className="card-header">
        <h3 className="card-title">Orders Management</h3>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search by order #, customer, or restaurant..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input search-input"
        />
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)} 
          className="form-input filter-select"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="confirmed">Confirmed</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select 
          value={paymentFilter} 
          onChange={(e) => setPaymentFilter(e.target.value)} 
          className="form-input filter-select"
        >
          <option value="all">All Payment</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Restaurant</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr 
                key={order._id} 
                onClick={() => onOrderSelect(order)}
                className="clickable-row"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <td>
                  <span className="order-number">{order.orderNumber}</span>
                </td>
                <td>
                  <div className="user-cell">
                    <span className="user-name">{order.userId?.name || 'Unknown'}</span>
                    <span className="user-phone">{order.userId?.phone}</span>
                  </div>
                </td>
                <td>
                  <span className="restaurant-name">
                    {order.restaurantId?.en?.name || order.restaurantId?.ar?.name || 'Unknown'}
                  </span>
                </td>
                <td>
                  <span className="items-count">{order.menuItems?.length || 0} items</span>
                </td>
                <td>
                  <span className="order-total">{formatPrice(order.totalPrice)}</span>
                </td>
                <td>{getOrderStatusBadge(order.orderStatus)}</td>
                <td>{getPaymentStatusBadge(order.paymentStatus)}</td>
                <td>
                  <span className="order-date">{formatDate(order.createdAt)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="pagination">
          <button
            disabled={pagination.page <= 1}
            onClick={() => onPageChange(pagination.page - 1)}
            className="btn btn-sm btn-secondary"
          >
            Previous
          </button>
          <span className="page-info">
            Page {pagination.page} of {pagination.pages} ({pagination.total} total)
          </span>
          <button
            disabled={pagination.page >= pagination.pages}
            onClick={() => onPageChange(pagination.page + 1)}
            className="btn btn-sm btn-secondary"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
