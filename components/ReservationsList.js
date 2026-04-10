'use client'

import { useState } from 'react'

export default function ReservationsList({ 
  reservations, 
  pagination, 
  onPageChange, 
  onReservationSelect,
  loading 
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredReservations = reservations.filter(reservation => {
    const searchLower = searchTerm.toLowerCase()
    const userName = reservation.userId?.name || ''
    const restaurantName = reservation.restaurantId?.en?.name || reservation.restaurantId?.ar?.name || ''
    const matchesSearch = 
      userName.toLowerCase().includes(searchLower) ||
      reservation.userId?.phone?.includes(searchTerm) ||
      restaurantName.toLowerCase().includes(searchLower) ||
      reservation.tableNumber?.toString().includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="status-badge confirmed">Confirmed</span>
      case 'pending':
        return <span className="status-badge pending">Pending</span>
      case 'cancelled':
        return <span className="status-badge cancelled">Cancelled</span>
      case 'completed':
        return <span className="status-badge completed">Completed</span>
      case 'no-show':
        return <span className="status-badge no-show">No Show</span>
      default:
        return <span className="status-badge">{status}</span>
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (timeString) => {
    if (!timeString) return ''
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="card reservations-list loading-card">
        <div className="card-header">
          <h3 className="card-title">Reservations Management</h3>
        </div>
        <div className="filters-bar skeleton-filters">
          <div className="skeleton-text" style={{ width: '200px', height: '40px' }}></div>
          <div className="skeleton-text" style={{ width: '120px', height: '40px' }}></div>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Restaurant</th>
                <th>Date & Time</th>
                <th>Guests</th>
                <th>Table</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[1,2,3,4,5].map(i => (
                <tr key={i}>
                  <td><div className="skeleton-text" style={{ width: '150px' }}></div></td>
                  <td><div className="skeleton-text" style={{ width: '180px' }}></div></td>
                  <td><div className="skeleton-text" style={{ width: '120px' }}></div></td>
                  <td><div className="skeleton-text" style={{ width: '60px' }}></div></td>
                  <td><div className="skeleton-text" style={{ width: '70px' }}></div></td>
                  <td><div className="skeleton-text" style={{ width: '80px' }}></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="card reservations-list">
      <div className="card-header">
        <h3 className="card-title">Reservations Management</h3>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search by customer, restaurant, or table..."
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
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
          <option value="no-show">No Show</option>
        </select>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Restaurant</th>
              <th>Date & Time</th>
              <th>Guests</th>
              <th>Table</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map((reservation, index) => (
              <tr 
                key={reservation._id} 
                onClick={() => onReservationSelect(reservation)}
                className="clickable-row"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <td>
                  <div className="user-cell">
                    <div className="user-avatar-text">
                      {reservation.userId?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="user-info">
                      <span className="user-name">{reservation.userId?.name || 'Unknown'}</span>
                      <span className="user-phone">{reservation.userId?.phone}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="restaurant-name">
                    {reservation.restaurantId?.en?.name || reservation.restaurantId?.ar?.name || 'Unknown'}
                  </span>
                </td>
                <td>
                  <div className="datetime-cell">
                    <span className="date">{formatDate(reservation.reservationDate)}</span>
                    <span className="time">{formatTime(reservation.reservationTime)}</span>
                  </div>
                </td>
                <td>
                  <span className="guests-count">
                    {reservation.numberOfGuests} {reservation.numberOfGuests === 1 ? 'Guest' : 'Guests'}
                  </span>
                </td>
                <td>
                  <span className="table-number">
                    {reservation.tableNumber ? `Table ${reservation.tableNumber}` : 'Not assigned'}
                  </span>
                </td>
                <td>{getStatusBadge(reservation.status)}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={(e) => { e.stopPropagation(); onReservationSelect(reservation); }}
                  >
                    View
                  </button>
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
